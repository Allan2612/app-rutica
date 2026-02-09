/**
 * Scripts para marcadores Leaflet (draggable y estático)
 */
import { COSTA_RICA_BOUNDS } from './mapConfig';

interface MarkerScriptOptions {
  latitude: number;
  longitude: number;
  showCoordinates: boolean;
  restrictToCostaRica: boolean;
  popupText?: string;
}

/**
 * Genera el script del marcador draggable
 */
export function generateDraggableMarkerScript(opts: MarkerScriptOptions): string {
  const { latitude, longitude, showCoordinates, restrictToCostaRica } = opts;

  const validationFn = restrictToCostaRica
    ? `
    function isWithinCostaRica(lat, lng) {
        return lat >= ${COSTA_RICA_BOUNDS.south} && 
               lat <= ${COSTA_RICA_BOUNDS.north} && 
               lng >= ${COSTA_RICA_BOUNDS.west} && 
               lng <= ${COSTA_RICA_BOUNDS.east};
    }`
    : 'function isWithinCostaRica() { return true; }';

  const validationCheck = restrictToCostaRica
    ? `
        if (!isWithinCostaRica(lat, lng)) {
            const errorMessage = 'La ubicación debe estar dentro de Costa Rica';
            marker.bindPopup('<b style="color: #dc2626;">⚠️ Ubicación no válida</b><br>' + errorMessage).openPopup();
            const errorMsg = JSON.stringify({ error: errorMessage, latitude: lat, longitude: lng });
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(errorMsg);
            } else {
                window.parent.postMessage(errorMsg, '*');
            }
            return;
        }`
    : '';

  const coordsUpdate = showCoordinates
    ? `
        document.getElementById('lat').textContent = lat.toFixed(6);
        document.getElementById('lng').textContent = lng.toFixed(6);`
    : '';

  return `
    const marker = L.marker([${latitude}, ${longitude}], { draggable: true, autoPan: true }).addTo(map);
    ${validationFn}
    function updateCoordinates(lat, lng) {
        ${validationCheck}
        ${coordsUpdate}
        const message = JSON.stringify({ latitude: lat, longitude: lng });
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(message);
        } else {
            window.parent.postMessage(message, '*');
        }
    }
    marker.on('dragend', function(e) {
        const position = marker.getLatLng();
        updateCoordinates(position.lat, position.lng);
    });
    map.on('click', function(e) {
        marker.setLatLng(e.latlng);
        updateCoordinates(e.latlng.lat, e.latlng.lng);
    });
    marker.bindPopup("<b>Ubicación del negocio</b><br>Arrastra este pin para cambiar").openPopup();`;
}

/**
 * Genera el script del marcador estático
 */
export function generateStaticMarkerScript(opts: MarkerScriptOptions): string {
  const { latitude, longitude, popupText } = opts;
  const popup = popupText || '<b>Tu ubicación</b><br>Estás aquí';

  return `
    const marker = L.marker([${latitude}, ${longitude}], { draggable: false }).addTo(map);
    marker.bindPopup(${JSON.stringify(popup)}).openPopup();
    L.circle([${latitude}, ${longitude}], {
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.2,
        radius: 50
    }).addTo(map);`;
}
