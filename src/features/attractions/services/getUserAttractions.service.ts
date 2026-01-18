import { supabase } from '@/lib/supabase/client';

export interface UserAttraction {
    id_atr: string;
    name_atr: string;
    description_atr: string | null;
    moderation_status_atr: string;
    is_active_atr: boolean;
    created_at_atr: string;
    attraction_images?: Array<{
        bucket_aim: string;
        path_aim: string;
        sort_order_aim: number;
    }>;
    locations?: {
        province_loc: string | null;
        canton_loc: string | null;
        district_loc: string | null;
    } | null;
    attraction_category_map?: Array<{
        categories: {
            id_cat: string;
            name_cat: string;
        } | null;
    }>;
}

function getImageUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

export async function getUserAttractions(userId: string): Promise<UserAttraction[]> {
    try {
        const { data, error } = await supabase
            .from('attractions')
            .select(`
                *,
                attraction_images (
                    bucket_aim,
                    path_aim,
                    sort_order_aim
                ),
                locations (
                    province_loc,
                    canton_loc,
                    district_loc
                ),
                attraction_category_map (
                    categories (
                        id_cat,
                        name_cat
                    )
                )
            `)
            .eq('submitted_by_atr', userId)
            .order('created_at_atr', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        throw error;
    }
}
