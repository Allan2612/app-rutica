import { supabase } from '@/lib/supabase/client';

export interface UserEvent {
    id_evt: string;
    name_evt: string;
    description_evt: string | null;
    start_at_evt: string;
    end_at_evt: string;
    is_free_evt: boolean;
    price_evt: number | null;
    currency_evt: string | null;
    capacity_evt: number | null;
    moderation_status_evt: string;
    is_active_evt: boolean;
    created_at_evt: string;
    event_images?: Array<{
        bucket_eim: string;
        path_eim: string;
        sort_order_eim: number;
    }>;
    locations?: Array<{
        province_loc: string | null;
        canton_loc: string | null;
        district_loc: string | null;
    }>;
    event_category_map?: Array<{
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

export async function getUserEvents(userId: string): Promise<UserEvent[]> {
    try {
        const { data, error } = await supabase
            .from('events')
            .select(`
                *,
                event_images (
                    bucket_eim,
                    path_eim,
                    sort_order_eim
                ),
                locations (
                    province_loc,
                    canton_loc,
                    district_loc
                ),
                event_category_map (
                    categories (
                        id_cat,
                        name_cat
                    )
                )
            `)
            .eq('created_by_evt', userId)
            .order('created_at_evt', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching user events:', error);
        throw error;
    }
}
