import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import { IMAGE_WIDTH, publicStorageUrl } from '@/utils/storage';

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
  const { data, error } = await supabase
    .from('businesses')
    .select(
      `
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
    `,
    )
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
  const images = (data.business_images ?? []).sort(
    (a, b) => (a?.sort_order_bim ?? 0) - (b?.sort_order_bim ?? 0),
  );

  // V3: sort_order=0 es logo, >0 es gallery
  const logoImage = images.find(
    (img) => img.sort_order_bim === 0 || getImageType(img.path_bim) === 'logo',
  );
  const coverImage = images.find((img) => getImageType(img.path_bim) === 'cover');
  const galleryImagesData = images.filter(
    (img) => (img.sort_order_bim ?? 0) > 0 && getImageType(img.path_bim) !== 'cover',
  );

  const getImageUrl = (path: string) => publicStorageUrl(BUCKET_NAME, path, IMAGE_WIDTH.full);

  const logoUrl = logoImage?.path_bim
    ? publicStorageUrl(BUCKET_NAME, logoImage.path_bim, IMAGE_WIDTH.thumb)
    : null;

  const coverImageUrl = coverImage?.path_bim ? getImageUrl(coverImage.path_bim) : null;

  const galleryImages = galleryImagesData
    .filter((img) => img.path_bim)
    .map((img) => getImageUrl(img.path_bim))
    .slice(0, 3); // Máximo 3 imágenes

  // Procesar categorías
  const categories = data.business_category_map?.map((bcm) => bcm.categories).filter(Boolean) ?? [];
  const categoryNames = categories.map((c) => c.name_cat).filter((n): n is string => !!n);
  const categoryIds = categories.map((c) => c.id_cat);

  // Procesar ubicación V3
  const location = Array.isArray(data.locations) ? data.locations[0] : data.locations;
  const district = location?.districts;
  const canton = district?.cantons;
  const province = canton?.provinces;
  const country = province?.countries;

  const locationParts = [
    country?.name_cnt,
    province?.name_prv,
    canton?.name_ctn,
    district?.name_dst,
  ].filter(Boolean);
  const locationLabel = locationParts.length ? locationParts.join(', ') : null;

  // Procesar social links (viene como JSON)
  const socialLinks = (data.social_links_bus ?? {}) as {
    facebook?: string | null;
    instagram?: string | null;
    tiktok?: string | null;
  };

  // Asegurar que el website tenga protocolo
  let website = data.website_bus;
  if (website && !website.startsWith('http://') && !website.startsWith('https://')) {
    website = `https://${website}`;
  }

  return {
    id: data.id_bus,
    ownerId: data.owner_id_bus ?? '',
    name: data.name_bus ?? '',
    description: data.description_bus,
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
      facebook: socialLinks.facebook ?? undefined,
      instagram: socialLinks.instagram ?? undefined,
      tiktok: socialLinks.tiktok ?? undefined,
    },
    contactPhone: data.contact_phone_bus,
    contactEmail: data.contact_email_bus,
    website: website,
    rating: data.avg_rating_bus ?? 0,
    reviewCount: data.reviews_count_bus ?? 0,
    isApproved: data.moderation_status_bus === 'approved',
  };
}
