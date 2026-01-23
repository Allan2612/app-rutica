/**
 * Feature: Maps
 * Exportaciones centralizadas del módulo de mapas
 */

// Hooks
export { useMapLocation, useUserLocation, useMapMarkers, useMarkersByType } from './hooks';

// Types
export type {
    MapMarker,
    MarkerType,
    MapBounds,
    MarkerResponse,
    MarkerPaginationOptions
} from './types';
export { MARKER_COLORS, USER_MARKER_COLOR } from './types';

// Services
export {
    generateMapHTML,
    getBusinessMarkers,
    getAttractionMarkers,
    getEventMarkers,
    getAllMarkers
} from './services';
