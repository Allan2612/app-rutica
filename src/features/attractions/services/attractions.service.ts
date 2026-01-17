import { supabase } from '@/lib/supabase/client';

export interface AttractionListFilters {
    searchText?: string;
    categoryIds?: string[];
}

export interface AttractionListRecord {
    id_atr: string;
    name_atr: string;
    description_atr: string | null;
    moderation_status_atr: string;
    is_active_atr: boolean;
    avg_rating_atr: number | null;
    reviews_count_atr: number | null;
    created_at_atr: string;
    submitted_by_atr: string;
    profiles?: {
        first_name_prf: string;
        last_name1_prf: string;
    } | null;
    attraction_category_map?: {
        categories: {
            id_cat: string;
            name_cat: string;
        } | null;
    }[] | null;
    locations?: {
        canton_loc: string | null;
        district_loc: string | null;
        province_loc: string | null;
    } | null;
    attraction_images?: {
        bucket_aim: string;
        path_aim: string;
        sort_order_aim: number;
    }[] | null;
}

export function getImageUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

export async function getAttractionsList(filters: AttractionListFilters = {}): Promise<AttractionListRecord[]> {
    const { searchText, categoryIds } = filters;

    let query = supabase
        .from('attractions')
        .select(`
            id_atr,
            name_atr,
            description_atr,
            moderation_status_atr,
            is_active_atr,
            avg_rating_atr,
            reviews_count_atr,
            created_at_atr,
            submitted_by_atr,
            profiles!submitted_by_atr (
                first_name_prf,
                last_name1_prf
            ),
            attraction_category_map!inner (
                categories!inner (
                    id_cat,
                    name_cat
                )
            ),
            locations ( canton_loc, district_loc, province_loc ),
            attraction_images ( bucket_aim, path_aim, sort_order_aim )
        `);

    // Filtrar por categorías si se especifican
    if (categoryIds && categoryIds.length > 0) {
        query = query.in('attraction_category_map.category_id_acm', categoryIds);
    }

    if (searchText && searchText.trim().length > 0) {
        const term = searchText.trim();
        query = query.or(`name_atr.ilike.%${term}%,description_atr.ilike.%${term}%`);
    }

    query = query.order('created_at_atr', { ascending: false });

    const { data, error } = await query;

    if (error) {
        return [];
    }

    return (data ?? []) as unknown as AttractionListRecord[];
}
