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

export interface BusinessDetailForEdit {
    id: string;
    name: string;
    description: string | null;
    categoryIds: string[];
    country: string | null;
    province: string | null;
    canton: string | null;
    district: string | null;
    address: string | null;
    latitude: number;
    longitude: number;
    phone: string | null;
    email: string | null;
    website: string | null;
    facebook: string | null;
    instagram: string | null;
    tiktok: string | null;
    logoUrl: string | null;
    coverUrl: string | null;
    galleryUrls: string[];
}

export interface UpdateBusinessData {
    name: string;
    description: string | null;
    categoryIds: string[];
    country: string | null;
    province: string | null;
    canton: string | null;
    district: string | null;
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
 * Obtiene un negocio por ID para edición (específico para updateBusiness)
 */
export async function getBusinessForEdit(
    businessId: string,
    userId: string
): Promise<BusinessDetailForEdit> {
    const { data: businessData, error: businessError } = await supabase
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
    if (businessData.owner_id_bus !== userId) {
        throw new Error('No tienes permiso para editar este negocio');
    }

    let locationData = null;
    if (businessData.location_id_bus) {
        const { data: loc } = await supabase
            .from('locations')
            .select('*')
            .eq('id_loc', businessData.location_id_bus)
            .single();
        locationData = loc;
    }

    const { data: images } = await supabase
        .from('business_images')
        .select('*')
        .eq('business_id_bim', businessId)
        .order('sort_order_bim', { ascending: true });

    const { data: categoryMaps } = await supabase
        .from('business_category_map')
        .select('category_id_bcm')
        .eq('business_id_bcm', businessId);

    const logoImage = images?.find((img) => img.image_type_bim === 'logo');
    const coverImage = images?.find((img) => img.image_type_bim === 'cover');
    const galleryImages = images?.filter((img) => img.image_type_bim === 'gallery') || [];

    const logoUrl =
        logoImage?.bucket_bim && logoImage?.path_bim
            ? getImageUrl(logoImage.bucket_bim, logoImage.path_bim)
            : null;

    const coverUrl =
        coverImage?.bucket_bim && coverImage?.path_bim
            ? getImageUrl(coverImage.bucket_bim, coverImage.path_bim)
            : null;

    const galleryUrls = galleryImages.map((img) => getImageUrl(img.bucket_bim, img.path_bim));

    const categoryIds = (categoryMaps ?? [])
        .map((bcm: any) => bcm.category_id_bcm)
        .filter((id: string) => !!id);

    const socialLinks = businessData.social_links_bus || {};

    return {
        id: businessData.id_bus,
        name: businessData.name_bus,
        description: businessData.description_bus,
        categoryIds,
        country: locationData?.country_loc ?? 'Costa Rica',
        province: locationData?.province_loc ?? null,
        canton: locationData?.canton_loc ?? null,
        district: locationData?.district_loc ?? null,
        address: locationData?.address_loc ?? null,
        latitude: locationData?.latitude_loc ?? 0,
        longitude: locationData?.longitude_loc ?? 0,
        phone: businessData.contact_phone_bus,
        email: businessData.contact_email_bus,
        website: businessData.website_bus,
        facebook: socialLinks.facebook ?? null,
        instagram: socialLinks.instagram ?? null,
        tiktok: socialLinks.tiktok ?? null,
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
    const { data: business } = await supabase
        .from('businesses')
        .select('owner_id_bus, location_id_bus')
        .eq('id_bus', businessId)
        .single();

    if (!business || business.owner_id_bus !== userId) {
        throw new Error('No tienes permiso para editar este negocio');
    }

    // Actualizar ubicación
    if (business.location_id_bus) {
        await supabase
            .from('locations')
            .update({
                country_loc: data.country ?? 'Costa Rica',
                province_loc: data.province ?? null,
                canton_loc: data.canton ?? null,
                district_loc: data.district ?? null,
                address_loc: data.address ?? null,
                latitude_loc: data.latitude,
                longitude_loc: data.longitude,
            })
            .eq('id_loc', business.location_id_bus);
    }

    // Preparar social links
    const socialLinks: Record<string, string> = {};
    if (data.facebook) socialLinks.facebook = data.facebook;
    if (data.instagram) socialLinks.instagram = data.instagram;
    if (data.tiktok) socialLinks.tiktok = data.tiktok;

    // Actualizar datos del negocio
    const { error: businessError } = await supabase
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

    // Actualizar categorías
    await supabase.from('business_category_map').delete().eq('business_id_bcm', businessId);

    if (data.categoryIds.length > 0) {
        const categoryMaps = data.categoryIds.map((catId) => ({
            business_id_bcm: businessId,
            category_id_bcm: catId,
        }));
        await supabase.from('business_category_map').insert(categoryMaps);
    }

    // Manejar imágenes
    await handleImageUpdates(businessId, data);
}

/**
 * Maneja la actualización de imágenes (logo, cover, gallery)
 */
async function handleImageUpdates(businessId: string, data: UpdateBusinessData): Promise<void> {
    // Obtener imágenes actuales
    const { data: currentImages } = await supabase
        .from('business_images')
        .select('*')
        .eq('business_id_bim', businessId);

    // === MANEJO DE LOGO ===
    const currentLogo = currentImages?.find((img) => img.image_type_bim === 'logo');
    
    if (data.logoUri === null) {
        // Usuario eliminó el logo explícitamente
        if (currentLogo) {
            // Eliminar del bucket
            await supabase.storage.from('business-images').remove([currentLogo.path_bim]);
            // Eliminar registro de BD
            await supabase.from('business_images').delete().eq('id_bim', currentLogo.id_bim);
        }
    } else if (data.logoUri && isNewImage(data.logoUri)) {
        // Usuario seleccionó un logo nuevo para reemplazar
        if (currentLogo) {
            // Eliminar la imagen vieja del bucket
            await supabase.storage.from('business-images').remove([currentLogo.path_bim]);
            // Eliminar registro viejo
            await supabase.from('business_images').delete().eq('id_bim', currentLogo.id_bim);
        }
        // Subir la nueva imagen
        await uploadImage(data.logoUri, businessId, 'logo', 0);
    }

    // === MANEJO DE COVER ===
    const currentCover = currentImages?.find((img) => img.image_type_bim === 'cover');
    
    if (data.coverUri === null) {
        // Usuario eliminó el cover explícitamente
        if (currentCover) {
            // Eliminar del bucket
            await supabase.storage.from('business-images').remove([currentCover.path_bim]);
            // Eliminar registro de BD
            await supabase.from('business_images').delete().eq('id_bim', currentCover.id_bim);
        }
    } else if (data.coverUri && isNewImage(data.coverUri)) {
        // Usuario seleccionó una imagen nueva para reemplazar
        if (currentCover) {
            // Eliminar la imagen vieja del bucket
            await supabase.storage.from('business-images').remove([currentCover.path_bim]);
            // Eliminar registro viejo
            await supabase.from('business_images').delete().eq('id_bim', currentCover.id_bim);
        }
        // Subir la nueva imagen
        await uploadImage(data.coverUri, businessId, 'cover', 1);
    }

    // === MANEJO DE GALERÍA ===
    if (data.galleryUris !== undefined) {
        const currentGallery = currentImages?.filter((img) => img.image_type_bim === 'gallery') || [];
        
        // Separar las imágenes existentes (URLs de supabase) de las nuevas
        const existingGalleryUrls = data.galleryUris.filter(uri => !isNewImage(uri));
        const newGalleryUris = data.galleryUris.filter(uri => isNewImage(uri));

        // Encontrar imágenes que se eliminaron (estaban antes pero ya no están en el array)
        const imagesToDelete = currentGallery.filter(currentImg => {
            const currentUrl = getImageUrl('business-images', currentImg.path_bim);
            return !existingGalleryUrls.includes(currentUrl);
        });

        // Eliminar del bucket y BD las imágenes que ya no están
        if (imagesToDelete.length > 0) {
            const pathsToDelete = imagesToDelete.map(img => img.path_bim);
            await supabase.storage.from('business-images').remove(pathsToDelete);
            
            const idsToDelete = imagesToDelete.map(img => img.id_bim);
            await supabase.from('business_images').delete().in('id_bim', idsToDelete);
        }

        // Subir solo las imágenes nuevas
        // El sort_order empieza en 2 (después de logo=0 y cover=1) + índice
        const startIndex = existingGalleryUrls.length;
        for (let i = 0; i < newGalleryUris.length; i++) {
            await uploadImage(newGalleryUris[i], businessId, 'gallery', 2 + startIndex + i);
        }
    }
}

async function uploadImage(
    uri: string,
    businessId: string,
    type: 'logo' | 'cover' | 'gallery',
    sortOrder: number
): Promise<void> {
    let fileExt = 'jpg'; // Default
    let arrayBuffer: ArrayBuffer;

    if (Platform.OS === 'web' || uri.startsWith('blob:')) {
        const response = await fetch(uri);
        const blob = await response.blob();
        // Obtener extensión del tipo MIME del blob
        const mimeType = blob.type;
        if (mimeType === 'image/png') fileExt = 'png';
        else if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') fileExt = 'jpg';
        else if (mimeType === 'image/webp') fileExt = 'webp';
        arrayBuffer = await blob.arrayBuffer();
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
        arrayBuffer = byteArray.buffer;
    }

    // Generar nombre único y simple
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileName = `${type}-${timestamp}-${random}.${fileExt}`;
    const filePath = `${businessId}/${fileName}`;

    const contentType = fileExt === 'png' ? 'image/png' : fileExt === 'webp' ? 'image/webp' : 'image/jpeg';

    const { error: uploadError } = await supabase.storage
        .from('business-images')
        .upload(filePath, arrayBuffer, {
            contentType,
            upsert: false,
        });

    if (uploadError) throw uploadError;

    const { error: insertError } = await supabase.from('business_images').insert({
        id_bim: generateUUID(),
        business_id_bim: businessId,
        image_type_bim: type,
        bucket_bim: 'business-images',
        path_bim: filePath,
        sort_order_bim: sortOrder,
    });

    if (insertError) {
        throw insertError;
    }
}
