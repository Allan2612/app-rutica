/**
 * Componentes de Mapas
 * 
 * Esta carpeta centraliza todos los componentes relacionados con mapas:
 * - LocationPicker: Selector de ubicación interactivo
 * - MapBackground: Fondo animado con rutas de mapa
 * - LeafletMap: Generador de HTML para mapas Leaflet
 * - ExploreMap: Mapa de exploración con múltiples marcadores
 */

// LocationPicker - Selector de ubicación
export { LocationPicker, type LocationData, type LocationPickerProps } from './LocationPicker';
export { useReverseGeocode } from './LocationPicker';

// MapBackground - Fondo animado
export { MapBackground } from './MapBackground';

// LeafletMap - Generador de mapas
export { generateMapHTML } from './LeafletMap';
export type { MapOptions } from './LeafletMap';

// ExploreMap - Mapa de exploración
export { generateExploreMapHTML, type ExploreMapOptions } from './ExploreMap';

// MapFilterChips - Filtros de categorías
export { MapFilterChips, type MarkerFilter } from './MapFilterChips';
