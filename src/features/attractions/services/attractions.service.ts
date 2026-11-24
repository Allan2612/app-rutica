import { applyLocation, EMPTY_PAGE, pageRange, resolveLocationIds } from '@/services/listQuery';
import type { ListScope, Page } from '@/services/listQuery';
import { supabase } from '@/lib/supabase/client';
import { buildIlikeOr } from '@/utils/searchFilters';
import { publicStorageUrl } from '@/utils/storage';

// ============================================
// Constants
// ============================================

const STORAGE_BUCKET = 'attractions-images';

// ============================================
// Types
// ============================================

export interface AttractionListFilters extends ListScope {
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
  return publicStorageUrl(STORAGE_BUCKET, path);
}

// ============================================
// Service Functions
// ============================================

export async function getAttractionsList(
  filters: AttractionListFilters = {},
): Promise<Page<AttractionListRecord>> {
  const { searchText, categoryIds, page, location, locationMode } = filters;
  const locationIds = await resolveLocationIds(location);

  let query = (supabase as any).from('attractions').select(
    `
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
    `,
    { count: 'exact' },
  );

  // Solo atracciones aprobadas y activas
  query = query.eq('moderation_status_atr', 'approved').eq('is_active_atr', true);

  // Filtrar por categorías si se especifican
  if (categoryIds && categoryIds.length > 0) {
    query = query.in('attraction_category_map.category_id_acm', categoryIds);
  }

  if (searchText && searchText.trim().length > 0) {
    const term = searchText.trim();
    query = query.or(buildIlikeOr(['name_atr', 'description_atr'], term));
  }

  query = applyLocation(query, 'location_id_atr', locationIds, locationMode);
  if (!query) return EMPTY_PAGE;

  const [from, to] = pageRange(page);
  query = query
    .order('created_at_atr', { ascending: false })
    .order('id_atr', { ascending: true })
    .range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return { rows: (data ?? []) as AttractionListRecord[], total: count ?? 0 };
}
