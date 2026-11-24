import {
  applyLocation,
  EMPTY_PAGE,
  locationJoin,
  pageRange,
  resolveDistrictIds,
} from '@/services/listQuery';
import type { ListScope, Page } from '@/services/listQuery';
import { supabase } from '@/lib/supabase/client';
import { ilikePattern } from '@/utils/searchFilters';

// ============================================
// Constants
// ============================================

const BUCKET_NAME = 'events-images';

// ============================================
// Types
// ============================================

export interface EventListFilters extends ListScope {
  searchText?: string;
  categoryIds?: string[];
  upcoming?: boolean;
}

export interface EventListRecord {
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
  created_by_evt: string;
  contact_phone_evt: string | null;
  contact_email_evt: string | null;
  website_evt: string | null;
  social_links_evt: Record<string, string> | null;
  avg_rating_evt: number | null;
  reviews_count_evt: number | null;
  profiles?: {
    first_name_prf: string;
    last_name1_prf: string;
    profile_photo_path_prf: string | null;
  } | null;
  event_category_map?:
    | {
        categories: {
          id_cat: string;
          name_cat: string;
        } | null;
      }[]
    | null;
  locations?: {
    latitude_loc: number | null;
    longitude_loc: number | null;
    districts?: {
      id_dst: string;
      name_dst: string;
      cantons?: {
        name_ctn: string;
        provinces?: {
          name_prv: string;
        };
      };
    };
  } | null;
  event_images?:
    | {
        path_eim: string;
        sort_order_eim: number;
      }[]
    | null;
}

// ============================================
// Helpers
// ============================================

export function getEventImageUrl(path: string): string {
  if (!path) return '';
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
}

// ============================================
// Service Functions
// ============================================

export async function getEventsList(
  filters: EventListFilters = {},
): Promise<Page<EventListRecord>> {
  const { searchText, categoryIds, upcoming = true, page, location, locationMode } = filters;
  const districtIds = await resolveDistrictIds(location);

  let query = supabase.from('events').select(
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
            is_active_evt,
            created_at_evt,
            created_by_evt,
            contact_phone_evt,
            contact_email_evt,
            website_evt,
            social_links_evt,
            avg_rating_evt,
            reviews_count_evt,
            profiles!events_created_by_evt_fkey (
                first_name_prf,
                last_name1_prf,
                profile_photo_path_prf
            ),
            event_category_map (
                categories (
                    id_cat,
                    name_cat
                )
            ),
            locations!events_location_id_evt_fkey${locationJoin(districtIds)} (
                latitude_loc,
                longitude_loc,
                districts!locations_district_id_fkey (
                    id_dst,
                    name_dst,
                    cantons!districts_canton_id_fkey (
                        name_ctn,
                        provinces!cantons_province_id_fkey (
                            name_prv
                        )
                    )
                )
            ),
            event_images (
                path_eim,
                sort_order_eim
            )
        `,
    { count: 'exact' },
  );

  // Solo eventos aprobados y activos
  query = query.eq('moderation_status_evt', 'approved').eq('is_active_evt', true);

  // Filtrar solo eventos futuros o en curso
  if (upcoming) {
    query = query.gte('end_at_evt', new Date().toISOString());
  }

  // Filtro por texto
  if (searchText?.trim()) {
    query = query.ilike('name_evt', ilikePattern(searchText));
  }

  // Filtro por categorías
  if (categoryIds && categoryIds.length > 0) {
    // Obtener IDs de eventos que tienen las categorías seleccionadas
    const { data: eventCategoryData } = await supabase
      .from('event_category_map')
      .select('event_id_ecm')
      .in('category_id_ecm', categoryIds);

    if (eventCategoryData && eventCategoryData.length > 0) {
      const eventIds = [...new Set(eventCategoryData.map((ec) => ec.event_id_ecm))];
      query = query.in('id_evt', eventIds);
    } else {
      // No hay eventos con esas categorías
      return EMPTY_PAGE;
    }
  }

  const scoped = applyLocation(query, 'locations.district_id_loc', districtIds, locationMode);
  if (!scoped) return EMPTY_PAGE;

  // Próximos primero
  const [from, to] = pageRange(page);
  const paged = scoped
    .order('start_at_evt', { ascending: true })
    .order('id_evt', { ascending: true })
    .range(from, to);

  const { data, error, count } = await paged;
  if (error) throw error;

  return { rows: (data ?? []) as EventListRecord[], total: count ?? 0 };
}
