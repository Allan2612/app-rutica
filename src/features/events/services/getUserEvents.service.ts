import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

const BUCKET_NAME = 'events-images';

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
        path_eim: string;
        sort_order_eim: number;
    }>;
    locations?: Array<{
        latitude_loc: number | null;
        longitude_loc: number | null;
        districts?: {
            id_dst: string;
            name_dst: string;
            cantons?: {
                name_ctn: string;
                provinces?: {
                    name_prv: string;
                } | null;
            } | null;
        } | null;
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
                    path_eim,
                    sort_order_eim
                ),
                locations!events_location_id_evt_fkey (
                    latitude_loc,
                    longitude_loc,
                    districts!locations_district_id_loc_fkey (
                        id_dst,
                        name_dst,
                        cantons!districts_canton_id_dst_fkey (
                            name_ctn,
                            provinces!cantons_province_id_ctn_fkey (
                                name_prv
                            )
                        )
                    )
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
        throw error;
    }
}
