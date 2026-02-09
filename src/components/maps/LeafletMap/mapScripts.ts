/**
 * Genera los scripts JavaScript para el mapa Leaflet
 */
import { COSTA_RICA_BOUNDS, PRIMARY_ATTRIBUTION, FALLBACK_ATTRIBUTION } from './mapConfig';
import type { MapTileUrls } from './types';

interface ScriptOptions {
  latitude: number;
  longitude: number;
  zoom: number;
  draggable: boolean;
  showCoordinates: boolean;
  restrictToCostaRica: boolean;
  popupText?: string;
  tileUrls: MapTileUrls;
}

/**
 * Genera el script de inicialización del mapa
 */
export function generateMapInitScript(opts: ScriptOptions): string {
  const { latitude, longitude, zoom, restrictToCostaRica, tileUrls } = opts;

  return `
    const costaRicaBounds = ${
      restrictToCostaRica
        ? `[
        [${COSTA_RICA_BOUNDS.south}, ${COSTA_RICA_BOUNDS.west}],
        [${COSTA_RICA_BOUNDS.north}, ${COSTA_RICA_BOUNDS.east}]
    ]`
        : 'null'
    };

    const mapOptions = {
        maxBounds: costaRicaBounds,
        maxBoundsViscosity: 1.0,
        minZoom: ${restrictToCostaRica ? '8' : '3'},
    };
    
    const map = L.map('map', mapOptions).setView([${latitude}, ${longitude}], ${zoom});

    const primaryAttribution = ${JSON.stringify(PRIMARY_ATTRIBUTION)};
    const fallbackAttribution = ${JSON.stringify(FALLBACK_ATTRIBUTION)};

    const baseLayer = L.tileLayer('${tileUrls.primary}', {
        attribution: primaryAttribution,
        maxZoom: 19
    }).addTo(map);`;
}

/**
 * Genera el script para capas adicionales (detalles y labels)
 */
export function generateLayersScript(tileUrls: MapTileUrls): string {
  return `
    const detailsUrl = ${JSON.stringify(tileUrls.details)};
    let detailsLayer = null;
    if (detailsUrl) {
        map.createPane('details');
        map.getPane('details').style.zIndex = 640;
        map.getPane('details').style.pointerEvents = 'none';
        detailsLayer = L.tileLayer(detailsUrl, {
            pane: 'details',
            attribution: primaryAttribution,
            maxZoom: 19,
            opacity: 0.35
        }).addTo(map);
    }

    const labelsUrl = ${JSON.stringify(tileUrls.labels)};
    let labelsLayer = null;
    if (labelsUrl) {
        map.createPane('labels');
        map.getPane('labels').style.zIndex = 650;
        map.getPane('labels').style.pointerEvents = 'none';
        labelsLayer = L.tileLayer(labelsUrl, {
            pane: 'labels',
            attribution: primaryAttribution,
            maxZoom: 19,
            opacity: 1
        }).addTo(map);
    }`;
}

/**
 * Genera el script de fallback para tiles
 */
export function generateFallbackScript(fallbackUrl: string): string {
  return `
    let switchedToFallback = false;
    function switchToFallback() {
        if (switchedToFallback) return;
        switchedToFallback = true;
        try { if (detailsLayer) map.removeLayer(detailsLayer); } catch (e) {}
        try { if (labelsLayer) map.removeLayer(labelsLayer); } catch (e) {}
        try { 
            if (map.attributionControl?.removeAttribution) {
                map.attributionControl.removeAttribution(primaryAttribution);
            }
        } catch (e) {}
        try {
            baseLayer.setUrl('${fallbackUrl}');
            if (map.attributionControl?.addAttribution) {
                map.attributionControl.addAttribution(fallbackAttribution);
            }
        } catch (e) {}
    }
    baseLayer.on('tileerror', switchToFallback);
    if (detailsLayer) detailsLayer.on('tileerror', switchToFallback);
    if (labelsLayer) labelsLayer.on('tileerror', switchToFallback);`;
}
