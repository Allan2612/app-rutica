import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import {
  EventListFilters,
  EventListRecord,
  getEventsList,
} from '@/features/events/services/events.service';
import { getImageUrl } from '@/features/events/services/getUserEvents.service';

export interface EventListItem {
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
  latitude: number | null;
  longitude: number | null;
  imageUrls: string[];
  authorName: string | null;
  authorAvatarUrl: string | null;
  isApproved: boolean;
  createdAt: string;
  contactPhone: string | null;
  contactEmail: string | null;
  website: string | null;
  socialLinks: Record<string, string> | null;
  rating: number;
  reviewCount: number;
}

function mapEventToListItem(item: EventListRecord): EventListItem {
  // Obtener todas las imágenes ordenadas por sort_order
  const sortedImages = [...(item.event_images ?? [])].sort(
    (a, b) => (a?.sort_order_eim ?? 0) - (b?.sort_order_eim ?? 0),
  );

  const imageUrls = sortedImages
    .filter((img) => img?.path_eim)
    .map((img) => getImageUrl(img.path_eim));

  // Obtener categorías
  const categories =
    item.event_category_map
      ?.map((ecm) => ecm.categories)
      .filter((cat): cat is NonNullable<typeof cat> => cat !== null) ?? [];
  const categoryNames = categories.map((cat) => cat.name_cat);
  const categoryIds = categories.map((cat) => cat.id_cat);

  // Ubicación con estructura jerárquica normalizada
  const locationParts = [
    item.locations?.districts?.cantons?.provinces?.name_prv,
    item.locations?.districts?.cantons?.name_ctn,
    item.locations?.districts?.name_dst,
  ].filter(Boolean);

  // Nombre del autor
  const authorName = item.profiles
    ? `${item.profiles.first_name_prf} ${item.profiles.last_name1_prf}`
    : null;

  // Avatar del autor
  const authorAvatarUrl = item.profiles?.profile_photo_path_prf
    ? supabase.storage.from('profiles-images').getPublicUrl(item.profiles.profile_photo_path_prf)
        .data.publicUrl
    : null;

  return {
    id: item.id_evt,
    name: item.name_evt,
    description: item.description_evt,
    startAt: item.start_at_evt,
    endAt: item.end_at_evt,
    isFree: item.is_free_evt,
    price: item.price_evt,
    currency: item.currency_evt,
    capacity: item.capacity_evt,
    categoryNames,
    categoryIds,
    locationLabel: locationParts.length ? locationParts.join(', ') : null,
    latitude: item.locations?.latitude_loc ?? null,
    longitude: item.locations?.longitude_loc ?? null,
    imageUrls,
    authorName,
    authorAvatarUrl,
    isApproved: item.moderation_status_evt === 'approved',
    createdAt: item.created_at_evt,
    contactPhone: item.contact_phone_evt ?? null,
    contactEmail: item.contact_email_evt ?? null,
    website: item.website_evt ?? null,
    socialLinks: item.social_links_evt ?? null,
    rating: item.avg_rating_evt ?? 0,
    reviewCount: item.reviews_count_evt ?? 0,
  };
}

export function useEvents(filters: EventListFilters = {}) {
  const { searchText, categoryIds, upcoming, province, canton, district } = filters;

  return useQuery({
    queryKey: ['events', 'list', { searchText, categoryIds, upcoming, province, canton, district }],
    queryFn: async () => {
      const data = await getEventsList({ searchText, categoryIds, upcoming });
      return data.map(mapEventToListItem);
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    select: (items) => {
      // Filtrar por ubicación en JavaScript
      if (!district && !canton && !province) return items;

      return items.filter((item) => {
        const parts = item.locationLabel?.split(', ') || [];

        if (district) {
          return parts.some((part) => part.toLowerCase() === district.toLowerCase());
        } else if (canton) {
          return parts.some((part) => part.toLowerCase() === canton.toLowerCase());
        } else if (province) {
          return parts.some((part) => part.toLowerCase() === province.toLowerCase());
        }

        return true;
      });
    },
  });
}
