import { supabase } from '@/lib/supabase/client';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { canUserEdit } from '@/utils/permissionHelpers';
import { syncResourceUsage } from '@/services/subscriptionQuota.service';

// ============================================
// Constants
// ============================================

const BUCKET_NAME = 'events-images';

// ============================================
// Helpers
// ============================================

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// ============================================
// Types
// ============================================

export interface EventDetailForEdit {
    id: string;
    name: string;
    description: string | null;
    categoryIds: string[];
    // Location hierarchy (V3)
    districtId: string | null;
    province: string | null;
    canton: string | null;
    district: string | null;
    address: string | null;
    latitude: number;
    longitude: number;
    // Dates
    startDate: Date;
    endDate: Date;
    // Pricing
    isFree: boolean;
    price: number | null;
    currency: string | null;
    capacity: number | null;
    // Contact
    phone: string | null;
    email: string | null;
    website: string | null;
    ticketUrl: string | null;
    // Social
    facebook: string | null;
    instagram: string | null;
    tiktok: string | null;
    // Images
    coverUrl: string | null;
    galleryUrls: string[];
}

export interface UpdateEventData {
    name: string;
    description: string | null;
    categoryIds: string[];
    districtId: string;
    address: string | null;
    latitude: number;
    longitude: number;
    startDate: Date;
    endDate: Date;
    isFree: boolean;
    price: number | null;
    currency: string | null;
    capacity: number | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    ticketUrl: string | null;
    facebook: string | null;
    instagram: string | null;
    tiktok: string | null;
    coverImage?: string | null;
    galleryImages?: string[];
}

function getImageUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
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
 * Obtiene un evento por ID para edición
 */
export async function getEventById(
    eventId: string,
    userId: string
): Promise<EventDetailForEdit> {
    // 1. Obtener datos del evento
    const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select(`
            id_evt,
            name_evt,
            description_evt,
            created_by_evt,
            location_id_evt,
            start_at_evt,
            end_at_evt,
            is_free_evt,
            price_evt,
            currency_evt,
            capacity_evt,
            contact_phone_evt,
            contact_email_evt,
            website_evt,
            ticket_url_evt,
            social_links_evt
        `)
        .eq('id_evt', eventId)
        .single();

    if (eventError) throw eventError;
    if (!eventData) throw new Error('No se encontró el evento');

    // Verificar permisos: debe ser el creador O admin
    const hasPermission = await canUserEdit(userId, (eventData as any).created_by_evt);
    if (!hasPermission) {
        throw new Error('No tienes permiso para editar este evento');
    }

    // 2. Obtener ubicación con jerarquía completa (V3)
    let locationData: any = null;
    let districtData: any = null;
    let cantonData: any = null;
    let provinceData: any = null;

    if ((eventData as any).location_id_evt) {
        const { data: loc } = await supabase
            .from('locations')
            .select(`
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
            `)
            .eq('id_loc', (eventData as any).location_id_evt)
            .single();

        locationData = loc;
        districtData = (loc as any)?.districts;
        cantonData = districtData?.cantons;
        provinceData = cantonData?.provinces;
    }

    // 3. Obtener imágenes
    const { data: images } = await supabase
        .from('event_images')
        .select('id_eim, path_eim, sort_order_eim')
        .eq('event_id_eim', eventId)
        .order('sort_order_eim', { ascending: true });

    // 4. Obtener categorías
    const { data: categoryMaps } = await supabase
        .from('event_category_map')
        .select('category_id_ecm')
        .eq('event_id_ecm', eventId);

    const sortedImages = ((images as any) || []).sort(
        (a: any, b: any) => (a?.sort_order_eim ?? 0) - (b?.sort_order_eim ?? 0)
    );

    // sort_order_eim: 0 = cover, 1-3 = gallery
    const coverImage = sortedImages.find((img: any) => img.sort_order_eim === 0);
    const galleryImages = sortedImages.filter((img: any) => img.sort_order_eim > 0);

    const coverUrl =
        coverImage?.path_eim
            ? getImageUrl(BUCKET_NAME, coverImage.path_eim)
            : null;

    const galleryUrls = galleryImages.map((img: any) => getImageUrl(BUCKET_NAME, img.path_eim));

    const categoryIds = (categoryMaps ?? [])
        .map((ecm: any) => ecm.category_id_ecm)
        .filter((id: string) => !!id);

    const socialLinks = (eventData as any).social_links_evt || {};

    return {
        id: (eventData as any).id_evt,
        name: (eventData as any).name_evt,
        description: (eventData as any).description_evt,
        categoryIds,
        // Location hierarchy (V3)
        districtId: locationData?.district_id_loc ?? null,
        province: provinceData?.name_prv ?? null,
        canton: cantonData?.name_ctn ?? null,
        district: districtData?.name_dst ?? null,
        address: locationData?.address_loc ?? null,
        latitude: locationData?.latitude_loc ?? 0,
        longitude: locationData?.longitude_loc ?? 0,
        // Dates
        startDate: new Date((eventData as any).start_at_evt),
        endDate: new Date((eventData as any).end_at_evt),
        // Pricing
        isFree: (eventData as any).is_free_evt,
        price: (eventData as any).price_evt,
        currency: (eventData as any).currency_evt,
        capacity: (eventData as any).capacity_evt,
        // Contact
        phone: (eventData as any).contact_phone_evt,
        email: (eventData as any).contact_email_evt,
        website: (eventData as any).website_evt,
        ticketUrl: (eventData as any).ticket_url_evt,
        // Social
        facebook: socialLinks.facebook ?? null,
        instagram: socialLinks.instagram ?? null,
        tiktok: (socialLinks as any).tiktok ?? null,
        coverUrl,
        galleryUrls,
    };
}

