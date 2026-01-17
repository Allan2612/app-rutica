import { useQuery } from '@tanstack/react-query';
import {
    AttractionListFilters,
    AttractionListRecord,
    getAttractionsList,
    getImageUrl,
} from '@/features/attractions/services/attractions.service';

export interface AttractionListItem {
    id: string;
    name: string;
    description: string | null;
    categoryNames: string[];
    categoryIds: string[];
    locationLabel: string | null;
    imageUrl: string | null;
    authorName: string | null;
    rating: number;
    reviewCount: number;
    isApproved: boolean;
    createdAt: string;
}

function mapAttractionToListItem(item: AttractionListRecord): AttractionListItem {
    // Obtener primera imagen ordenada por sort_order
    const sortedImages = [...(item.attraction_images ?? [])].sort(
        (a, b) => (a?.sort_order_aim ?? 0) - (b?.sort_order_aim ?? 0)
    );

    const primaryImage = sortedImages[0];
    const imageUrl =
        primaryImage?.bucket_aim && primaryImage?.path_aim
            ? getImageUrl(primaryImage.bucket_aim, primaryImage.path_aim)
            : null;

    // Obtener categorías
    const categories = item.attraction_category_map
        ?.map(acm => acm.categories)
        .filter((cat): cat is NonNullable<typeof cat> => cat !== null) ?? [];
    const categoryNames = categories.map(cat => cat.name_cat);
    const categoryIds = categories.map(cat => cat.id_cat);

    // Ubicación
    const locationParts = [item.locations?.canton_loc, item.locations?.district_loc].filter(Boolean);

    // Nombre del autor
    const authorName = item.profiles
        ? `${item.profiles.first_name_prf} ${item.profiles.last_name1_prf}`
        : null;

    return {
        id: item.id_atr,
        name: item.name_atr,
        description: item.description_atr,
        categoryNames,
        categoryIds,
        locationLabel: locationParts.length ? locationParts.join(', ') : null,
        imageUrl,
        authorName,
        rating: item.avg_rating_atr ?? 0,
        reviewCount: item.reviews_count_atr ?? 0,
        isApproved: item.moderation_status_atr === 'approved',
        createdAt: item.created_at_atr,
    };
}

export function useAttractions({ enabled = true, ...filters }: AttractionListFilters & { enabled?: boolean } = {}) {
    const { searchText = '', categoryIds = [] } = filters;

    return useQuery({
        queryKey: ['attractions', { searchText, categoryIds }],
        queryFn: () => getAttractionsList({ searchText, categoryIds }),
        enabled,
        select: (rows) => rows.map(mapAttractionToListItem),
    });
}
