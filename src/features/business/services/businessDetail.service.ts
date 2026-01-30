import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

const BUCKET_NAME = 'business-images';

export interface BusinessDetailData {
    id: string;
    ownerId: string;
    name: string;
    description: string | null;
    categoryNames: string[];
    categoryIds: string[];
    locationLabel: string | null;
    fullAddress: string | null;
    latitude: number | null;
    longitude: number | null;
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
    const { data, error } = await (supabase as any)
        .from('businesses')
        .select(`
      id_bus,
      owner_id_bus,
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
      locations!location_id_bus (
        address_loc,
        latitude_loc,
        longitude_loc,
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
      )
    `)
        .eq('id_bus', businessId)
        .single();

    if (error) {
        return null;
    }

    if (!data) return null;

    // Helper para extraer tipo de imagen del path
    const getImageType = (path: string): 'logo' | 'cover' | 'gallery' | null => {
        if (path.includes('logo-')) return 'logo';
        if (path.includes('cover-')) return 'cover';
        if (path.includes('gallery-')) return 'gallery';
        // sort_order: 0=logo, >0=gallery por defecto
        return null;
    };

    // Procesar imágenes
    const images = ((data as any).business_images ?? []).sort(
        (a: any, b: any) => (a?.sort_order_bim ?? 0) - (b?.sort_order_bim ?? 0)
    );

    // V3: sort_order=0 es logo, >0 es gallery
    const logoImage = images.find((img: any) => img.sort_order_bim === 0 || getImageType(img.path_bim) === 'logo');
    const coverImage = images.find((img: any) => getImageType(img.path_bim) === 'cover');
    const galleryImagesData = images.filter((img: any) =>
        img.sort_order_bim > 0 && getImageType(img.path_bim) !== 'cover'
    );

    const getImageUrl = (path: string) => {
        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
        return urlData.publicUrl;
    };

    const logoUrl = logoImage?.path_bim
        ? getImageUrl(logoImage.path_bim)
        : null;

    const coverImageUrl = coverImage?.path_bim
        ? getImageUrl(coverImage.path_bim)
        : null;

    const galleryImages = galleryImagesData
        .filter((img: any) => img.path_bim)
        .map((img: any) => getImageUrl(img.path_bim))
        .slice(0, 3); // Máximo 3 imágenes

    // Procesar categorías
    const categories = (data as any).business_category_map?.map((bcm: any) => bcm.categories).filter(Boolean) ?? [];
    const categoryNames = categories.map((c: any) => c.name_cat);
    const categoryIds = categories.map((c: any) => c.id_cat);

    // Procesar ubicación V3
    const location = Array.isArray((data as any).locations) ? (data as any).locations[0] : (data as any).locations;
    const district = location?.districts;
    const canton = district?.cantons;
    const province = canton?.provinces;
    const country = province?.countries;

    const locationParts = [country?.name_cnt, province?.name_prv, canton?.name_ctn, district?.name_dst].filter(Boolean);
    const locationLabel = locationParts.length ? locationParts.join(', ') : null;

    // Procesar social links (viene como JSON)
    const socialLinks = (data as any).social_links_bus ?? {};

    // Asegurar que el website tenga protocolo
    let website = (data as any).website_bus;
    if (website && !website.startsWith('http://') && !website.startsWith('https://')) {
        website = `https://${website}`;
    }

    return {
        id: (data as any).id_bus,
        ownerId: (data as any).owner_id_bus,
        name: (data as any).name_bus,
        description: (data as any).description_bus,
        categoryNames,
        categoryIds,
        locationLabel,
        fullAddress: location?.address_loc ?? null,
        latitude: location?.latitude_loc ?? null,
        longitude: location?.longitude_loc ?? null,
        coverImageUrl,
        logoUrl,
        galleryImages,
        socialLinks: {
            facebook: socialLinks.facebook,
            instagram: socialLinks.instagram,
            tiktok: socialLinks.tiktok,
        },
        contactPhone: (data as any).contact_phone_bus,
        contactEmail: (data as any).contact_email_bus,
        website: website,
        rating: (data as any).avg_rating_bus ?? 0,
        reviewCount: (data as any).reviews_count_bus ?? 0,
        isApproved: (data as any).moderation_status_bus === 'approved',
    };
}
