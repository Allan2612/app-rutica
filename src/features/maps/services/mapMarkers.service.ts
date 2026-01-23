/**
 * Servicio para obtener marcadores del mapa desde la BD
 */
import { supabase } from '@/lib/supabase/client';
import type { MapMarker, MarkerType, MapBounds, MarkerResponse } from '../types';

const DEFAULT_LIMIT = 50;

/**
 * Construye la query base con filtro de bounds
 */
function applyBoundsFilter<T>(
    query: T,
    bounds: MapBounds | undefined,
    latColumn: string,
    lngColumn: string
): T {
    if (!bounds) return query;

    return (query as any)
        .gte(latColumn, bounds.south)
        .lte(latColumn, bounds.north)
        .gte(lngColumn, bounds.west)
        .lte(lngColumn, bounds.east);
}

/**
 * Obtiene negocios aprobados con ubicación
 */
export async function getBusinessMarkers(
    bounds?: MapBounds,
    limit = DEFAULT_LIMIT,
    offset = 0
): Promise<MarkerResponse> {
    let query = supabase
        .from('businesses')
        .select(`
            id_bus,
            name_bus,
            location_id_bus,
            locations:location_id_bus!inner (
                latitude_loc,
                longitude_loc
            )
        `, { count: 'exact' })
        .eq('moderation_status_bus', 'approved')
        .eq('is_active_bus', true)
        .not('location_id_bus', 'is', null);

    const { data, error, count } = await query
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('[getBusinessMarkers] Error:', error);
        return { markers: [], hasMore: false, total: 0 };
    }

    // Filtrar por bounds en el cliente
    let filteredData = (data || []).filter((item: any) =>
        item.locations?.latitude_loc && item.locations?.longitude_loc
    );

    if (bounds) {
        filteredData = filteredData.filter((item: any) => {
            const lat = item.locations.latitude_loc;
            const lng = item.locations.longitude_loc;
            return lat >= bounds.south && lat <= bounds.north &&
                lng >= bounds.west && lng <= bounds.east;
        });
    }

    const markers: MapMarker[] = filteredData.map((item: any) => ({
        id: item.id_bus,
        type: 'business' as MarkerType,
        name: item.name_bus,
        latitude: item.locations.latitude_loc,
        longitude: item.locations.longitude_loc,
    }));

    return {
        markers,
        hasMore: (count || 0) > offset + limit,
        total: count || 0,
    };
}

/**
 * Obtiene atracciones aprobadas con ubicación
 */
export async function getAttractionMarkers(
    bounds?: MapBounds,
    limit = DEFAULT_LIMIT,
    offset = 0
): Promise<MarkerResponse> {
    let query = supabase
        .from('attractions')
        .select(`
            id_atr,
            name_atr,
            location_id_atr,
            locations:location_id_atr!inner (
                latitude_loc,
                longitude_loc
            )
        `, { count: 'exact' })
        .eq('moderation_status_atr', 'approved')
        .eq('is_active_atr', true)
        .not('location_id_atr', 'is', null);

    const { data, error, count } = await query
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('[getAttractionMarkers] Error:', error);
        return { markers: [], hasMore: false, total: 0 };
    }

    // Filtrar por bounds en el cliente ya que el filtro nested puede fallar
    let filteredData = (data || []).filter((item: any) =>
        item.locations?.latitude_loc && item.locations?.longitude_loc
    );

    if (bounds) {
        filteredData = filteredData.filter((item: any) => {
            const lat = item.locations.latitude_loc;
            const lng = item.locations.longitude_loc;
            return lat >= bounds.south && lat <= bounds.north &&
                lng >= bounds.west && lng <= bounds.east;
        });
    }

    const markers: MapMarker[] = filteredData.map((item: any) => ({
        id: item.id_atr,
        type: 'attraction' as MarkerType,
        name: item.name_atr,
        latitude: item.locations.latitude_loc,
        longitude: item.locations.longitude_loc,
    }));

    return {
        markers,
        hasMore: (count || 0) > offset + limit,
        total: count || 0,
    };
}

/**
 * Obtiene eventos aprobados y activos (no pasados) con ubicación
 */
export async function getEventMarkers(
    bounds?: MapBounds,
    limit = DEFAULT_LIMIT,
    offset = 0
): Promise<MarkerResponse> {
    const now = new Date().toISOString();

    let query = supabase
        .from('events')
        .select(`
            id_evt,
            name_evt,
            location_id_evt,
            locations:location_id_evt!inner (
                latitude_loc,
                longitude_loc
            )
        `, { count: 'exact' })
        .eq('moderation_status_evt', 'approved')
        .eq('is_active_evt', true)
        .gte('end_at_evt', now) // Solo eventos que no han terminado
        .not('location_id_evt', 'is', null);

    const { data, error, count } = await query
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('[getEventMarkers] Error:', error);
        return { markers: [], hasMore: false, total: 0 };
    }

    // Filtrar por bounds en el cliente ya que el filtro nested puede fallar
    let filteredData = (data || []).filter((item: any) =>
        item.locations?.latitude_loc && item.locations?.longitude_loc
    );

    if (bounds) {
        filteredData = filteredData.filter((item: any) => {
            const lat = item.locations.latitude_loc;
            const lng = item.locations.longitude_loc;
            return lat >= bounds.south && lat <= bounds.north &&
                lng >= bounds.west && lng <= bounds.east;
        });
    }

    const markers: MapMarker[] = filteredData.map((item: any) => ({
        id: item.id_evt,
        type: 'event' as MarkerType,
        name: item.name_evt,
        latitude: item.locations.latitude_loc,
        longitude: item.locations.longitude_loc,
    }));

    return {
        markers,
        hasMore: (count || 0) > offset + limit,
        total: count || 0,
    };
}

/**
 * Obtiene todos los marcadores (negocios, atracciones, eventos)
 */
export async function getAllMarkers(
    bounds?: MapBounds,
    limitPerType = DEFAULT_LIMIT
): Promise<{
    businesses: MarkerResponse;
    attractions: MarkerResponse;
    events: MarkerResponse;
    all: MapMarker[];
}> {
    const [businesses, attractions, events] = await Promise.all([
        getBusinessMarkers(bounds, limitPerType),
        getAttractionMarkers(bounds, limitPerType),
        getEventMarkers(bounds, limitPerType),
    ]);

    return {
        businesses,
        attractions,
        events,
        all: [...businesses.markers, ...attractions.markers, ...events.markers],
    };
}
