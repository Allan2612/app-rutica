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

// Atribuciones
export const PRIMARY_ATTRIBUTION = '© OpenStreetMap contributors | © CartoDB';
export const FALLBACK_ATTRIBUTION = '© OpenStreetMap contributors';

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
export function getMapTileUrls(theme: 'light' | 'dark'): MapTileUrls {
    const isDark = theme === 'dark';

    return {
        primary: isDark
            ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        details: isDark
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : null,
        labels: isDark
            ? 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png'
            : null,
        fallback: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    };
}
