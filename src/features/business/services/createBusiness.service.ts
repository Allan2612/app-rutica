import { supabase } from '@/lib/supabase/client';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export interface CreateBusinessData {
    name: string;
    description?: string;
    categoryIds: string[];

    // Location
    province?: string;
    canton?: string;
    district?: string;
    address?: string;
    latitude: number;
    longitude: number;

    // Contact
    phone?: string;
    email?: string;
    website?: string;

    // Social Links
    facebook?: string;
    instagram?: string;
    tiktok?: string;

    // Images
    logoUri?: string | null;
    coverUri?: string | null;
    galleryUris: string[]; // Hasta 3
}

async function uploadImage(
    imageUri: string,
    businessId: string,
    fileName: string
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
            const fileExt = fileName.split('.').pop() || 'jpg';
            blob = new Blob([byteArray], { type: `image/${fileExt}` });
        }

        const fileExt = fileName.split('.').pop() || 'jpg';
        const filePath = `${businessId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('business-images')
            .upload(filePath, blob, {
                contentType: `image/${fileExt}`,
                upsert: false,
            });

        if (error) throw error;
        return filePath;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

/**
 * Crea un nuevo negocio con toda su información
 */
export async function createBusinessComplete(
    userId: string,
    data: CreateBusinessData
): Promise<string> {
    try {
        // 1. Crear ubicación
        const { data: location, error: locationError } = await supabase
            .from('locations')
            .insert({
                id_loc: generateUUID(),
                country_loc: 'Costa Rica',
                province_loc: data.province ?? null,
                canton_loc: data.canton ?? null,
                district_loc: data.district ?? null,
                address_loc: data.address ?? null,
                latitude_loc: data.latitude,
                longitude_loc: data.longitude,
            })
            .select()
            .single();

        if (locationError) throw locationError;

        // 2. Preparar social links
        const socialLinks: Record<string, string> = {};
        if (data.facebook) socialLinks.facebook = data.facebook;
        if (data.instagram) socialLinks.instagram = data.instagram;
        if (data.tiktok) socialLinks.tiktok = data.tiktok;

        // 3. Crear negocio
        const businessId = generateUUID();
        const { error: businessError } = await supabase
            .from('businesses')
            .insert({
                id_bus: businessId,
                owner_id_bus: userId,
                name_bus: data.name,
                description_bus: data.description ?? null,
                location_id_bus: location.id_loc,
                contact_phone_bus: data.phone ?? null,
                contact_email_bus: data.email ?? null,
                website_bus: data.website ?? null,
                social_links_bus: Object.keys(socialLinks).length > 0 ? socialLinks : null,
                moderation_status_bus: 'pending',
                is_active_bus: true,
            });

        if (businessError) throw businessError;

        // 4. Asociar categorías
        if (data.categoryIds.length > 0) {
            const categoryMaps = data.categoryIds.map((catId) => ({
                business_id_bcm: businessId,
                category_id_bcm: catId,
            }));

            const { error: categoryError } = await supabase
                .from('business_category_map')
                .insert(categoryMaps);

            if (categoryError) {
                console.error('Error associating categories:', categoryError);
            }
        }

        // 5. Subir imágenes
        const imagePromises: Promise<void>[] = [];

        // Logo
        if (data.logoUri) {
            imagePromises.push(
                (async () => {
                    try {
                        const filePath = await uploadImage(data.logoUri!, businessId, 'logo.jpg');
                        await supabase.from('business_images').insert({
                            id_bim: generateUUID(),
                            business_id_bim: businessId,
                            image_type_bim: 'logo',
                            bucket_bim: 'business-images',
                            path_bim: filePath,
                            sort_order_bim: 0,
                        });
                    } catch (error) {
                        console.error('Error uploading logo:', error);
                    }
                })()
            );
        }

        // Cover
        if (data.coverUri) {
            imagePromises.push(
                (async () => {
                    try {
                        const filePath = await uploadImage(data.coverUri!, businessId, 'cover.jpg');
                        await supabase.from('business_images').insert({
                            id_bim: generateUUID(),
                            business_id_bim: businessId,
                            image_type_bim: 'cover',
                            bucket_bim: 'business-images',
                            path_bim: filePath,
                            sort_order_bim: 1,
                        });
                    } catch (error) {
                        console.error('Error uploading cover:', error);
                    }
                })()
            );
        }

        // Gallery (hasta 3)
        data.galleryUris.forEach((uri, index) => {
            imagePromises.push(
                (async () => {
                    try {
                        const filePath = await uploadImage(uri, businessId, `gallery-${index}.jpg`);
                        await supabase.from('business_images').insert({
                            id_bim: generateUUID(),
                            business_id_bim: businessId,
                            image_type_bim: 'gallery',
                            bucket_bim: 'business-images',
                            path_bim: filePath,
                            sort_order_bim: 2 + index,
                        });
                    } catch (error) {
                        console.error(`Error uploading gallery image ${index}:`, error);
                    }
                })()
            );
        });

        await Promise.all(imagePromises);

        return businessId;
    } catch (error) {
        console.error('Error creating business:', error);
        throw error;
    }
}
