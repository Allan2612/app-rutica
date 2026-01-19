import { supabase } from '@/lib/supabase/client';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export interface AttractionDetailForEdit {
    id: string;
    name: string;
    description: string | null;
    categoryIds: string[];
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
    province: string | null;
    canton: string | null;
    district: string | null;
    address: string | null;
    latitude: number;
    longitude: number;
    coverImage?: string | null;
    galleryImages?: string[];
}

function getImageUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
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
 * Obtiene una atracción por ID para edición
 */
export async function getAttractionById(
    attractionId: string,
    userId: string
): Promise<AttractionDetailForEdit> {
    const { data: attractionData, error: attractionError } = await supabase
        .from('attractions')
        .select(`
            id_atr,
            name_atr,
            description_atr,
            submitted_by_atr,
            location_id_atr,
            locations (
                province_loc,
                canton_loc,
                district_loc,
                address_loc,
                latitude_loc,
                longitude_loc
            ),
            attraction_images (
                id_aim,
                bucket_aim,
                path_aim,
                sort_order_aim
            ),
            attraction_category_map (
                category_id_acm
            )
        `)
        .eq('id_atr', attractionId)
        .single();

    if (attractionError) throw attractionError;
    if (!attractionData) throw new Error('No se encontró la atracción');
    if (attractionData.submitted_by_atr !== userId) {
        throw new Error('No tienes permiso para editar esta atracción');
    }

    const location = attractionData.locations as any;
    const images = (attractionData.attraction_images as any[]) || [];
    const categoryMaps = (attractionData.attraction_category_map as any[]) || [];

    const coverImage = images.find((img) => img.sort_order_aim === 0);
    const galleryImages = images
        .filter((img) => img.sort_order_aim > 0)
        .sort((a, b) => a.sort_order_aim - b.sort_order_aim);

    return {
        id: attractionData.id_atr,
        name: attractionData.name_atr,
        description: attractionData.description_atr,
        categoryIds: categoryMaps.map((cm) => cm.category_id_acm),
        province: location?.province_loc ?? null,
        canton: location?.canton_loc ?? null,
        district: location?.district_loc ?? null,
        address: location?.address_loc ?? null,
        latitude: location?.latitude_loc ?? 0,
        longitude: location?.longitude_loc ?? 0,
        coverUrl: coverImage ? getImageUrl(coverImage.bucket_aim, coverImage.path_aim) : null,
        galleryUrls: galleryImages.map((img) => getImageUrl(img.bucket_aim, img.path_aim)),
    };
}

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
    if (attraction.submitted_by_atr !== userId) {
        throw new Error('No tienes permiso para editar esta atracción');
    }

    // 1. Actualizar ubicación
    if (attraction.location_id_atr) {
        const { error: locationError } = await supabase
            .from('locations')
            .update({
                province_loc: data.province,
                canton_loc: data.canton,
                district_loc: data.district,
                address_loc: data.address,
                latitude_loc: data.latitude,
                longitude_loc: data.longitude,
            })
            .eq('id_loc', attraction.location_id_atr);

        if (locationError) throw locationError;
    }

    // 2. Actualizar atracción
    const { error: updateError } = await supabase
        .from('attractions')
        .update({
            name_atr: data.name,
            description_atr: data.description,
            updated_at_atr: new Date().toISOString(),
        })
        .eq('id_atr', attractionId);

    if (updateError) throw updateError;

    // 3. Actualizar categorías
    await supabase
        .from('attraction_category_map')
        .delete()
        .eq('attraction_id_acm', attractionId);

    if (data.categoryIds.length > 0) {
        const categoryMaps = data.categoryIds.map((catId) => ({
            attraction_id_acm: attractionId,
            category_id_acm: catId,
        }));

        await supabase.from('attraction_category_map').insert(categoryMaps);
    }

    // 5. Manejar imágenes
    await handleImageUpdates(attractionId, data);
}

async function handleImageUpdates(
    attractionId: string,
    data: UpdateAttractionData
): Promise<void> {
    // Obtener imágenes actuales
    const { data: currentImages } = await supabase
        .from('attraction_images')
        .select('*')
        .eq('attraction_id_aim', attractionId);

    const images = currentImages || [];
    const currentCover = images.find((img) => img.sort_order_aim === 0);
    const currentGallery = images.filter((img) => img.sort_order_aim > 0);

    // Cover
    if (data.coverImage !== undefined) {
        if (isNewImage(data.coverImage)) {
            // Eliminar cover anterior
            if (currentCover) {
                await supabase.storage.from('attractions-images').remove([currentCover.path_aim]);
                await supabase.from('attraction_images').delete().eq('id_aim', currentCover.id_aim);
            }
            // Subir nuevo
            await uploadImage(data.coverImage!, attractionId, 'cover', 0);
        } else if (data.coverImage === null && currentCover) {
            // Eliminar cover
            await supabase.storage.from('attraction-images').remove([currentCover.path_aim]);
            await supabase.from('attraction_images').delete().eq('id_aim', currentCover.id_aim);
        }
    }

    // Gallery
    if (data.galleryImages !== undefined) {
        const existingGalleryUrls = data.galleryImages.filter(
            (uri) => uri.includes('supabase.co')
        );
        const newGalleryUris = data.galleryImages.filter((uri) => isNewImage(uri));

        // Eliminar imágenes que ya no están
        for (const img of currentGallery) {
            const imgUrl = getImageUrl(img.bucket_aim, img.path_aim);
            if (!existingGalleryUrls.includes(imgUrl)) {
                await supabase.storage.from('attractions-images').remove([img.path_aim]);
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

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileName = `${type}-${timestamp}-${random}.${fileExt}`;
    const filePath = `${attractionId}/${fileName}`;

    const contentType = fileExt === 'png' ? 'image/png' : fileExt === 'webp' ? 'image/webp' : 'image/jpeg';

    const { error: uploadError } = await supabase.storage
        .from('attractions-images')
        .upload(filePath, uploadData, {
            contentType,
            upsert: false,
        });

    if (uploadError) throw uploadError;

    const { error: insertError } = await supabase.from('attraction_images').insert({
        attraction_id_aim: attractionId,
        image_type_aim: 'image',
        bucket_aim: 'attractions-images',
        path_aim: filePath,
        sort_order_aim: sortOrder,
    });

    if (insertError) {
        throw insertError;
    }
}
