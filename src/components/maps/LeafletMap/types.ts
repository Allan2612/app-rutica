/**
 * Tipos para el generador de mapas Leaflet
 */

/**
 * Opciones para generar el mapa
 */
export interface MapOptions {
  draggable?: boolean;
  showCoordinates?: boolean;
  zoom?: number;
  theme?: 'light' | 'dark';
  restrictToCostaRica?: boolean;
  popupText?: string;
}

/**
 * Colores del tema para el mapa
 */
export interface MapThemeColors {
  backgroundColor: string;
  surfaceColor: string;
  surfaceBorder: string;
  surfaceText: string;
  popupBg: string;
  popupTextColor: string;
}

/**
 * URLs de los tiles del mapa
 */
export interface MapTileUrls {
  primary: string;
  details: string | null;
  labels: string | null;
  fallback: string;
}
