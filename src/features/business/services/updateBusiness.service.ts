import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { findOrCreateLocationHierarchy, validateLocationData, type LocationHierarchy } from '@/services/locations.service';
import type { BusinessDetailForEdit } from '@/types/entities/business';
import { canUserEdit } from '@/utils/permissionHelpers';

const BUCKET_NAME = 'business-images';

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export interface UpdateBusinessData {
    name: string;
    description: string | null;
    categoryIds: string[];
    country: string;
    province: string;
    canton: string;
    district: string;
    address: string | null;
    latitude: number;
    longitude: number;
    phone: string | null;
    email: string | null;
    website: string | null;
    facebook: string | null;
    instagram: string | null;
    tiktok: string | null;
    logoUri?: string | null;
    coverUri?: string | null;
    galleryUris?: string[];
}

function getImageUrl(path: string): string {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
    return data.publicUrl;
}

/**
 * Verifica si una URI es una imagen nueva (no está en Supabase)
 */
function isNewImage(uri: string | null | undefined): boolean {
    if (!uri) return false;
    return (
        !uri.includes('supabase.co') &&
        (uri.startsWith('file://') || uri.startsWith('blob:') || uri.startsWith('data:'))
    );
}

/**
 * Sube una imagen al storage, la registra en business_images y retorna el path
 */
async function uploadImage(
    imageUri: string,
    businessId: string,
    type: 'logo' | 'cover' | 'gallery',
    sortOrder: number
): Promise<string> {
    try {
        let blob: Blob;

        if (Platform.OS === 'web' || imageUri.startsWith('blob:')) {
            const response = await fetch(imageUri);
            blob = await response.blob();
        } else {
            const base64Data = await FileSystem.readAsStringAsync(imageUri, {
                encoding: 'base64',
            });

            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            blob = new Blob([byteArray], { type: 'image/jpeg' });
        }

        // Estructura: {businessId}/logo-{uuid}.jpg, {businessId}/cover-{uuid}.jpg, {businessId}/gallery-{uuid}.jpg
        const imageId = generateUUID();
        let filePath: string;
        if (type === 'gallery') {
            filePath = `${businessId}/gallery-${imageId}.jpg`;
        } else {
            filePath = `${businessId}/${type}-${imageId}.jpg`;
        }

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, blob, {
                contentType: 'image/jpeg',
                upsert: false, // No sobrescribir, cada imagen tiene UUID único
            });

        if (error) throw error;

        // Registrar en business_images
        const { error: insertError } = await (supabase as any)
            .from('business_images')
            .insert({
                id_bim: generateUUID(),
                business_id_bim: businessId,
                path_bim: filePath,
                sort_order_bim: sortOrder,
            });

        if (insertError) {
            console.error(`[uploadImage] Error insertando en business_images:`, insertError);
            throw insertError;
        }

        return filePath;
    } catch (error) {
        console.error(`[uploadImage] Error subiendo ${type}:`, error);
        throw error;
    }
}

/**
 * Obtiene un negocio por ID para edición
 */
