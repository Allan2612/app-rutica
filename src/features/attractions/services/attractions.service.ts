import { supabase } from '@/lib/supabase/client';

// ============================================
// Constants
// ============================================

const STORAGE_BUCKET = 'attractions-images';

// ============================================
// Types
// ============================================

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
        profile_photo_path_prf: string | null;
    } | null;
    attraction_category_map?:
    | {
        categories: {
            id_cat: string;
            name_cat: string;
        } | null;
    }[]
    | null;
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
    attraction_images?:
    | {
        path_aim: string;
        sort_order_aim: number;
    }[]
    | null;
}

// ============================================
// Helpers
// ============================================

export function getImageUrl(path: string): string {
    if (!path) return '';
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

/**
 * Extrae el tipo de imagen del path (V3)
 * Path format: <entity_id>/<prefix>-<uuid>.ext
 */
function getImageTypeFromPath(path: string): string {
    if (!path) return '';
    const filename = path.split('/').pop() || '';
    return filename.split('-')[0];
}

// ============================================
// Service Functions
// ============================================

export async function getAttractionsList(
    filters: AttractionListFilters = {}
): Promise<AttractionListRecord[]> {
    const { searchText, categoryIds, province, canton, district } = filters;

    let query = supabase.from('attractions').select(`
      id_atr,
      name_atr,
      description_atr,
      moderation_status_atr,
      is_active_atr,
      avg_rating_atr,
      reviews_count_atr,
      created_at_atr,
      submitted_by_atr,
      profiles!attractions_submitted_by_atr_fkey (
        first_name_prf,
        last_name1_prf,
        profile_photo_path_prf
      ),
      attraction_category_map!inner (
        categories!inner (
          id_cat,
          name_cat
        )
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
      attraction_images (
        path_aim,
        sort_order_aim
      )
    `);

    // Solo atracciones aprobadas y activas
    query = query
        .eq('moderation_status_atr', 'approved')
        .eq('is_active_atr', true);

    // Filtrar por categorías si se especifican
    if (categoryIds && categoryIds.length > 0) {
        query = query.in('attraction_category_map.category_id_acm', categoryIds);
    }

    // Filtrar por ubicación (nivel más granular tiene prioridad)
    if (district) {
        query = query.eq('locations.districts.name_dst', district);
    } else if (canton) {
        query = query.eq('locations.districts.cantons.name_ctn', canton);
    } else if (province) {
        query = query.eq('locations.districts.cantons.provinces.name_prv', province);
    }

    if (searchText && searchText.trim().length > 0) {
        const term = searchText.trim();
        query = query.or(`name_atr.ilike.%${term}%,description_atr.ilike.%${term}%`);
    }

    query = query.order('created_at_atr', { ascending: false });

    const { data, error } = await query;

    if (error) {
        console.error('[getAttractionsList] Error:', error);
        return [];
    }

    return (data ?? []) as unknown as AttractionListRecord[];
}
