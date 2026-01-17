import { supabase } from '@/lib/supabase/client';
import type {
    UserBusinessListItem,
    BusinessRecord,
    BusinessDetailForEdit,
    UpdateBusinessData,
} from '@/types/entities/business';
import { getImageUrl, generateUUID, isNewImage, uploadImage } from './userBusinesses.helpers';

export async function getUserBusinesses(userId: string): Promise<UserBusinessListItem[]> {
    const { data, error } = await supabase
        .from('businesses')
        .select(`
      id_bus,
      name_bus,
      description_bus,
      moderation_status_bus,
      is_active_bus,
      created_at_bus,
      locations (
        province_loc,
        canton_loc,
        district_loc
      ),
      business_images (
        image_type_bim,
        bucket_bim,
        path_bim,
        sort_order_bim
      ),
      business_category_map (
        categories (
          id_cat,
          name_cat
        )
      )
    `)
        .eq('owner_id_bus', userId)
        .order('created_at_bus', { ascending: false });

    if (error) throw error;

    return (data as unknown as BusinessRecord[] || []).map((item) => {
        const sortedImages = [...(item.business_images ?? [])].sort(
            (a, b) => (a?.sort_order_bim ?? 0) - (b?.sort_order_bim ?? 0)
        );

        const logoImage = sortedImages.find((img) => img.image_type_bim === 'logo');
        const coverImage = sortedImages.find((img) => img.image_type_bim === 'cover');
        const galleryImage = sortedImages.find((img) => img.image_type_bim === 'gallery');

        const primaryImage = coverImage ?? galleryImage ?? logoImage ?? sortedImages[0];

        const imageUrl =
            primaryImage?.bucket_bim && primaryImage?.path_bim
                ? getImageUrl(primaryImage.bucket_bim, primaryImage.path_bim)
                : null;

        const logoUrl =
            logoImage?.bucket_bim && logoImage?.path_bim
                ? getImageUrl(logoImage.bucket_bim, logoImage.path_bim)
                : null;

        const location = item.locations?.[0];
        const locationParts = [location?.canton_loc, location?.district_loc].filter(Boolean);

        const categoryNames = (item.business_category_map ?? [])
            .map((bcm) => bcm.categories?.name_cat)
            .filter((name): name is string => !!name);

        const categoryIds = (item.business_category_map ?? [])
            .map((bcm) => bcm.categories?.id_cat)
            .filter((id): id is string => !!id);

        return {
            id: item.id_bus,
            name: item.name_bus,
            description: item.description_bus,
            categoryNames,
            categoryIds,
            locationLabel: locationParts.length ? locationParts.join(', ') : null,
            imageUrl,
            logoUrl,
            moderationStatus: item.moderation_status_bus as 'pending' | 'approved' | 'rejected',
            isActive: item.is_active_bus,
            createdAt: item.created_at_bus,
        };
    });
}

export async function deleteUserBusiness(businessId: string, userId: string): Promise<void> {
    // 1. Verificar permisos
    const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('owner_id_bus, location_id_bus')
        .eq('id_bus', businessId)
        .single();

    if (businessError) throw businessError;
    if (!business || business.owner_id_bus !== userId) {
        throw new Error('No tienes permiso para eliminar este negocio');
    }

    try {
        // 2. Obtener todas las imágenes antes de eliminar
        const { data: images, error: queryError } = await supabase
            .from('business_images')
            .select('bucket_bim, path_bim')
            .eq('business_id_bim', businessId);

        if (queryError) {
            console.error('Error querying business images:', queryError);
        }

        // 3. Eliminar imágenes del bucket de Supabase
        if (images && images.length > 0) {
            const imagePaths = images.map((img: { bucket_bim: string; path_bim: string }) => img.path_bim);
            
            // Intentar eliminar archivos individuales
            const { error: storageError } = await supabase.storage
                .from('business-images')
                .remove(imagePaths);

            if (storageError) {
                console.error('Error deleting images from storage:', storageError);
                console.error('Attempted to delete paths:', imagePaths);
            }

            // Intentar también listar y eliminar toda la carpeta del negocio (fallback)
            try {
                const { data: folderFiles } = await supabase.storage
                    .from('business-images')
                    .list(businessId, {
                        limit: 100,
                        sortBy: { column: 'name', order: 'asc' }
                    });

                if (folderFiles && folderFiles.length > 0) {
                    const folderPaths = folderFiles.map(file => `${businessId}/${file.name}`);
                    await supabase.storage
                        .from('business-images')
                        .remove(folderPaths);
                }
            } catch (folderError) {
                console.error('Error cleaning up business folder:', folderError);
            }
        }

        // 4. Eliminar registros de business_images
        const { error: imagesError } = await supabase
            .from('business_images')
            .delete()
            .eq('business_id_bim', businessId);

        if (imagesError) {
            console.error('Error deleting business_images records:', imagesError);
        }

        // 5. Eliminar categorías asociadas
        const { error: categoriesError } = await supabase
            .from('business_category_map')
            .delete()
            .eq('business_id_bcm', businessId);

        if (categoriesError) {
            console.error('Error deleting business_category_map records:', categoriesError);
        }

        // 6. Eliminar el negocio
        const { error: deleteError } = await supabase
            .from('businesses')
            .delete()
            .eq('id_bus', businessId);

        if (deleteError) throw deleteError;

        // 7. Eliminar la ubicación si existe (solo si no está siendo usada por otros negocios)
        if (business.location_id_bus) {
            const { data: otherBusinesses } = await supabase
                .from('businesses')
                .select('id_bus')
                .eq('location_id_bus', business.location_id_bus)
                .limit(1);

            // Si no hay otros negocios usando esta ubicación, eliminarla
            if (!otherBusinesses || otherBusinesses.length === 0) {
                await supabase
                    .from('locations')
                    .delete()
                    .eq('id_loc', business.location_id_bus);
            }
        }
    } catch (error) {
        console.error('Error in deleteUserBusiness:', error);
        throw error;
    }
}

export async function getBusinessById(
    businessId: string,
    userId: string
): Promise<BusinessDetailForEdit> {
    const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select(`
      id_bus,
      name_bus,
      description_bus,
      contact_phone_bus,
      contact_email_bus,
      website_bus,
      social_links_bus,
      owner_id_bus,
      location_id_bus
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

    const sortedImages = (images || []).sort(
        (a, b) => (a?.sort_order_bim ?? 0) - (b?.sort_order_bim ?? 0)
    );

    const logoImage = sortedImages.find((img) => img.image_type_bim === 'logo');
    const coverImage = sortedImages.find((img) => img.image_type_bim === 'cover');
    const galleryImages = sortedImages.filter((img) => img.image_type_bim === 'gallery');

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
