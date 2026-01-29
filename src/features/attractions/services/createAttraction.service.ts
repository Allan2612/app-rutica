import { supabase } from '@/lib/supabase/client';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

// ============================================
// Constants
// ============================================

const STORAGE_BUCKET = 'attraction-images';

// ============================================
// Helpers
// ============================================

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Busca el district_id basándose en los nombres de province, canton y district
 * Usa búsqueda case-insensitive con ILIKE
 */
async function findDistrictId(
    province: string | null,
    canton: string | null,
    district: string | null
): Promise<string | null> {
    if (!province || !canton || !district) return null;

    interface DistrictQueryResult {
        id_dst: string;
        name_dst: string;
        cantons: {
            name_ctn: string;
            provinces: {
                name_prv: string;
            } | null;
        } | null;
    }

    const { data, error } = await supabase
        .from('districts')
        .select(`
            id_dst,
            name_dst,
            cantons!districts_canton_id_fkey (
                name_ctn,
                provinces!cantons_province_id_fkey (
                    name_prv
                )
            )
        `)
        .ilike('name_dst', district)
        .limit(50)
        .returns<DistrictQueryResult[]>();

    if (error || !data) return null;

    // Filtrar por canton y provincia
    const match = data.find((d) => {
        const cantonData = d.cantons;
        const provinceData = cantonData?.provinces;
        return (
            cantonData?.name_ctn?.toLowerCase() === canton.toLowerCase() &&
            provinceData?.name_prv?.toLowerCase() === province.toLowerCase()
        );
    });

    return match?.id_dst ?? null;
}

// ============================================
// Types
// ============================================

export interface CreateAttractionData {
    name: string;
    description: string | null;
    categoryIds: string[];
    province: string | null;
    canton: string | null;
    district: string | null;
    districtId?: string | null; // V3: ID del distrito (opcional, se busca si no viene)
    address: string | null;
    latitude: number;
    longitude: number;
    coverUri: string | null;
    galleryUris: string[];
}

// ============================================
// Image Upload
// ============================================

async function uploadImage(
    imageUri: string,
    attractionId: string,
    imageType: 'cover' | 'gallery',
    index: number
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

        // V3: Path format -> <attraction_id>/<prefix>-<timestamp>-<random>.<ext>
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const prefix = imageType === 'cover' ? 'cover' : `gallery`;
        const filePath = `${attractionId}/${prefix}-${timestamp}-${random}.${fileExt}`;

        const contentType =
            fileExt === 'png' ? 'image/png' : fileExt === 'webp' ? 'image/webp' : 'image/jpeg';

        const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, uploadData, {
            contentType,
            upsert: false,
        });

        if (error) throw error;
        return filePath;
    } catch (error) {
        console.error('[uploadImage] Error:', error);
        throw error;
    }
}

// ============================================
// Main Service Function
// ============================================

export async function createAttractionComplete(
    userId: string,
    data: CreateAttractionData
): Promise<string> {
    try {
        // 1. Obtener district_id (si no viene, buscarlo por nombres)
        let districtId = data.districtId;
        if (!districtId && data.province && data.canton && data.district) {
            districtId = await findDistrictId(data.province, data.canton, data.district);
        }

        if (!districtId) {
            throw new Error('No se pudo determinar el distrito. Verifica la ubicación seleccionada.');
        }

        // 2. Crear ubicación (V3: solo district_id_loc + coords)
        const locationId = generateUUID();
        const { error: locationError } = await supabase.from('locations').insert({
            id_loc: locationId,
            district_id_loc: districtId,
            address_loc: data.address ?? null,
            latitude_loc: data.latitude,
            longitude_loc: data.longitude,
        } as never);

        if (locationError) throw locationError;

        // 3. Crear atracción
        const attractionId = generateUUID();

        const { error: attractionError } = await supabase.from('attractions').insert({
            id_atr: attractionId,
            submitted_by_atr: userId,
            name_atr: data.name,
            description_atr: data.description,
            location_id_atr: locationId,
            moderation_status_atr: 'pending',
            is_active_atr: true,
        } as never);

        if (attractionError) throw attractionError;

        // 4. Asociar categorías
        if (data.categoryIds.length > 0) {
            const categoryMaps = data.categoryIds.map((catId) => ({
                attraction_id_acm: attractionId,
                category_id_acm: catId,
            }));

            const { error: categoryError } = await supabase
                .from('attraction_category_map')
                .insert(categoryMaps as never);

            if (categoryError) {
                console.error('[createAttraction] Category map error:', categoryError);
            }
        }

        // 5. Subir imágenes (V3: solo path_aim, sin bucket_aim ni image_type_aim)
        const imagePromises: Promise<void>[] = [];

        // Cover
        if (data.coverUri) {
            imagePromises.push(
                (async () => {
                    try {
                        const filePath = await uploadImage(data.coverUri!, attractionId, 'cover', 0);
                        const { error: insertError } = await supabase.from('attraction_images').insert({
                            attraction_id_aim: attractionId,
                            path_aim: filePath,
                            sort_order_aim: 0,
                        } as never);
                        if (insertError) {
                            console.error('[createAttraction] Cover image insert error:', insertError);
                        }
                    } catch (error) {
                        console.error('[createAttraction] Cover upload error:', error);
                    }
                })()
            );
        }

        // Gallery (hasta 3)
        data.galleryUris.forEach((uri, index) => {
            imagePromises.push(
                (async () => {
                    try {
                        const filePath = await uploadImage(uri, attractionId, 'gallery', index);
                        const { error: insertError } = await supabase.from('attraction_images').insert({
                            attraction_id_aim: attractionId,
                            path_aim: filePath,
                            sort_order_aim: index + 1,
                        } as never);
                        if (insertError) {
                            console.error('[createAttraction] Gallery image insert error:', insertError);
                        }
                    } catch (error) {
                        console.error('[createAttraction] Gallery upload error:', error);
                    }
                })()
            );
        });

        await Promise.all(imagePromises);

        return attractionId;
    } catch (error) {
        console.error('[createAttractionComplete] Error:', error);
        throw error;
    }
}
