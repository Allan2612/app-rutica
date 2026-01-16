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
}

function mapBusinessToListItem(item: BusinessListRecord): BusinessListItem {
    console.log('[useBusinesses] Mapeando negocio:', item.name_bus);

    const sortedImages = [...(item.business_images ?? [])].sort(
        (a, b) => (a?.sort_order_bim ?? 0) - (b?.sort_order_bim ?? 0)
    );

    const coverImage = sortedImages.find((img) => img.image_type_bim === 'cover');
    const logoImage = sortedImages.find((img) => img.image_type_bim === 'logo');
    const galleryImage = sortedImages.find((img) => img.image_type_bim === 'gallery');

    // Priorizar cover, luego gallery, luego logo
    const primaryImage = coverImage ?? galleryImage ?? logoImage ?? sortedImages[0];

    const imageUrl =
        primaryImage?.bucket_bim && primaryImage?.path_bim
            ? getImageUrl(primaryImage.bucket_bim, primaryImage.path_bim)
            : null;

    const logoUrl =
        logoImage?.bucket_bim && logoImage?.path_bim
            ? getImageUrl(logoImage.bucket_bim, logoImage.path_bim)
            : null;

    console.log('[useBusinesses] URLs generadas:', { imageUrl, logoUrl });

    // Obtener todas las categorías de la relación many-to-many
    const categories = item.business_category_map
        ?.map(bcm => bcm.categories)
        .filter((cat): cat is NonNullable<typeof cat> => cat !== null) ?? [];
    const categoryNames = categories.map(cat => cat.name_cat);
    const categoryIds = categories.map(cat => cat.id_cat);

    const locationParts = [item.locations?.canton_loc, item.locations?.district_loc].filter(Boolean);

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
    };
}

export function useBusinesses({ enabled = true, ...filters }: BusinessListFilters & { enabled?: boolean } = {}) {
    const { searchText = '', categoryIds = [] } = filters;

    return useQuery({
        queryKey: ['businesses', { searchText, categoryIds }],
        queryFn: () => {
            return getBusinessList({ searchText, categoryIds });
        },
        enabled,
        select: (rows) => {
            return rows.map(mapBusinessToListItem);
        },
    });
}
