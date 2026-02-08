import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
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
        (a, b) => (a?.sort_order_aim ?? 0) - (b?.sort_order_aim ?? 0)
    );

    // V3: Solo path_aim, usar getImageUrl con un solo argumento
    const imageUrls = sortedImages
        .filter(img => img?.path_aim)
        .map(img => getImageUrl(img.path_aim));

    // Obtener categorías
    const categories = item.attraction_category_map
        ?.map(acm => acm.categories)
        .filter((cat): cat is NonNullable<typeof cat> => cat !== null) ?? [];
    const categoryNames = categories.map(cat => cat.name_cat);
    const categoryIds = categories.map(cat => cat.id_cat);

    // V3: Ubicación con jerarquía normalizada (districts -> cantons -> provinces)
    const locationData = item.locations;
    const districtData = locationData?.districts;
    const cantonData = districtData?.cantons;
    const provinceData = cantonData?.provinces;

    const locationParts = [
        provinceData?.name_prv,
        cantonData?.name_ctn,
        districtData?.name_dst
    ].filter(Boolean);

    // Nombre del autor
    const authorName = item.profiles
        ? `${item.profiles.first_name_prf} ${item.profiles.last_name1_prf}`
        : null;

    // Avatar del autor
    const authorAvatarUrl = item.profiles?.profile_photo_path_prf
        ? supabase.storage.from('profiles-images').getPublicUrl(item.profiles.profile_photo_path_prf).data.publicUrl
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

export function useAttractions({ enabled = true, ...filters }: AttractionListFilters & { enabled?: boolean } = {}) {
    const { searchText = '', categoryIds = [], province, canton, district } = filters;

    return useQuery({
        queryKey: ['attractions', { searchText, categoryIds, province, canton, district }],
        queryFn: () => getAttractionsList({ searchText, categoryIds }),
        enabled,
        select: (rows) => {
            let items = rows.map(mapAttractionToListItem);
            
            // Filtrar por ubicación en JavaScript
            if (district) {
                items = items.filter(item => {
                    const parts = item.locationLabel?.split(', ') || [];
                    return parts.some(part => part.toLowerCase() === district.toLowerCase());
                });
            } else if (canton) {
                items = items.filter(item => {
                    const parts = item.locationLabel?.split(', ') || [];
                    return parts.some(part => part.toLowerCase() === canton.toLowerCase());
                });
            } else if (province) {
                items = items.filter(item => {
                    const parts = item.locationLabel?.split(', ') || [];
                    return parts.some(part => part.toLowerCase() === province.toLowerCase());
                });
            }
            
            return items;
        },
    });
}
