import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/store';
import { getImageUrl } from '../services';
import type { BusinessListItem } from './useBusinesses';

interface FavoriteBusinessRecord {
    business_id_blk: string;
    created_at_blk: string;
    businesses: {
        id_bus: string;
        name_bus: string;
        description_bus: string | null;
        moderation_status_bus: string;
        is_active_bus: boolean;
        avg_rating_bus: number | null;
        reviews_count_bus: number | null;
        business_category_map?: {
            categories: {
                id_cat: string;
                name_cat: string;
            } | null;
        }[] | null;
        locations?: {
            districts?: {
                name_dst: string;
                cantons?: {
                    name_ctn: string;
                    provinces?: {
                        name_prv: string;
                        countries?: {
                            name_cnt: string;
                        } | null;
                    } | null;
                } | null;
            } | null;
        } | null;
        business_images?: {
            path_bim: string;
            sort_order_bim: number;
        }[] | null;
        promotions?: {
            id_prm: string;
        }[] | null;
    } | null;
}

/**
 * Extrae el tipo de imagen del path (V3)
 */
function getImageTypeFromPath(path: string): string {
    if (!path) return '';
    const filename = path.split('/').pop() || '';
    return filename.split('-')[0];
}

function mapFavoriteToBusinessItem(record: FavoriteBusinessRecord): BusinessListItem | null {
    const item = record.businesses;
    if (!item) return null;

    const sortedImages = [...(item.business_images ?? [])].sort(
        (a, b) => (a?.sort_order_bim ?? 0) - (b?.sort_order_bim ?? 0)
    );

    const coverImage = sortedImages.find((img) => getImageTypeFromPath(img.path_bim) === 'cover');
    const logoImage = sortedImages.find((img) => getImageTypeFromPath(img.path_bim) === 'logo');
    const galleryImage = sortedImages.find((img) => getImageTypeFromPath(img.path_bim) === 'gallery');

    const primaryImage = coverImage ?? galleryImage ?? logoImage ?? sortedImages[0];

    const imageUrl = primaryImage?.path_bim
        ? getImageUrl(primaryImage.path_bim)
        : null;

    const logoUrl = logoImage?.path_bim
        ? getImageUrl(logoImage.path_bim)
        : null;

    const categories = item.business_category_map
        ?.map(bcm => bcm.categories)
        .filter((cat): cat is NonNullable<typeof cat> => cat !== null) ?? [];
    const categoryNames = categories.map(cat => cat.name_cat);
    const categoryIds = categories.map(cat => cat.id_cat);

    const locationData = item.locations;
    const districtData = locationData?.districts;
    const cantonData = districtData?.cantons;
    const provinceData = cantonData?.provinces;
    const countryData = provinceData?.countries;
    const locationParts = [provinceData?.name_prv, cantonData?.name_ctn, districtData?.name_dst].filter(Boolean);

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

async function getFavoriteBusinesses(userId: string): Promise<FavoriteBusinessRecord[]> {
    const { data, error } = await supabase
        .from('business_likes')
        .select(`
            business_id_blk,
            created_at_blk,
            businesses (
                id_bus,
                name_bus,
                description_bus,
                moderation_status_bus,
                is_active_bus,
                avg_rating_bus,
                reviews_count_bus,
                business_category_map (
                    categories (
                        id_cat,
                        name_cat
                    )
                ),
                locations (
                    districts (
                        name_dst,
                        cantons (
                            name_ctn,
                            provinces (
                                name_prv,
                                countries (
                                    name_cnt
                                )
                            )
                        )
                    )
                ),
                business_images (
                    path_bim,
                    sort_order_bim
                ),
                promotions!promotions_business_id_prm_fkey (
                    id_prm
                )
            )
        `)
        .eq('user_id_blk', userId)
        .order('created_at_blk', { ascending: false });

    if (error) {
        console.error('[useFavoriteBusinesses] Error:', error.message);
        throw error;
    }

    return (data as unknown as FavoriteBusinessRecord[]) ?? [];
}

/**
 * Hook para obtener los negocios favoritos del usuario actual
 */
export function useFavoriteBusinesses() {
    const user = useAuthStore((state) => state.user);
    const userId = user?.id;

    return useQuery({
        queryKey: ['favorite-businesses', userId],
        queryFn: async () => {
            if (!userId) return [];
            const records = await getFavoriteBusinesses(userId);
            return records
                .map(mapFavoriteToBusinessItem)
                .filter((item): item is BusinessListItem => item !== null);
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2, // 2 minutos
    });
}