export async function getBusinessForEdit(
    businessId: string,
    userId: string
): Promise<BusinessDetailForEdit> {
    const { data: businessData, error: businessError } = await (supabase as any)
        .from('businesses')
        .select(`
            id_bus,
            name_bus,
            description_bus,
            owner_id_bus,
            location_id_bus,
            contact_phone_bus,
            contact_email_bus,
            website_bus,
            social_links_bus
        `)
        .eq('id_bus', businessId)
        .single();

    if (businessError) throw businessError;
    if (!businessData) throw new Error('No se encontró el negocio');
    
    // Verificar permisos: debe ser el propietario O admin
    const hasPermission = await canUserEdit(userId, (businessData as any).owner_id_bus);
    if (!hasPermission) {
        throw new Error('No tienes permiso para editar este negocio');
    }

    let locationData: any = null;
    let countryName = 'Costa Rica';
    let provinceName = '';
    let cantonName = '';
    let districtName = '';

    if ((businessData as any).location_id_bus) {
        // Cargar location con jerarquía completa
        const { data: loc } = await supabase
            .from('locations')
            .select(`
                address_loc,
                latitude_loc,
                longitude_loc,
                districts!locations_district_id_fkey (
                    name_dst,
                    cantons!districts_canton_id_fkey (
                        name_ctn,
                        provinces!cantons_province_id_fkey (
                            name_prv,
                            countries!provinces_country_id_fkey (
                                name_cnt
                            )
                        )
                    )
                )
            `)
            .eq('id_loc', (businessData as any).location_id_bus)
            .single();

        if (loc) {
            locationData = loc;
            const district = (loc as any).districts;
            if (district) {
                districtName = district.name_dst || '';
                const canton = district.cantons;
                if (canton) {
                    cantonName = canton.name_ctn || '';
                    const province = canton.provinces;
                    if (province) {
                        provinceName = province.name_prv || '';
                        const country = province.countries;
                        if (country) {
                            countryName = country.name_cnt || 'Costa Rica';
                        }
                    }
                }
            }
        }
    }

    const { data: categoryMaps } = await supabase
        .from('business_category_map')
        .select('category_id_bcm')
        .eq('business_id_bcm', businessId);

    const categoryIds = (categoryMaps ?? [])
        .map((bcm: any) => bcm.category_id_bcm)
        .filter((id: string) => !!id);

    const socialLinks = (businessData as any).social_links_bus || {};

    // Cargar imágenes desde business_images table
    const { data: businessImages, error: imagesError } = await (supabase as any)
        .from('business_images')
        .select('path_bim, sort_order_bim')
        .eq('business_id_bim', businessId)
        .order('sort_order_bim', { ascending: true });

    if (imagesError) {
        console.error('Error loading business images:', imagesError);
    }

    // Mapear imágenes por sort_order (0=logo, 1=cover, 2+=gallery)
    let logoUrl: string | null = null;
    let coverUrl: string | null = null;
    const galleryUrls: string[] = [];

    (businessImages || []).forEach((img: any) => {
        const url = getImageUrl(img.path_bim);
        if (img.sort_order_bim === 0) {
            logoUrl = url;
        } else if (img.sort_order_bim === 1) {
            coverUrl = url;
        } else {
            galleryUrls.push(url);
        }
    });

    return {
        id: (businessData as any).id_bus,
        name: (businessData as any).name_bus,
        description: (businessData as any).description_bus,
        categoryIds,
        country: countryName,
        province: provinceName,
        canton: cantonName,
        district: districtName,
        address: (locationData as any)?.address_loc ?? null,
        latitude: (locationData as any)?.latitude_loc ?? 0,
        longitude: (locationData as any)?.longitude_loc ?? 0,
        phone: (businessData as any).contact_phone_bus,
        email: (businessData as any).contact_email_bus,
        website: (businessData as any).website_bus,
        facebook: (socialLinks as any).facebook ?? null,
        instagram: (socialLinks as any).instagram ?? null,
        tiktok: (socialLinks as any).tiktok ?? null,
        logoUrl,
        coverUrl,
        galleryUrls,
    };
}

/**
 * Actualiza un negocio existente
 */
