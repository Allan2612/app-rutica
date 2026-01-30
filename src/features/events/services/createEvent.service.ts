import { supabase } from '@/lib/supabase/client';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { findOrCreateLocationHierarchy, validateLocationData, type LocationHierarchy } from '@/services/locations.service';

const BUCKET_NAME = 'events-images';

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export interface CreateEventData {
    name: string;
    description?: string;
    categoryIds: string[];
    startDate: Date;
    endDate: Date;

    // Pricing
    isFree: boolean;
    price?: number;
    currency?: string;
    capacity?: number;

    // Location (V3: usa jerarquía de nombres para crear/buscar distrito)
    country: string;      // Nombre del país
    province: string;     // Nombre de la provincia
    canton: string;       // Nombre del cantón
    district: string;     // Nombre del distrito
    address?: string;
    latitude: number;
    longitude: number;

    // Contact
    phone?: string;
    email?: string;
    website?: string;
    ticketUrl?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;

    // Images
    coverUri?: string | null;
    galleryUris: string[]; // Hasta 3
}

async function uploadImage(
    imageUri: string,
    eventId: string,
    fileName: string
): Promise<string> {
    try {
        let uploadData: Blob | ArrayBuffer;
        let fileExt = 'jpg'; // Default

        if (Platform.OS === 'web' || imageUri.startsWith('blob:')) {
            const response = await fetch(imageUri);
            uploadData = await response.blob();
            // Obtener extensión del tipo MIME del blob
            const mimeType = (uploadData as Blob).type;
            if (mimeType === 'image/png') fileExt = 'png';
            else if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') fileExt = 'jpg';
            else if (mimeType === 'image/webp') fileExt = 'webp';
        } else {
            // Para mobile, intentar obtener extensión del URI
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

        // Generar nombre único y simple (eventId/tipo-timestamp-random.ext)
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const baseFileName = fileName.split('.')[0]; // Usa 'cover' o 'gallery-0' como prefijo
        const filePath = `${eventId}/${baseFileName}-${timestamp}-${random}.${fileExt}`;

        const contentType = fileExt === 'png' ? 'image/png' : fileExt === 'webp' ? 'image/webp' : 'image/jpeg';

        const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, uploadData, {
            contentType,
            upsert: false,
        });

        if (error) throw error;
        return filePath;
    } catch (error) {
        throw error;
    }
}

/**
 * Crea un nuevo evento con toda su información
 */
export async function createEventComplete(
    userId: string,
    data: CreateEventData
): Promise<string> {
    try {
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

        // 3. Crear ubicación con las coordenadas
        const { data: location, error: locationError } = await (supabase as any)
            .from('locations')
            .insert({
                id_loc: generateUUID(),
                district_id_loc: districtId,
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

        // 3. Crear evento
        const eventId = generateUUID();
        const { error: eventError } = await (supabase as any)
            .from('events')
            .insert({
                id_evt: eventId,
                created_by_evt: userId,
                name_evt: data.name,
                description_evt: data.description ?? null,
                location_id_evt: location.id_loc,
                start_at_evt: data.startDate.toISOString(),
                end_at_evt: data.endDate.toISOString(),
                is_free_evt: data.isFree,
                price_evt: data.isFree ? null : (data.price ?? null),
                currency_evt: data.isFree ? null : (data.currency ?? 'CRC'),
                capacity_evt: data.capacity ?? null,
                contact_phone_evt: data.phone ?? null,
                contact_email_evt: data.email ?? null,
                website_evt: data.website ?? null,
                ticket_url_evt: data.ticketUrl ?? null,
                social_links_evt: Object.keys(socialLinks).length > 0 ? socialLinks : null,
                moderation_status_evt: 'pending',
                is_active_evt: true,
            });

        if (eventError) throw eventError;

        // 4. Asociar categorías
        if (data.categoryIds.length > 0) {
            const categoryMaps = data.categoryIds.map((catId) => ({
                event_id_ecm: eventId,
                category_id_ecm: catId,
            }));

            const { error: categoryError } = await (supabase as any)
                .from('event_category_map')
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
                        const filePath = await uploadImage(data.coverUri!, eventId, 'cover.jpg');
                        const { error: insertError } = await (supabase as any).from('event_images').insert({
                            id_eim: generateUUID(),
                            event_id_eim: eventId,
                            path_eim: filePath,
                            sort_order_eim: 0,
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
                        const filePath = await uploadImage(uri, eventId, `gallery-${index}.jpg`);
                        const { error: insertError } = await (supabase as any).from('event_images').insert({
                            id_eim: generateUUID(),
                            event_id_eim: eventId,
                            path_eim: filePath,
                            sort_order_eim: index + 1,
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

        return eventId;
    } catch (error) {
        throw error;
    }
}