/**
 * Actualiza un evento existente
 */
export async function updateEventComplete(
    eventId: string,
    userId: string,
    data: UpdateEventData
): Promise<void> {
    const { data: event } = await (supabase as any)
        .from('events')
        .select('created_by_evt, location_id_evt')
        .eq('id_evt', eventId)
        .single();

    if (!event) {
        throw new Error('No se encontró el evento');
    }

    // Verificar permisos: debe ser el creador O admin
    const hasPermission = await canUserEdit(userId, event.created_by_evt);
    if (!hasPermission) {
        throw new Error('No tienes permiso para editar este evento');
    }

    // 1. Actualizar ubicación (V3: solo district_id, address y coordenadas)
    if (event.location_id_evt) {
        await (supabase as any)
            .from('locations')
            .update({
                district_id_loc: data.districtId,
                address_loc: data.address ?? null,
                latitude_loc: data.latitude,
                longitude_loc: data.longitude,
            })
            .eq('id_loc', event.location_id_evt);
    }

    // 2. Actualizar social links
    const socialLinks: Record<string, string> = {};
    if (data.facebook) socialLinks.facebook = data.facebook;
    if (data.instagram) socialLinks.instagram = data.instagram;
    if (data.tiktok) socialLinks.tiktok = data.tiktok;

    // 3. Actualizar evento
    await (supabase as any)
        .from('events')
        .update({
            name_evt: data.name,
            description_evt: data.description ?? null,
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
        })
        .eq('id_evt', eventId);

    // 4. Actualizar categorías
    await supabase
        .from('event_category_map')
        .delete()
        .eq('event_id_ecm', eventId);

    if (data.categoryIds.length > 0) {
        const categoryMaps = data.categoryIds.map((categoryId: string) => ({
            event_id_ecm: eventId,
            category_id_ecm: categoryId,
        }));

        await (supabase as any).from('event_category_map').insert(categoryMaps);
    }

    // 5. Manejar imágenes si se proporcionan
    if (data.coverImage !== undefined || data.galleryImages !== undefined) {
        await handleImageUpdates(eventId, data);
    }

    // 6. Sincronizar uso de recursos para la galería
    await syncResourceUsage(userId, 'photo_event', eventId, 'event');
}

