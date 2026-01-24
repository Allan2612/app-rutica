/**
 * Genera los estilos CSS para el mapa Leaflet
 */
import type { MapThemeColors } from './types';

/**
 * Genera CSS base del mapa
 */
export function generateBaseStyles(colors: MapThemeColors): string {
    return `
    body, html { 
        margin: 0; 
        padding: 0; 
        height: 100%; 
        overflow: hidden; 
        background: ${colors.backgroundColor}; 
    }
    #map { 
        width: 100%; 
        height: 100%; 
        background: ${colors.backgroundColor}; 
    }
    .leaflet-container { 
        background: ${colors.backgroundColor}; 
    }
    .leaflet-popup-content-wrapper, 
    .leaflet-popup-tip { 
        background: ${colors.popupBg}; 
        color: ${colors.popupTextColor}; 
    }
    .leaflet-popup-content { 
        color: ${colors.popupTextColor}; 
    }
    .leaflet-control-container .leaflet-top, 
    .leaflet-control-container .leaflet-bottom { 
        color: ${colors.surfaceText}; 
    }`;
}

/**
 * Genera CSS para modo oscuro
 */
export function generateDarkModeStyles(colors: MapThemeColors): string {
    return `
    .leaflet-bar {
        box-shadow: none;
        border: 1px solid ${colors.surfaceBorder};
        border-radius: 8px;
        overflow: hidden;
    }
    .leaflet-bar a,
    .leaflet-control-zoom a {
        background: ${colors.popupBg};
        color: ${colors.surfaceText};
        border-bottom: 1px solid ${colors.surfaceBorder};
    }
    .leaflet-bar a:last-child,
    .leaflet-control-zoom a:last-child {
        border-bottom: 0;
    }
    .leaflet-bar a:hover,
    .leaflet-control-zoom a:hover {
        background: ${colors.surfaceColor};
        color: ${colors.surfaceText};
    }
    .leaflet-bar a:active,
    .leaflet-control-zoom a:active {
        background: ${colors.popupBg};
    }
    .leaflet-control-attribution {
        background: ${colors.surfaceColor} !important;
        border: 1px solid ${colors.surfaceBorder} !important;
        border-radius: 10px !important;
        padding: 4px 8px !important;
        margin: 0 8px 8px 0 !important;
        box-shadow: 0 6px 18px rgba(0,0,0,0.35) !important;
        -webkit-backdrop-filter: blur(6px);
        backdrop-filter: blur(6px);
        font-size: 12px !important;
        line-height: 16px !important;
        max-width: calc(100% - 16px);
    }
    .leaflet-control-attribution,
    .leaflet-control-attribution * {
        color: ${colors.surfaceText} !important;
    }
    .leaflet-control-attribution a {
        color: ${colors.surfaceText} !important;
        text-decoration: underline !important;
        text-decoration-color: ${colors.surfaceBorder} !important;
        text-underline-offset: 2px;
    }
    .leaflet-pane.leaflet-tile-pane img {
        filter: contrast(1.07) brightness(5) saturate(1.05);
    }`;
}

/**
 * Genera CSS para el display de coordenadas
 */
export function generateCoordinatesStyles(colors: MapThemeColors): string {
    return `
    .coordinates-display {
        position: absolute;
        bottom: 10px;
        left: 10px;
        background: ${colors.surfaceColor};
        color: ${colors.surfaceText};
        border: 1px solid ${colors.surfaceBorder};
        padding: 8px 12px;
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        font-size: 12px;
        font-family: system-ui, -apple-system;
        z-index: 1000;
    }`;
}