export async function updateBusinessComplete(
    businessId: string,
    userId: string,
    data: UpdateBusinessData
): Promise<void> {
    try {
        // 1. Verificar permisos
        const { data: business } = await (supabase as any)
            .from('businesses')
            .select('owner_id_bus, location_id_bus')
            .eq('id_bus', businessId)
            .single();

        if (!business) {
            throw new Error('No se encontró el negocio');
        }

        // Verificar permisos: debe ser el propietario O admin
        const hasPermission = await canUserEdit(userId, (business as any).owner_id_bus);
        if (!hasPermission) {
            throw new Error('No tienes permiso para editar este negocio');
        }

        // 2. Actualizar o crear ubicación
        const locationHierarchy: LocationHierarchy = {
            country: data.country,
            province: data.province,
            canton: data.canton,
            district: data.district,
        };

        if (!validateLocationData(locationHierarchy)) {
            throw new Error('Datos de ubicación incompletos');
        }

        const districtId = await findOrCreateLocationHierarchy(locationHierarchy);

        if ((business as any).location_id_bus) {
            // Actualizar ubicación existente
            await (supabase as any)
                .from('locations')
                .update({
                    district_id_loc: districtId,
                    address_loc: data.address ?? null,
                    latitude_loc: data.latitude,
                    longitude_loc: data.longitude,
                })
                .eq('id_loc', (business as any).location_id_bus);
        } else {
            // Crear nueva ubicación
            const newLocationId = generateUUID();
            const { error: locError } = await (supabase as any)
                .from('locations')
                .insert({
                    id_loc: newLocationId,
                    district_id_loc: districtId,
                    address_loc: data.address ?? null,
                    latitude_loc: data.latitude,
                    longitude_loc: data.longitude,
                });

            if (locError) throw locError;

            // Actualizar negocio con nueva ubicación
            await (supabase as any)
                .from('businesses')
                .update({ location_id_bus: newLocationId })
                .eq('id_bus', businessId);
        }

        // 3. Manejar imágenes en business_images
        // Obtener imágenes actuales
        const { data: currentImages } = await supabase
            .from('business_images')
            .select('id_bim, path_bim, sort_order_bim')
            .eq('business_id_bim', businessId);

        // Logo (sort_order = 0)
        const currentLogo = (currentImages as any)?.find((img: any) => img.sort_order_bim === 0);

        if (data.logoUri === null) {
            // Eliminar logo
            if (currentLogo) {
                await supabase.storage.from(BUCKET_NAME).remove([currentLogo.path_bim]);
                await supabase.from('business_images').delete().eq('id_bim', currentLogo.id_bim);
            }
        } else if (data.logoUri && isNewImage(data.logoUri)) {
            // Reemplazar logo
            if (currentLogo) {
                await supabase.storage.from(BUCKET_NAME).remove([currentLogo.path_bim]);
                await supabase.from('business_images').delete().eq('id_bim', currentLogo.id_bim);
            }
            await uploadImage(data.logoUri, businessId, 'logo', 0);
        }

        // Cover (sort_order = 1)
        const currentCover = (currentImages as any)?.find((img: any) => img.sort_order_bim === 1);

        if (data.coverUri === null) {
            // Eliminar cover
            if (currentCover) {
                await supabase.storage.from(BUCKET_NAME).remove([currentCover.path_bim]);
                await supabase.from('business_images').delete().eq('id_bim', currentCover.id_bim);
            }
        } else if (data.coverUri && isNewImage(data.coverUri)) {
            // Reemplazar cover
            if (currentCover) {
                await supabase.storage.from(BUCKET_NAME).remove([currentCover.path_bim]);
                await supabase.from('business_images').delete().eq('id_bim', currentCover.id_bim);
            }
            await uploadImage(data.coverUri, businessId, 'cover', 1);
        }

        // Gallery (sort_order >= 2)
        if (data.galleryUris !== undefined) {
            const currentGallery = (currentImages as any)?.filter((img: any) => img.sort_order_bim > 1) || [];
            const existingUrls = data.galleryUris.filter(uri => !isNewImage(uri));
            const newUris = data.galleryUris.filter(uri => isNewImage(uri));

            // Eliminar imágenes que ya no están
            const imagesToDelete = currentGallery.filter((img: any) => {
                const url = getImageUrl(img.path_bim);
                return !existingUrls.includes(url);
            });

            if (imagesToDelete.length > 0) {
                const pathsToDelete = imagesToDelete.map((img: any) => img.path_bim);
                const idsToDelete = imagesToDelete.map((img: any) => img.id_bim);
                await supabase.storage.from(BUCKET_NAME).remove(pathsToDelete);
                await supabase.from('business_images').delete().in('id_bim', idsToDelete);
            }

            // Subir nuevas imágenes (hasta 4 total)
            const remainingCount = currentGallery.length - imagesToDelete.length;
            const maxNew = Math.min(newUris.length, 4 - remainingCount);

            for (let i = 0; i < maxNew; i++) {
                try {
                    await uploadImage(newUris[i], businessId, 'gallery', 2 + remainingCount + i);
                } catch (error) {
                    console.error(`Error subiendo galería ${i}:`, error);
                }
            }
        }

        // 4. Preparar social links
        const socialLinks: Record<string, string> = {};
        if (data.facebook) socialLinks.facebook = data.facebook;
        if (data.instagram) socialLinks.instagram = data.instagram;
        if (data.tiktok) socialLinks.tiktok = data.tiktok;

        // 5. Actualizar negocio
        const { error: businessError } = await (supabase as any)
            .from('businesses')
            .update({
                name_bus: data.name,
                description_bus: data.description ?? null,
                contact_phone_bus: data.phone ?? null,
                contact_email_bus: data.email ?? null,
                website_bus: data.website ?? null,
                social_links_bus: Object.keys(socialLinks).length > 0 ? socialLinks : null,
            })
            .eq('id_bus', businessId);

        if (businessError) throw businessError;

        // 6. Actualizar categorías
        await supabase.from('business_category_map').delete().eq('business_id_bcm', businessId);

        if (data.categoryIds.length > 0) {
            const categoryMaps = data.categoryIds.map((catId: string) => ({
                business_id_bcm: businessId,
                category_id_bcm: catId,
            }));
            await (supabase as any).from('business_category_map').insert(categoryMaps);
        }
    } catch (error) {
        console.error('[updateBusinessComplete] Error:', error);
        throw error;
    }
}