async function handleImageUpdates(eventId: string, data: UpdateEventData): Promise<void> {
    // Obtener imágenes actuales
    const { data: currentImages } = await supabase
        .from('event_images')
        .select('id_eim, path_eim, sort_order_eim')
        .eq('event_id_eim', eventId);

    // === MANEJO DE COVER (sort_order_eim = 0) ===
    const currentCover = (currentImages as any)?.find((img: any) => img.sort_order_eim === 0);

    if (data.coverImage === null) {
        // Usuario eliminó el cover explícitamente
        if (currentCover) {
            // Eliminar del bucket
            await supabase.storage.from(BUCKET_NAME).remove([currentCover.path_eim]);
            // Eliminar registro de BD
            await supabase.from('event_images').delete().eq('id_eim', currentCover.id_eim);
        }
    } else if (data.coverImage && isNewImage(data.coverImage)) {
        // Usuario seleccionó una imagen nueva para reemplazar
        if (currentCover) {
            // Eliminar la imagen vieja del bucket
            await supabase.storage.from(BUCKET_NAME).remove([currentCover.path_eim]);
            // Eliminar registro viejo
            await supabase.from('event_images').delete().eq('id_eim', currentCover.id_eim);
        }
        // Subir la nueva imagen
        await uploadImage(data.coverImage, eventId, 'cover', 0);
    }
    // Si data.coverImage es una URL de supabase, no hacemos nada (la dejamos intacta)

    // === MANEJO DE GALERÍA (sort_order_eim > 0) ===
    if (data.galleryImages !== undefined) {
        const currentGallery = (currentImages as any)?.filter((img: any) => img.sort_order_eim > 0) || [];

        // Separar las imágenes existentes (URLs de supabase) de las nuevas
        const existingGalleryUrls = data.galleryImages.filter(uri => !isNewImage(uri));
        const newGalleryUris = data.galleryImages.filter(uri => isNewImage(uri));

        // Encontrar imágenes que se eliminaron (estaban antes pero ya no están en el array)
        const imagesToDelete = currentGallery.filter((currentImg: any) => {
            const currentUrl = getImageUrl(BUCKET_NAME, currentImg.path_eim);
            return !existingGalleryUrls.includes(currentUrl);
        });

        // Eliminar del bucket y BD las imágenes que ya no están
        if (imagesToDelete.length > 0) {
            const pathsToDelete = imagesToDelete.map((img: any) => img.path_eim);
            await supabase.storage.from(BUCKET_NAME).remove(pathsToDelete);

            const idsToDelete = imagesToDelete.map((img: any) => img.id_eim);
            await supabase.from('event_images').delete().in('id_eim', idsToDelete);
        }

        // Subir solo las imágenes nuevas
        // El sort_order empieza después de las existentes
        const startIndex = existingGalleryUrls.length;
        for (let i = 0; i < newGalleryUris.length; i++) {
            await uploadImage(newGalleryUris[i], eventId, 'gallery', startIndex + i + 1);
        }
    }
}

async function uploadImage(
    uri: string,
    eventId: string,
    type: 'cover' | 'gallery',
    sortOrder: number
): Promise<void> {
    let uploadData: Blob | ArrayBuffer;
    let fileExt = 'jpg'; // Default

    if (Platform.OS === 'web' || uri.startsWith('blob:')) {
        const response = await fetch(uri);
        uploadData = await response.blob();
        // Obtener extensión del tipo MIME del blob
        const mimeType = (uploadData as Blob).type;
        if (mimeType === 'image/png') fileExt = 'png';
        else if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') fileExt = 'jpg';
        else if (mimeType === 'image/webp') fileExt = 'webp';
    } else {
        // Para mobile, intentar obtener extensión del URI
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

    // Generar nombre único y simple
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileName = `${type}-${timestamp}-${random}.${fileExt}`;
    const filePath = `${eventId}/${fileName}`;

    const contentType = fileExt === 'png' ? 'image/png' : fileExt === 'webp' ? 'image/webp' : 'image/jpeg';

    const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, uploadData, {
            contentType,
            upsert: false,
        });

    if (uploadError) throw uploadError;

    const { error: insertError } = await (supabase as any).from('event_images').insert({
        id_eim: generateUUID(),
        event_id_eim: eventId,
        path_eim: filePath,
        sort_order_eim: sortOrder,
    });

    if (insertError) {
        throw insertError;
    }
}
