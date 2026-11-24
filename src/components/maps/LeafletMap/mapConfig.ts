/**
 * Configuración y constantes para mapas Leaflet
 */
import type { MapThemeColors, MapTileUrls } from './types';

// Límites geográficos de Costa Rica
export const COSTA_RICA_BOUNDS = {
  north: 11.22,
  south: 8.03,
  east: -82.55,
  west: -85.95,
};

// Teselas de Esri World Street Map: sin clave y sin exigir Referer.
// - CARTO empezó a exigir API key en 2026 (devolvía "API KEY REQUIRED" con estado 200).
// - Los servidores de OpenStreetMap exigen Referer, y el mapa corre en un iframe aislado
//   (sandbox sin allow-same-origin, contra XSS) que no lo manda: respondían 403 "Access blocked".
// Esri permite uso no comercial con atribución; si Rutica pasa a vender, revisar sus términos
// (ArcGIS Location Platform tiene capa gratuita) o pasar a un proveedor con clave.
// El modo oscuro se logra con un filtro CSS sobre las teselas (DARK_TILE_FILTER).
export const OSM_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
export const DARK_TILE_FILTER = 'invert(1) hue-rotate(180deg) brightness(0.95) contrast(0.9)';

// Atribuciones
export const PRIMARY_ATTRIBUTION =
  'Tiles © <a href="https://www.esri.com/" target="_blank" rel="noopener">Esri</a> — Esri, HERE, Garmin, © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';
export const FALLBACK_ATTRIBUTION = PRIMARY_ATTRIBUTION;

/**
 * Obtiene los colores del tema para el mapa
 */
export function getMapThemeColors(theme: 'light' | 'dark'): MapThemeColors {
  if (theme === 'dark') {
    return {
      backgroundColor: '#0d1117',
      surfaceColor: 'rgba(13,17,23,0.92)',
      surfaceBorder: '#30363d',
      surfaceText: '#e6edf3',
      popupBg: '#161b22',
      popupTextColor: '#e6edf3',
    };
  }
  return {
    backgroundColor: '#ffffff',
    surfaceColor: '#ffffff',
    surfaceBorder: '#e5e7eb',
    surfaceText: '#111827',
    popupBg: '#ffffff',
    popupTextColor: '#111827',
  };
}

/**
 * Obtiene las URLs de los tiles según el tema
 */
export function getMapTileUrls(_theme: 'light' | 'dark'): MapTileUrls {
  return { primary: OSM_TILE_URL, details: null, labels: null, fallback: OSM_TILE_URL };
}
