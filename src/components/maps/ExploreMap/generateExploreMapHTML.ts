/**
 * Generador de HTML para el mapa con múltiples marcadores
 */
import type { MapMarker, MarkerType } from '@/features/maps/types';
import { MARKER_COLORS, USER_MARKER_COLOR } from '@/features/maps/types';
import { getThemeColors, getTileUrl, generateMapStyles, generateMapScript } from './mapStyles';

export interface ExploreMapOptions {
  theme?: 'light' | 'dark';
  zoom?: number;
  userLatitude: number;
  userLongitude: number;
  markers: MapMarker[];
  showUserMarker?: boolean;
  initialSelectedTypes?: MarkerType[];
}

/**
 * Genera el HTML del mapa de exploración con marcadores
 */
export function generateExploreMapHTML(options: ExploreMapOptions): string {
  const {
    theme = 'light',
    zoom = 13,
    userLatitude,
    userLongitude,
    markers,
    showUserMarker = true,
    initialSelectedTypes = ['attraction', 'event', 'business'],
  } = options;

  const colors = getThemeColors(theme);
  const tileUrl = getTileUrl(theme);
  const isDark = theme === 'dark';

  const markersJSON = JSON.stringify(markers);
  const markerColorsJSON = JSON.stringify(MARKER_COLORS);

  const styles = generateMapStyles(colors, isDark);
  const script = generateMapScript({
    markersJSON,
    markerColorsJSON,
    userMarkerColor: USER_MARKER_COLOR,
    userLatitude,
    userLongitude,
    zoom,
    tileUrl,
    showUserMarker,
    initialSelectedTypes,
  });

  return `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>${styles}</style>
</head>
<body>
    <div id="map"></div>
    <script>${script}</script>
</body>
</html>`;
}
