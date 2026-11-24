import { usePagedList } from '@/hooks/usePagedList';

import {
  AttractionListFilters,
  AttractionListRecord,
  getAttractionsList,
} from '@/features/attractions/services/attractions.service';

import { IMAGE_WIDTH, publicStorageUrl } from '@/utils/storage';

export interface AttractionListItem {
  id: string;
  name: string;
  description: string | null;
  categoryNames: string[];
  categoryIds: string[];
  locationLabel: string | null;
  latitude: number | null;
  longitude: number | null;
  imageUrls: string[];
  authorName: string | null;
  authorAvatarUrl: string | null;
  rating: number;
  reviewCount: number;
  isApproved: boolean;
  createdAt: string;
}

function mapAttractionToListItem(item: AttractionListRecord): AttractionListItem {
  // Obtener todas las imágenes ordenadas por sort_order
  const sortedImages = [...(item.attraction_images ?? [])].sort(
    (a, b) => (a?.sort_order_aim ?? 0) - (b?.sort_order_aim ?? 0),
  );

  // V3: Solo path_aim, usar getImageUrl con un solo argumento
  const imageUrls = sortedImages
    .filter((img) => img?.path_aim)
    .map((img) => publicStorageUrl('attractions-images', img.path_aim, IMAGE_WIDTH.card));

  // Obtener categorías
  const categories =
    item.attraction_category_map
      ?.map((acm) => acm.categories)
      .filter((cat): cat is NonNullable<typeof cat> => cat !== null) ?? [];
  const categoryNames = categories.map((cat) => cat.name_cat);
  const categoryIds = categories.map((cat) => cat.id_cat);

  // V3: Ubicación con jerarquía normalizada (districts -> cantons -> provinces)
  const locationData = item.locations;
  const districtData = locationData?.districts;
  const cantonData = districtData?.cantons;
  const provinceData = cantonData?.provinces;

  const locationParts = [
    provinceData?.name_prv,
    cantonData?.name_ctn,
    districtData?.name_dst,
  ].filter(Boolean);

  // Nombre del autor
  const authorName = item.profiles
    ? `${item.profiles.first_name_prf} ${item.profiles.last_name1_prf}`
    : null;

  // Avatar del autor
  const authorAvatarUrl = item.profiles?.profile_photo_path_prf
    ? publicStorageUrl('profiles-images', item.profiles.profile_photo_path_prf, IMAGE_WIDTH.thumb)
    : null;

  return {
    id: item.id_atr,
    name: item.name_atr,
    description: item.description_atr,
    categoryNames,
    categoryIds,
    locationLabel: locationParts.length ? locationParts.join(', ') : null,
    latitude: item.locations?.latitude_loc ?? null,
    longitude: item.locations?.longitude_loc ?? null,
    imageUrls,
    authorName,
    authorAvatarUrl,
    rating: item.avg_rating_atr ?? 0,
    reviewCount: item.reviews_count_atr ?? 0,
    isApproved: item.moderation_status_atr === 'approved',
    createdAt: item.created_at_atr,
  };
}

export function useAttractions({
  enabled = true,
  ...filters
}: AttractionListFilters & { enabled?: boolean } = {}) {
  const { searchText = '', categoryIds = [], location = null, locationMode = 'only' } = filters;
  const scope = { searchText, categoryIds, location, locationMode };

  return usePagedList(['attractions', scope], (page) => getAttractionsList({ ...scope, page }), {
    enabled,
    map: mapAttractionToListItem,
  });
}
