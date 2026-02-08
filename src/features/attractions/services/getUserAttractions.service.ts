import { supabase } from '@/lib/supabase/client';

// ============================================
// Constants
// ============================================

const STORAGE_BUCKET = 'attractions-images';

// ============================================
// Types
// ============================================

export interface UserAttraction {
    id_atr: string;
    name_atr: string;
    description_atr: string | null;
    moderation_status_atr: string;
    moderation_note_atr: string | null;
    is_active_atr: boolean;
    created_at_atr: string;
    attraction_images?: Array<{
        path_aim: string;
        sort_order_aim: number;
    }>;
    locations?: {
        address_loc: string | null;
        latitude_loc: number | null;
        longitude_loc: number | null;
        districts?: {
            name_dst: string;
            cantons?: {
                name_ctn: string;
                provinces?: {
                    name_prv: string;
                };
            };
        };
    } | null;
    attraction_category_map?: Array<{
        categories: {
            id_cat: string;
            name_cat: string;
        } | null;
    }>;
}

// ============================================
// Helpers
// ============================================

export function getImageUrl(path: string): string {
    if (!path) return '';
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

// ============================================
// Service Functions
// ============================================

export async function getUserAttractions(userId: string): Promise<UserAttraction[]> {
    try {
        const { data, error } = await supabase
            .from('attractions')
            .select(
                `
        id_atr,
        name_atr,
        description_atr,
        moderation_status_atr,
        moderation_note_atr,
        is_active_atr,
        created_at_atr,
        attraction_images (
          path_aim,
          sort_order_aim
        ),
        locations!attractions_location_id_atr_fkey (
          address_loc,
          latitude_loc,
          longitude_loc,
          districts!locations_district_id_fkey (
            name_dst,
            cantons!districts_canton_id_fkey (
              name_ctn,
              provinces!cantons_province_id_fkey (
                name_prv
              )
            )
          )
        ),
        attraction_category_map (
          categories (
            id_cat,
            name_cat
          )
        )
      `
            )
            .eq('submitted_by_atr', userId)
            .order('created_at_atr', { ascending: false });

        if (error) throw error;
        return (data || []) as unknown as UserAttraction[];
    } catch (error) {
        console.error('[getUserAttractions] Error:', error);
        throw error;
    }
}
