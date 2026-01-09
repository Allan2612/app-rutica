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
    categoryName: string | null;
    locationLabel: string | null;
    imageUrl: string | null;
    logoUrl: string | null;
    rating: number;
    reviewCount: number;
}

function mapBusinessToListItem(item: BusinessListRecord): BusinessListItem {
    const sortedImages = [...(item.business_images ?? [])].sort(
        (a, b) => (a?.sort_order_bim ?? 0) - (b?.sort_order_bim ?? 0)
    );

    const logoImage = sortedImages.find((img) => img.bucket_bim === 'business-logos');
    const galleryImage = sortedImages.find((img) => img.bucket_bim === 'business-images');
    const primaryImage = galleryImage ?? logoImage ?? sortedImages[0];

    const imageUrl =
        primaryImage?.bucket_bim && primaryImage?.path_bim
            ? getImageUrl(primaryImage.bucket_bim, primaryImage.path_bim)
            : null;

    const logoUrl =
        logoImage?.bucket_bim && logoImage?.path_bim
            ? getImageUrl(logoImage.bucket_bim, logoImage.path_bim)
            : null;

    const locationParts = [item.locations?.canton_loc, item.locations?.district_loc].filter(Boolean);

    return {
        id: item.id_bus,
        name: item.name_bus,
        description: item.description_bus,
        categoryName: item.business_categories?.name_bca ?? null,
        locationLabel: locationParts.length ? locationParts.join(', ') : null,
        imageUrl,
        logoUrl,
        rating: 4.5,
        reviewCount: 20,
    };
}

export function useBusinesses({ enabled = true, ...filters }: BusinessListFilters & { enabled?: boolean } = {}) {
    const { searchText = '', categoryIds = [] } = filters;

    console.log('[HOOK] useBusinesses mounted/updated:', { enabled, searchText, categoryIds });

    return useQuery({
        queryKey: ['businesses', { searchText, categoryIds }],
        queryFn: () => {
            console.log('[HOOK] useBusinesses queryFn called');
            return getBusinessList({ searchText, categoryIds });
        },
        enabled,
        select: (rows) => {
            console.log('[HOOK] useBusinesses select called with rows:', rows.length);
            return rows.map(mapBusinessToListItem);
        },
    });
}
