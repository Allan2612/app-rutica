import { supabase } from '@/lib/supabase/client';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export interface CreateAttractionData {
    name: string;
    description: string | null;
    categoryIds: string[];
    province: string | null;
    canton: string | null;
    district: string | null;
    address: string | null;
    latitude: number;
    longitude: number;
    coverUri: string | null;
    galleryUris: string[];
}

async function uploadImage(
    imageUri: string,
    attractionId: string,
    fileName: string
): Promise<string> {
    try {
        let uploadData: Blob | ArrayBuffer;
        let fileExt = 'jpg';

        if (Platform.OS === 'web' || imageUri.startsWith('blob:')) {
            const response = await fetch(imageUri);
            uploadData = await response.blob();
            const mimeType = (uploadData as Blob).type;
            if (mimeType === 'image/png') fileExt = 'png';
            else if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') fileExt = 'jpg';
            else if (mimeType === 'image/webp') fileExt = 'webp';
        } else {
            const uriParts = imageUri.split('.');
            if (uriParts.length > 1) {
                const lastPart = uriParts[uriParts.length - 1].toLowerCase();
                if (['jpg', 'jpeg', 'png', 'webp'].includes(lastPart)) {
                    fileExt = lastPart === 'jpeg' ? 'jpg' : lastPart;
                }
            }

            const base64Data = await FileSystem.readAsStringAsync(imageUri, {
                encoding: 'base64',
            });

            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            uploadData = byteArray.buffer;
        }

        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const baseFileName = fileName.split('.')[0];
        const filePath = `${attractionId}/${baseFileName}-${timestamp}-${random}.${fileExt}`;

        const contentType = fileExt === 'png' ? 'image/png' : fileExt === 'webp' ? 'image/webp' : 'image/jpeg';

        const { error } = await supabase.storage.from('attractions-images').upload(filePath, uploadData, {
            contentType,
            upsert: false,
        });

        if (error) throw error;
        return filePath;
    } catch (error) {
        throw error;
    }
}

export async function createAttractionComplete(
    userId: string,
    data: CreateAttractionData
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

        // 2. Crear atracción
        const attractionId = generateUUID();
        
        const { error: attractionError } = await supabase
            .from('attractions')
            .insert({
                id_atr: attractionId,
                submitted_by_atr: userId,
                name_atr: data.name,
                description_atr: data.description,
                location_id_atr: location.id_loc,
                moderation_status_atr: 'pending',
                is_active_atr: true,
            });

        if (attractionError) throw attractionError;

        // 4. Asociar categorías
        if (data.categoryIds.length > 0) {
            const categoryMaps = data.categoryIds.map((catId) => ({
                attraction_id_acm: attractionId,
                category_id_acm: catId,
            }));

            const { error: categoryError } = await supabase
                .from('attraction_category_map')
                .insert(categoryMaps);

            if (categoryError) {
            }
        }

        // 5. Subir imágenes
        const imagePromises: Promise<void>[] = [];

        // Cover
        if (data.coverUri) {
            imagePromises.push(
                (async () => {
                    try {
                        const filePath = await uploadImage(data.coverUri!, attractionId, 'cover.jpg');
                        const { error: insertError } = await supabase.from('attraction_images').insert({
                            attraction_id_aim: attractionId,
                            image_type_aim: 'image',
                            bucket_aim: 'attractions-images',
                            path_aim: filePath,
                            sort_order_aim: 0,
                        });
                        if (insertError) {
                            throw insertError;
                        }
                    } catch (error) {
                    }
                })()
            );
        }

        // Gallery (hasta 3)
        data.galleryUris.forEach((uri, index) => {
            imagePromises.push(
                (async () => {
                    try {
                        const filePath = await uploadImage(uri, attractionId, `gallery-${index}.jpg`);
                        const { error: insertError } = await supabase.from('attraction_images').insert({
                            attraction_id_aim: attractionId,
                            image_type_aim: 'image',
                            bucket_aim: 'attractions-images',
                            path_aim: filePath,
                            sort_order_aim: index + 1,
                        });
                        if (insertError) {
                            throw insertError;
                        }
                    } catch (error) {
                    }
                })()
            );
        });

        await Promise.all(imagePromises);

        return attractionId;
    } catch (error) {
        throw error;
    }
}
