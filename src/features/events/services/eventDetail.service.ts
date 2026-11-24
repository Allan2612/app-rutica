/**
 * Servicio para obtener el detalle de un evento
 */
import { supabase } from '@/lib/supabase/client';
import { IMAGE_WIDTH, publicStorageUrl } from '@/utils/storage';

// ============================================
// Constants
// ============================================

const BUCKET_NAME = 'events-images';

// ============================================
// Types
// ============================================

export interface EventDetailData {
  id: string;
  name: string;
  description: string | null;
  startAt: string;
  endAt: string;
  isFree: boolean;
  price: number | null;
  currency: string | null;
  capacity: number | null;
  categoryNames: string[];
  categoryIds: string[];
  locationLabel: string | null;
  districtId: string | null;
  province: string | null;
  canton: string | null;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  coverImage: string | null;
  galleryImages: string[];
  authorName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  website: string | null;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  rating: number;
  reviewCount: number;
  isApproved: boolean;
  createdAt: string;
  createdBy: string | null;
}

// ============================================
// Helpers
// ============================================

function getImageUrl(path: string): string {
  return publicStorageUrl(BUCKET_NAME, path, IMAGE_WIDTH.full);
}

// ============================================
// Service Functions
// ============================================

export async function getEventDetail(eventId: string): Promise<EventDetailData | null> {
  const { data, error } = await supabase
    .from('events')
    .select(
      `
            id_evt,
            created_by_evt,
            name_evt,
            description_evt,
            start_at_evt,
            end_at_evt,
            is_free_evt,
            price_evt,
            currency_evt,
            capacity_evt,
            moderation_status_evt,
            created_at_evt,
            contact_phone_evt,
            contact_email_evt,
            website_evt,
            social_links_evt,
            avg_rating_evt,
            reviews_count_evt,
            profiles!events_created_by_evt_fkey (
                first_name_prf,
                last_name1_prf
            ),
            event_category_map (
                categories (
                    id_cat,
                    name_cat
                )
            ),
            locations!events_location_id_evt_fkey (
                latitude_loc,
                longitude_loc,
                districts!locations_district_id_fkey (
                    id_dst,
                    name_dst,
                    cantons!districts_canton_id_fkey (
                        name_ctn,
                        provinces!cantons_province_id_fkey (
                            name_prv
                        )
                    )
                )
            ),
            event_images (
                path_eim,
                sort_order_eim
            )
        `,
    )
    .eq('id_evt', eventId)
    .single();

  if (error || !data) {
    console.error('[getEventDetail] Error:', error);
    return null;
  }

  // Procesar imágenes - ordenar por sort_order, primera con sort_order=0 es cover
  const sortedImages = (data.event_images ?? [])
    .sort((a, b) => (a?.sort_order_eim ?? 0) - (b?.sort_order_eim ?? 0))
    .filter((img) => img.path_eim);

  const coverImage = sortedImages.find((img) => img.sort_order_eim === 0);
  const galleryImages = sortedImages.filter((img) => (img.sort_order_eim ?? 0) > 0);

  // Procesar categorías
  const categories = data.event_category_map?.map((m) => m.categories).filter(Boolean) ?? [];
  const categoryNames = categories.map((c) => c.name_cat).filter((n): n is string => !!n);
  const categoryIds = categories.map((c) => c.id_cat);

  // Procesar ubicación V3 (normalizada con joins)
  const location = data.locations;
  const district = location?.districts;
  const canton = district?.cantons;
  const province = canton?.provinces;

  const districtName = district?.name_dst ?? null;
  const cantonName = canton?.name_ctn ?? null;
  const provinceName = province?.name_prv ?? null;
  const districtId = district?.id_dst ?? null;

  const locationParts = [cantonName, districtName].filter(Boolean);
  const locationLabel = locationParts.length ? locationParts.join(', ') : null;

  // Procesar autor
  const profile = data.profiles as any;
  const authorName = profile ? `${profile.first_name_prf} ${profile.last_name1_prf}`.trim() : null;

  // Procesar social links
  const socialLinks = (data.social_links_evt as Record<string, string>) ?? {};

  // Asegurar protocolo en website
  let website = data.website_evt;
  if (website && !website.startsWith('http://') && !website.startsWith('https://')) {
    website = `https://${website}`;
  }

  return {
    id: data.id_evt,
    name: data.name_evt ?? '',
    description: data.description_evt,
    startAt: data.start_at_evt ?? '',
    endAt: data.end_at_evt ?? '',
    isFree: data.is_free_evt ?? false,
    price: data.price_evt,
    currency: data.currency_evt,
    capacity: data.capacity_evt,
    categoryNames,
    categoryIds,
    locationLabel,
    districtId,
    province: provinceName,
    canton: cantonName,
    district: districtName,
    latitude: location?.latitude_loc ?? null,
    longitude: location?.longitude_loc ?? null,
    coverImage: coverImage ? getImageUrl(coverImage.path_eim) : null,
    galleryImages: galleryImages.map((img) => getImageUrl(img.path_eim)),
    authorName,
    contactPhone: data.contact_phone_evt,
    contactEmail: data.contact_email_evt,
    website,
    socialLinks: {
      facebook: socialLinks.facebook,
      instagram: socialLinks.instagram,
      tiktok: socialLinks.tiktok,
    },
    rating: data.avg_rating_evt ?? 0,
    reviewCount: data.reviews_count_evt ?? 0,
    isApproved: data.moderation_status_evt === 'approved',
    createdAt: data.created_at_evt ?? '',
    createdBy: data.created_by_evt ?? null,
  };
}
