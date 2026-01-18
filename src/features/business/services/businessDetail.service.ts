import { supabase } from '@/lib/supabase/client';

export interface BusinessDetailData {
    id: string;
    name: string;
    description: string | null;
    categoryNames: string[];
    categoryIds: string[];
    locationLabel: string | null;
    fullAddress: string | null;
    coverImageUrl: string | null;
    logoUrl: string | null;
    galleryImages: string[];
    socialLinks: {
        facebook?: string;
        instagram?: string;
        tiktok?: string;
    };
    contactPhone: string | null;
    contactEmail: string | null;
    website: string | null;
    rating: number;
    reviewCount: number;
    isApproved: boolean;
}

export async function getBusinessDetail(businessId: string): Promise<BusinessDetailData | null> {
    const { data, error } = await supabase
        .from('businesses')
        .select(`
      id_bus,
      name_bus,
      description_bus,
      moderation_status_bus,
      social_links_bus,
      contact_phone_bus,
      contact_email_bus,
      website_bus,
      avg_rating_bus,
      reviews_count_bus,
      business_category_map (
        categories (
          id_cat,
          name_cat
        )
      ),
      locations (
        canton_loc,
        district_loc,
        province_loc,
        address_loc
      ),
      business_images (
        image_type_bim,
        bucket_bim,
        path_bim,
        sort_order_bim
      )
    `)
        .eq('id_bus', businessId)
        .single();

    if (error) {
        return null;
    }

    if (!data) return null;

    // Procesar imágenes
    const images = (data.business_images ?? []).sort(
        (a: any, b: any) => (a?.sort_order_bim ?? 0) - (b?.sort_order_bim ?? 0)
    );

    const logoImage = images.find((img: any) => img.image_type_bim === 'logo');
    const coverImage = images.find((img: any) => img.image_type_bim === 'cover');
    const galleryImagesData = images.filter((img: any) => img.image_type_bim === 'gallery');

    const getImageUrl = (bucket: string, path: string) => {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
        return urlData.publicUrl;
    };

    const logoUrl = logoImage?.bucket_bim && logoImage?.path_bim
        ? getImageUrl(logoImage.bucket_bim, logoImage.path_bim)
        : null;

    const coverImageUrl = coverImage?.bucket_bim && coverImage?.path_bim
        ? getImageUrl(coverImage.bucket_bim, coverImage.path_bim)
        : null;

    const galleryImages = galleryImagesData
        .filter((img: any) => img.bucket_bim && img.path_bim)
        .map((img: any) => getImageUrl(img.bucket_bim, img.path_bim))
        .slice(0, 3); // Máximo 3 imágenes

    // Procesar categorías
    const categories = data.business_category_map?.map((bcm: any) => bcm.categories).filter(Boolean) ?? [];
    const categoryNames = categories.map((c: any) => c.name_cat);
    const categoryIds = categories.map((c: any) => c.id_cat);

    // Procesar ubicación
    const location = Array.isArray(data.locations) ? data.locations[0] : data.locations;
    const locationParts = [location?.canton_loc, location?.district_loc].filter(Boolean);
    const locationLabel = locationParts.length ? locationParts.join(', ') : null;

    // Procesar social links (viene como JSON)
    const socialLinks = data.social_links_bus ?? {};

    // Asegurar que el website tenga protocolo
    let website = data.website_bus;
    if (website && !website.startsWith('http://') && !website.startsWith('https://')) {
        website = `https://${website}`;
    }

    return {
        id: data.id_bus,
        name: data.name_bus,
        description: data.description_bus,
        categoryNames,
        categoryIds,
        locationLabel,
        fullAddress: location?.address_loc ?? null,
        coverImageUrl,
        logoUrl,
        galleryImages,
        socialLinks: {
            facebook: socialLinks.facebook,
            instagram: socialLinks.instagram,
            tiktok: socialLinks.tiktok,
        },
        contactPhone: data.contact_phone_bus,
        contactEmail: data.contact_email_bus,
        website: website,
        rating: data.avg_rating_bus ?? 0,
        reviewCount: data.reviews_count_bus ?? 0,
        isApproved: data.moderation_status_bus === 'approved',
    };
}
