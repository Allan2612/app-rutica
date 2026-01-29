import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import type {
    UserBusinessListItem,
    BusinessDetailForEdit,
} from '@/types/entities/business';
import { getImageUrl, generateUUID, isNewImage, uploadImage } from './userBusinesses.helpers';

const BUCKET_NAME = 'business-images';

export async function getUserBusinesses(userId: string): Promise<UserBusinessListItem[]> {
    const { data, error } = await (supabase as any)
        .from('businesses')
        .select(`
      id_bus,
      name_bus,
      description_bus,
      moderation_status_bus,
      is_active_bus,
      created_at_bus,
      locations!location_id_bus (
        districts!district_id_loc (
          name_dst,
          cantons!canton_id_dst (
            name_ctn,
            provinces!province_id_ctn (
              name_prv
            )
          )
        )
      ),
      business_images (
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

    return ((data as any) || []).map((item: any) => {
        const sortedImages = [...(item.business_images ?? [])].sort(
            (a: any, b: any) => (a?.sort_order_bim ?? 0) - (b?.sort_order_bim ?? 0)
        );

        // V3: sort_order=0 es logo, sort_order=1 es cover, >1 es gallery
        const logoImage = sortedImages.find((img: any) => img.sort_order_bim === 0);
        const coverImage = sortedImages.find((img: any) => img.sort_order_bim === 1);
        const galleryImage = sortedImages.find((img: any) => img.sort_order_bim > 1);

        const primaryImage = coverImage ?? galleryImage ?? logoImage ?? sortedImages[0];

        const imageUrl = primaryImage?.path_bim ? getImageUrl(primaryImage.path_bim) : null;
        const logoUrl = logoImage?.path_bim ? getImageUrl(logoImage.path_bim) : null;

        // V3: location con joins normalizados
        const location = Array.isArray(item.locations) ? item.locations[0] : item.locations;
        const district = location?.districts;
        const canton = district?.cantons;
        
        const locationParts = [canton?.name_ctn, district?.name_dst].filter(Boolean);

        const categoryNames = (item.business_category_map ?? [])
            .map((bcm: any) => bcm.categories?.name_cat)
            .filter((name: string | undefined): name is string => !!name);

        const categoryIds = (item.business_category_map ?? [])
            .map((bcm: any) => bcm.categories?.id_cat)
            .filter((id: string | undefined): id is string => !!id);

        return {
            id: item.id_bus,
            name: item.name_bus,
            description: item.description_bus,
            categoryNames,
            categoryIds,
            locationLabel: locationParts.length ? locationParts.join(', ') : null,
            imageUrl,
            logoUrl,
            coverUrl: null,
            avgRating: null,
            reviewsCount: null,
            moderationStatus: item.moderation_status_bus as 'pending' | 'approved' | 'rejected',
            isActive: item.is_active_bus,
            createdAt: item.created_at_bus,
        };
    });
}

export async function deleteUserBusiness(businessId: string, userId: string): Promise<void> {
    // 1. Verificar permisos
    const { data: business, error: businessError } = await (supabase as any)
        .from('businesses')
        .select('owner_id_bus, location_id_bus')
        .eq('id_bus', businessId)
        .single();

    if (businessError) throw businessError;
    if (!business || (business as any).owner_id_bus !== userId) {
        throw new Error('No tienes permiso para eliminar este negocio');
    }

    try {
        // 2. Obtener todas las imágenes antes de eliminar
        const { data: images, error: queryError } = await supabase
            .from('business_images')
            .select('path_bim')
            .eq('business_id_bim', businessId);

        if (queryError) {
        }

        // 3. Eliminar imágenes del bucket de Supabase
        if (images && images.length > 0) {
            const imagePaths = images.map((img: { path_bim: string }) => img.path_bim);
            
            // Intentar eliminar archivos individuales
            const { error: storageError } = await supabase.storage
                .from(BUCKET_NAME)
                .remove(imagePaths);

            if (storageError) {
            }

            // Intentar también listar y eliminar toda la carpeta del negocio (fallback)
            try {
                const { data: folderFiles } = await supabase.storage
                    .from(BUCKET_NAME)
                    .list(businessId, {
                        limit: 100,
                        sortBy: { column: 'name', order: 'asc' }
                    });

                if (folderFiles && folderFiles.length > 0) {
                    const folderPaths = folderFiles.map((file: any) => `${businessId}/${file.name}`);
                    await supabase.storage
                        .from(BUCKET_NAME)
                        .remove(folderPaths);
                }
            } catch (folderError) {
            }
        }

        // 4. Eliminar registros de business_images
        const { error: imagesError } = await supabase
            .from('business_images')
            .delete()
            .eq('business_id_bim', businessId);

        if (imagesError) {
        }

        // 5. Eliminar categorías asociadas
        const { error: categoriesError } = await supabase
            .from('business_category_map')
            .delete()
            .eq('business_id_bcm', businessId);

        if (categoriesError) {
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
        throw error;
    }
}

export async function getBusinessById(
    businessId: string,
    userId: string
): Promise<BusinessDetailForEdit> {
    const { data: businessData, error: businessError } = await (supabase as any)
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
    if ((businessData as any).owner_id_bus !== userId) {
        throw new Error('No tienes permiso para editar este negocio');
    }

    let locationData = null;
    if ((businessData as any).location_id_bus) {
        const { data: loc } = await supabase
            .from('locations')
            .select('district_id_loc, address_loc, latitude_loc, longitude_loc')
            .eq('id_loc', (businessData as any).location_id_bus)
            .single();
        locationData = loc;
    }

    const { data: images } = await supabase
        .from('business_images')
        .select('id_bim, path_bim, sort_order_bim')
        .eq('business_id_bim', businessId)
        .order('sort_order_bim', { ascending: true });

    const { data: categoryMaps } = await supabase
        .from('business_category_map')
        .select('category_id_bcm')
        .eq('business_id_bcm', businessId);

    const sortedImages = ((images as any) || []).sort(
        (a: any, b: any) => (a?.sort_order_bim ?? 0) - (b?.sort_order_bim ?? 0)
    );

    // V3: sort_order=0 es logo, sort_order=1 es cover, >1 es gallery
    const logoImage = sortedImages.find((img: any) => img.sort_order_bim === 0);
    const coverImage = sortedImages.find((img: any) => img.sort_order_bim === 1);
    const galleryImages = sortedImages.filter((img: any) => img.sort_order_bim > 1);

    const logoUrl = logoImage?.path_bim ? getImageUrl(logoImage.path_bim) : null;
    const coverUrl = coverImage?.path_bim ? getImageUrl(coverImage.path_bim) : null;
    const galleryUrls = galleryImages.map((img: any) => getImageUrl(img.path_bim));

    const categoryIds = (categoryMaps ?? [])
        .map((bcm: any) => bcm.category_id_bcm)
        .filter((id: string) => !!id);

    const socialLinks = (businessData as any).social_links_bus || {};

    return {
        id: (businessData as any).id_bus,
        name: (businessData as any).name_bus,
        description: (businessData as any).description_bus,
        categoryIds,
        districtId: (locationData as any)?.district_id_loc ?? null,
        address: (locationData as any)?.address_loc ?? null,
        latitude: (locationData as any)?.latitude_loc ?? 0,
        longitude: (locationData as any)?.longitude_loc ?? 0,
        phone: (businessData as any).contact_phone_bus,
        email: (businessData as any).contact_email_bus,
        website: (businessData as any).website_bus,
        socialLinks: {
            facebook: (socialLinks as any).facebook ?? null,
            instagram: (socialLinks as any).instagram ?? null,
            tiktok: (socialLinks as any).tiktok ?? null,
        },
        logoUrl,
        coverUrl,
        galleryUrls,
    } as BusinessDetailForEdit;
}
