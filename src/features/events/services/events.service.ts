import { supabase } from '@/lib/supabase/client';

// ============================================
// Constants
// ============================================

const BUCKET_NAME = 'events-images';

// ============================================
// Types
// ============================================

export interface EventListFilters {
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
    } | null;
    event_category_map?: {
        categories: {
            id_cat: string;
            name_cat: string;
        } | null;
    }[] | null;
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
    event_images?: {
        path_eim: string;
        sort_order_eim: number;
    }[] | null;
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

export async function getEventsList(filters: EventListFilters = {}): Promise<EventListRecord[]> {
    const { searchText, categoryIds, upcoming = true, province, canton, district } = filters;

    let query = supabase
        .from('events')
        .select(`
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
                last_name1_prf
            ),
            event_category_map (
                categories (
                    id_cat,
                    name_cat
                )
            ),
            locations!events_location_id_evt_fkey (
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
        `);

    // Solo eventos aprobados y activos
    query = query
        .eq('moderation_status_evt', 'approved')
        .eq('is_active_evt', true);

    // Filtrar solo eventos futuros o en curso
    if (upcoming) {
        query = query.gte('end_at_evt', new Date().toISOString());
    }

    // Filtrar por ubicación (nivel más granular tiene prioridad)
    if (district) {
        query = query.eq('locations.districts.name_dst', district);
    } else if (canton) {
        query = query.eq('locations.districts.cantons.name_ctn', canton);
    } else if (province) {
        query = query.eq('locations.districts.cantons.provinces.name_prv', province);
    }

    // Filtro por texto
    if (searchText?.trim()) {
        query = query.ilike('name_evt', `%${searchText.trim()}%`);
    }

    // Filtro por categorías
    if (categoryIds && categoryIds.length > 0) {
        // Obtener IDs de eventos que tienen las categorías seleccionadas
        const { data: eventCategoryData } = await supabase
            .from('event_category_map')
            .select('event_id_ecm')
            .in('category_id_ecm', categoryIds);
        
        if (eventCategoryData && eventCategoryData.length > 0) {
            const eventIds = [...new Set((eventCategoryData as any).map((ec: any) => ec.event_id_ecm))];
            query = query.in('id_evt', eventIds);
        } else {
            // No hay eventos con esas categorías
            return [];
        }
    }

    // Ordenar por fecha de inicio (próximos primero)
    query = query.order('start_at_evt', { ascending: true });

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching events list:', error);
        throw error;
    }

    return data as unknown as EventListRecord[];
}
