import { supabase } from '@/lib/supabase/client';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { findOrCreateLocationHierarchy, validateLocationData, type LocationHierarchy } from '@/services/locations.service';
import { canUserEdit } from '@/utils/permissionHelpers';
import { syncResourceUsage } from '@/services/subscriptionQuota.service';

// ============================================
// Constants
// ============================================

const STORAGE_BUCKET = 'attractions-images';

// ============================================
// Types
// ============================================

export interface AttractionDetailForEdit {
    id: string;
    name: string;
    description: string | null;
    categoryIds: string[];
    districtId: string | null; // V3: ID del distrito
    province: string | null;
    canton: string | null;
    district: string | null;
    address: string | null;
    latitude: number;
    longitude: number;
    coverUrl: string | null;
    galleryUrls: string[];
}

export interface UpdateAttractionData {
    name: string;
    description: string | null;
    categoryIds: string[];
    country: string;         // Nombre del país
    province: string;        // Nombre de la provincia
    canton: string;          // Nombre del cantón
    district: string;        // Nombre del distrito
    address: string | null;
    latitude: number;
    longitude: number;
    coverImage?: string | null;
    galleryImages?: string[];
    isActive?: boolean;
}

// ============================================
// Helpers
// ============================================

function getImageUrl(path: string): string {
    if (!path) return '';
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

function isNewImage(uri: string | null | undefined): boolean {
    if (!uri) return false;
    return (
        !uri.includes('supabase.co') &&
        (uri.startsWith('file://') || uri.startsWith('blob:') || uri.startsWith('data:'))
    );
}

/**
 * Extrae el tipo de imagen del path (V3)
 */
function getImageTypeFromPath(path: string): string {
    if (!path) return '';
    const filename = path.split('/').pop() || '';
    return filename.split('-')[0];
}

// ============================================
// Get Attraction for Edit
// ============================================

/**
 * Obtiene una atracción por ID para edición
 */
export async function getAttractionById(
    attractionId: string,
    userId: string
): Promise<AttractionDetailForEdit> {
    interface AttractionEditQueryResult {
        id_atr: string;
        name_atr: string;
        description_atr: string | null;
        submitted_by_atr: string | null;
        location_id_atr: string | null;
        locations: {
            district_id_loc: string | null;
            address_loc: string | null;
            latitude_loc: number | null;
            longitude_loc: number | null;
            districts: {
                id_dst: string;
                name_dst: string;
                cantons: {
                    id_ctn: string;
                    name_ctn: string;
                    provinces: {
                        id_prv: string;
                        name_prv: string;
                    } | null;
                } | null;
            } | null;
        } | null;
        attraction_images: Array<{
            id_aim: string;
            path_aim: string;
            sort_order_aim: number;
        }> | null;
        attraction_category_map: Array<{
            category_id_acm: string;
        }> | null;
    }

    const { data: attractionData, error: attractionError } = await supabase
        .from('attractions')
        .select(
            `
      id_atr,
      name_atr,
      description_atr,
      submitted_by_atr,
      location_id_atr,
      locations!attractions_location_id_atr_fkey (
        district_id_loc,
        address_loc,
        latitude_loc,
        longitude_loc,
        districts!locations_district_id_fkey (
          id_dst,
          name_dst,
          cantons!districts_canton_id_fkey (
            id_ctn,
            name_ctn,
            provinces!cantons_province_id_fkey (
              id_prv,
              name_prv
            )
          )
        )
      ),
      attraction_images (
        id_aim,
        path_aim,
        sort_order_aim
      ),
      attraction_category_map (
        category_id_acm
      )
    `
        )
        .eq('id_atr', attractionId)
        .single<AttractionEditQueryResult>();

    if (attractionError) throw attractionError;
    if (!attractionData) throw new Error('No se encontró la atracción');

    // Verificar permisos: debe ser el colaborador O admin
    const hasPermission = await canUserEdit(userId, attractionData.submitted_by_atr);
    if (!hasPermission) {
        throw new Error('No tienes permiso para editar esta atracción');
    }

    const location = attractionData.locations;
    const images = attractionData.attraction_images || [];
    const categoryMaps = attractionData.attraction_category_map || [];

    // V3: Extraer jerarquía de ubicación
    const districtData = location?.districts;
    const cantonData = districtData?.cantons;
    const provinceData = cantonData?.provinces;

    // V3: Identificar cover por prefix 'cover' o sort_order 0
    const coverImage = images.find(
        (img) => getImageTypeFromPath(img.path_aim) === 'cover' || img.sort_order_aim === 0
    );
    const galleryImages = images
        .filter((img) => img !== coverImage)
        .sort((a, b) => a.sort_order_aim - b.sort_order_aim);

    return {
        id: attractionData.id_atr,
        name: attractionData.name_atr,
        description: attractionData.description_atr,
        categoryIds: categoryMaps.map((cm) => cm.category_id_acm),
        districtId: location?.district_id_loc ?? null,
        province: provinceData?.name_prv ?? null,
        canton: cantonData?.name_ctn ?? null,
        district: districtData?.name_dst ?? null,
        address: location?.address_loc ?? null,
        latitude: location?.latitude_loc ?? 0,
        longitude: location?.longitude_loc ?? 0,
        coverUrl: coverImage ? getImageUrl(coverImage.path_aim) : null,
        galleryUrls: galleryImages.map((img) => getImageUrl(img.path_aim)),
    };
}

// ============================================
// Update Attraction
// ============================================

/**
 * Actualiza una atracción completa
 */
export async function updateAttractionComplete(
    attractionId: string,
    userId: string,
    data: UpdateAttractionData
): Promise<void> {
    // Verificar permisos
    const { data: attraction, error: attractionError } = await supabase
        .from('attractions')
        .select('submitted_by_atr, location_id_atr')
        .eq('id_atr', attractionId)
        .single();

    if (attractionError) throw attractionError;
    if (!attraction) {
        throw new Error('No se encontró la atracción');
    }

    // Verificar permisos: debe ser el colaborador O admin
    const hasPermission = await canUserEdit(userId, (attraction as any).submitted_by_atr);
    if (!hasPermission) {
        throw new Error('No tienes permiso para editar esta atracción');
    }

    // 1. Validar datos de ubicación
    const locationHierarchy: LocationHierarchy = {
        country: data.country,
        province: data.province,
        canton: data.canton,
        district: data.district,
    };

    if (!validateLocationData(locationHierarchy)) {
        throw new Error('Datos de ubicación incompletos');
    }

    // 2. Buscar o crear la jerarquía de ubicación y obtener district_id
    const districtId = await findOrCreateLocationHierarchy(locationHierarchy);

    // 3. Actualizar ubicación
    if ((attraction as any).location_id_atr) {
        const { error: locationError } = await supabase
            .from('locations')
            .update({
                district_id_loc: districtId,
                address_loc: data.address,
                latitude_loc: data.latitude,
                longitude_loc: data.longitude,
            } as never)
            .eq('id_loc', (attraction as any).location_id_atr);

        if (locationError) throw locationError;
    }

    // 4. Actualizar atracción
    const updateFields: any = {
        name_atr: data.name,
        description_atr: data.description,
        updated_at_atr: new Date().toISOString(),
    };
    
    if (data.isActive !== undefined) {
        updateFields.is_active_atr = data.isActive;
    }
    
    const { error: updateError } = await supabase
        .from('attractions')
        .update(updateFields as never)
        .eq('id_atr', attractionId);

    if (updateError) throw updateError;

    // 5. Actualizar categorías
    await supabase.from('attraction_category_map').delete().eq('attraction_id_acm', attractionId);

    if (data.categoryIds.length > 0) {
        const categoryMaps = data.categoryIds.map((catId) => ({
            attraction_id_acm: attractionId,
            category_id_acm: catId,
        }));

        await supabase.from('attraction_category_map').insert(categoryMaps as never);
    }

    // 6. Manejar imágenes
    await handleImageUpdates(attractionId, data);

    // 7. Sincronizar uso de recursos para la galería
    await syncResourceUsage(userId, 'photo_attraction', attractionId, 'attraction');
}

// ============================================
// Image Handling
// ============================================

async function handleImageUpdates(
    attractionId: string,
    data: UpdateAttractionData
): Promise<void> {
    interface AttractionImageRecord {
        id_aim: string;
        path_aim: string;
        sort_order_aim: number;
        attraction_id_aim: string;
        created_at_aim: string;
    }

    // Obtener imágenes actuales
    const { data: currentImages } = await supabase
        .from('attraction_images')
        .select('*')
        .eq('attraction_id_aim', attractionId)
        .returns<AttractionImageRecord[]>();

    const images = currentImages || [];

    // V3: Identificar cover por prefix o sort_order
    const currentCover = images.find(
        (img) => getImageTypeFromPath(img.path_aim) === 'cover' || img.sort_order_aim === 0
    );
    const currentGallery = images.filter((img) => img !== currentCover);

    // Cover
    if (data.coverImage !== undefined) {
        if (isNewImage(data.coverImage)) {
            // Eliminar cover anterior
            if (currentCover) {
                await supabase.storage.from(STORAGE_BUCKET).remove([currentCover.path_aim]);
                await supabase.from('attraction_images').delete().eq('id_aim', currentCover.id_aim);
            }
            // Subir nuevo
            await uploadImage(data.coverImage!, attractionId, 'cover', 0);
        } else if (data.coverImage === null && currentCover) {
            // Eliminar cover
            await supabase.storage.from(STORAGE_BUCKET).remove([currentCover.path_aim]);
            await supabase.from('attraction_images').delete().eq('id_aim', currentCover.id_aim);
        }
    }

    // Gallery
    if (data.galleryImages !== undefined) {
        const existingGalleryUrls = data.galleryImages.filter((uri) => uri.includes('supabase.co'));
        const newGalleryUris = data.galleryImages.filter((uri) => isNewImage(uri));

        // Eliminar imágenes que ya no están
        for (const img of currentGallery) {
            const imgUrl = getImageUrl(img.path_aim);
            if (!existingGalleryUrls.includes(imgUrl)) {
                await supabase.storage.from(STORAGE_BUCKET).remove([img.path_aim]);
                await supabase.from('attraction_images').delete().eq('id_aim', img.id_aim);
            }
        }

        // Subir nuevas
        const startIndex = existingGalleryUrls.length;
        for (let i = 0; i < newGalleryUris.length; i++) {
            await uploadImage(newGalleryUris[i], attractionId, 'gallery', startIndex + i + 1);
        }
    }
}

async function uploadImage(
    uri: string,
    attractionId: string,
    type: 'cover' | 'gallery',
    sortOrder: number
): Promise<void> {
    let uploadData: Blob | ArrayBuffer;
    let fileExt = 'jpg';

    if (Platform.OS === 'web' || uri.startsWith('blob:')) {
        const response = await fetch(uri);
        uploadData = await response.blob();
        const mimeType = (uploadData as Blob).type;
        if (mimeType === 'image/png') fileExt = 'png';
        else if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') fileExt = 'jpg';
        else if (mimeType === 'image/webp') fileExt = 'webp';
    } else {
        const uriParts = uri.split('.');
        if (uriParts.length > 1) {
            const lastPart = uriParts[uriParts.length - 1].toLowerCase();
            if (['jpg', 'jpeg', 'png', 'webp'].includes(lastPart)) {
                fileExt = lastPart === 'jpeg' ? 'jpg' : lastPart;
            }
        }

        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: 'base64',
        });

        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        uploadData = byteArray.buffer;
    }

    // V3: Path format -> <attraction_id>/<prefix>-<timestamp>-<random>.<ext>
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileName = `${type}-${timestamp}-${random}.${fileExt}`;
    const filePath = `${attractionId}/${fileName}`;

    const contentType =
        fileExt === 'png' ? 'image/png' : fileExt === 'webp' ? 'image/webp' : 'image/jpeg';

    const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, uploadData, {
            contentType,
            upsert: false,
        });

    if (uploadError) throw uploadError;

    // V3: Solo path_aim, sin bucket_aim ni image_type_aim
    const { error: insertError } = await supabase.from('attraction_images').insert({
        attraction_id_aim: attractionId,
        path_aim: filePath,
        sort_order_aim: sortOrder,
    } as never);

    if (insertError) {
        console.error('[uploadImage] Insert error:', insertError);
        throw insertError;
    }
}
