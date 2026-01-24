/**
 * Tipos para marcadores del mapa
 */

/**
 * Tipo de marcador en el mapa
 */
export type MarkerType = 'business' | 'attraction' | 'event';

/**
 * Marcador básico para el mapa
 */
export interface MapMarker {
    id: string;
    type: MarkerType;
    name: string;
    latitude: number;
    longitude: number;
}

/**
 * Colores para cada tipo de marcador
 */
export const MARKER_COLORS: Record<MarkerType, string> = {
    business: '#3b82f6',   // Azul
    attraction: '#22c55e', // Verde
    event: '#a855f7',      // Morado
};

/**
 * Color del marcador de usuario
 */
export const USER_MARKER_COLOR = '#ef4444'; // Rojo

/**
 * Área visible del mapa para paginación
 */
export interface MapBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

/**
 * Opciones de paginación para marcadores
 */
export interface MarkerPaginationOptions {
    bounds?: MapBounds;
    limit?: number;
    offset?: number;
}

/**
 * Respuesta paginada de marcadores
 */
export interface MarkerResponse {
    markers: MapMarker[];
    hasMore: boolean;
    total: number;
}
