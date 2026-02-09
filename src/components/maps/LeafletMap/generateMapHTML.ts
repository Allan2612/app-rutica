/**
 * Genera el HTML completo para el mapa interactivo Leaflet
 */
import type { MapOptions } from './types';
import { getMapThemeColors, getMapTileUrls } from './mapConfig';
import { generateBaseStyles, generateDarkModeStyles, generateCoordinatesStyles } from './mapStyles';
import { generateMapInitScript, generateLayersScript, generateFallbackScript } from './mapScripts';
import { generateDraggableMarkerScript, generateStaticMarkerScript } from './markerScripts';

/**
 * Genera el HTML para el mapa interactivo Leaflet
 */
export function generateMapHTML(
  latitude: number,
  longitude: number,
  options: MapOptions = {},
): string {
  const {
    draggable = true,
    showCoordinates = true,
    zoom = 15,
    theme = 'light',
    restrictToCostaRica = true,
    popupText,
  } = options;

  const colors = getMapThemeColors(theme);
  const tileUrls = getMapTileUrls(theme);
  const isDark = theme === 'dark';

  // Generar estilos CSS
  const baseStyles = generateBaseStyles(colors);
  const darkStyles = isDark ? generateDarkModeStyles(colors) : '';
  const coordStyles = showCoordinates ? generateCoordinatesStyles(colors) : '';

  // Opciones para scripts
  const scriptOpts = {
    latitude,
    longitude,
    zoom,
    draggable,
    showCoordinates,
    restrictToCostaRica,
    popupText,
    tileUrls,
  };

  // Generar scripts
  const initScript = generateMapInitScript(scriptOpts);
  const layersScript = generateLayersScript(tileUrls);
  const fallbackScript = generateFallbackScript(tileUrls.fallback);
  const markerScript = draggable
    ? generateDraggableMarkerScript(scriptOpts)
    : generateStaticMarkerScript(scriptOpts);

  // Generar HTML de coordenadas
  const coordsHTML = showCoordinates
    ? `
    <div class="coordinates-display">
        <div><b>Lat:</b> <span id="lat">${latitude.toFixed(6)}</span></div>
        <div><b>Lng:</b> <span id="lng">${longitude.toFixed(6)}</span></div>
    </div>`
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>${baseStyles}${darkStyles}${coordStyles}</style>
</head>
<body>
    <div id="map"></div>
    ${coordsHTML}
    <script>
        ${initScript}
        ${layersScript}
        ${fallbackScript}
        ${markerScript}
    </script>
</body>
</html>`;
}
