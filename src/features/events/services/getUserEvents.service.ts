import { supabase } from '@/lib/supabase/client';

// ============================================
// Constants
// ============================================

const STORAGE_BUCKET = 'events-images';

// ============================================
// Types
// ============================================

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
  moderation_note_evt: string | null;
  is_active_evt: boolean;
  created_at_evt: string;
  event_images?: Array<{
    path_eim: string;
    sort_order_eim: number;
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
  event_category_map?: Array<{
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

export async function getUserEvents(userId: string): Promise<UserEvent[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(
        `
                id_evt,
                name_evt,
                description_evt,
                start_at_evt,
                end_at_evt,
                is_free_evt,
                price_evt,
                currency_evt,
                capacity_evt,
                moderation_status_evt,
                moderation_note_evt,
                is_active_evt,
                created_at_evt,
                event_images (
                    path_eim,
                    sort_order_eim
                ),
                locations!events_location_id_evt_fkey (
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
                event_category_map (
                    categories (
                        id_cat,
                        name_cat
                    )
                )
            `,
      )
      .eq('created_by_evt', userId)
      .order('created_at_evt', { ascending: false });

    if (error) throw error;
    return (data || []) as unknown as UserEvent[];
  } catch (error) {
    console.error('[getUserEvents] Error:', error);
    throw error;
  }
}
