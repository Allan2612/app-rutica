import { useQuery } from '@tanstack/react-query';
import {
  BusinessListFilters,
  BusinessListRecord,
  getBusinessList,
  getImageUrl,
} from '@/features/business/services';

export interface BusinessListItem {
  id: string;
  name: string;
  description: string | null;
  categoryNames: string[];
  categoryIds: string[];
  locationLabel: string | null;
  imageUrl: string | null;
  logoUrl: string | null;
  rating: number;
  reviewCount: number;
  isApproved: boolean;
  hasActivePromotions: boolean;
}

/**
 * Extrae el tipo de imagen del path (V3)
 * Path format: <business_id>/<prefix>-<timestamp>-<random>.<ext>
 */
function getImageTypeFromPath(path: string): string {
  if (!path) return '';
  const filename = path.split('/').pop() || '';
  return filename.split('-')[0];
}

function mapBusinessToListItem(item: BusinessListRecord): BusinessListItem {
  const sortedImages = [...(item.business_images ?? [])].sort(
    (a, b) => (a?.sort_order_bim ?? 0) - (b?.sort_order_bim ?? 0),
  );

  // V3: Identificar por prefix en path
  const coverImage = sortedImages.find((img) => getImageTypeFromPath(img.path_bim) === 'cover');
  const logoImage = sortedImages.find((img) => getImageTypeFromPath(img.path_bim) === 'logo');
  const galleryImage = sortedImages.find((img) => getImageTypeFromPath(img.path_bim) === 'gallery');

  // Priorizar cover, luego gallery, luego logo
  const primaryImage = coverImage ?? galleryImage ?? logoImage ?? sortedImages[0];

  // V3: Solo path_bim, bucket fijo
  const imageUrl = primaryImage?.path_bim ? getImageUrl(primaryImage.path_bim) : null;

  const logoUrl = logoImage?.path_bim ? getImageUrl(logoImage.path_bim) : null;

  // Obtener todas las categorías de la relación many-to-many
  const categories =
    item.business_category_map
      ?.map((bcm) => bcm.categories)
      .filter((cat): cat is NonNullable<typeof cat> => cat !== null) ?? [];
  const categoryNames = categories.map((cat) => cat.name_cat);
  const categoryIds = categories.map((cat) => cat.id_cat);

  // V3: Ubicación con jerarquía normalizada (districts -> cantons -> provinces -> countries)
  const locationData = item.locations;
  const districtData = locationData?.districts;
  const cantonData = districtData?.cantons;
  const provinceData = cantonData?.provinces;
  const locationParts = [
    provinceData?.name_prv,
    cantonData?.name_ctn,
    districtData?.name_dst,
  ].filter(Boolean);

  return {
    id: item.id_bus,
    name: item.name_bus,
    description: item.description_bus,
    categoryNames,
    categoryIds,
    locationLabel: locationParts.length ? locationParts.join(', ') : null,
    imageUrl,
    logoUrl,
    rating: item.avg_rating_bus ?? 0,
    reviewCount: item.reviews_count_bus ?? 0,
    isApproved: item.moderation_status_bus === 'approved',
    hasActivePromotions: (item.promotions?.length ?? 0) > 0,
  };
}

export function useBusinesses({
  enabled = true,
  ...filters
}: BusinessListFilters & { enabled?: boolean } = {}) {
  const { searchText = '', categoryIds = [], province, canton, district } = filters;

  return useQuery({
    queryKey: ['businesses', { searchText, categoryIds, province, canton, district }],
    queryFn: () => {
      // No pasar filtros de ubicación al servicio, filtraremos en select
      return getBusinessList({ searchText, categoryIds });
    },
    enabled,
    select: (rows) => {
      let items = rows.map(mapBusinessToListItem);

      // Filtrar por ubicación en JavaScript
      if (district) {
        items = items.filter((item) => {
          const parts = item.locationLabel?.split(', ') || [];
          return parts.some((part) => part.toLowerCase() === district.toLowerCase());
        });
      } else if (canton) {
        items = items.filter((item) => {
          const parts = item.locationLabel?.split(', ') || [];
          return parts.some((part) => part.toLowerCase() === canton.toLowerCase());
        });
      } else if (province) {
        items = items.filter((item) => {
          const parts = item.locationLabel?.split(', ') || [];
          return parts.some((part) => part.toLowerCase() === province.toLowerCase());
        });
      }

      return items;
    },
  });
}
