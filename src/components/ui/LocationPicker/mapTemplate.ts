/**
 * Opciones para generar el mapa
 */
export interface MapOptions {
  draggable?: boolean;
  showCoordinates?: boolean;
  zoom?: number;
  theme?: 'light' | 'dark';
}

/**
 * Genera el HTML para el mapa interactivo Leaflet
 */
export function generateMapHTML(
  latitude: number,
  longitude: number,
  options: MapOptions = {}
): string {
  const {
    draggable = true,
    showCoordinates = true,
    zoom = 15,
    theme = 'light',
  } = options;

  // Carto: usar base sin labels + overlay de labels en modo dark para mejorar legibilidad
  const primaryTileLayerUrl =
    theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const detailsTileLayerUrl =
    theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : null;

  const labelsTileLayerUrl =
    theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png'
      : null;

  const fallbackTileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const primaryAttribution = '© OpenStreetMap contributors | © CartoDB';
  const fallbackAttribution = '© OpenStreetMap contributors';
  
  const backgroundColor = theme === 'dark' ? '#0d1117' : '#ffffff';
  const surfaceColor = theme === 'dark' ? 'rgba(13,17,23,0.92)' : '#ffffff';
  const surfaceBorder = theme === 'dark' ? '#30363d' : '#e5e7eb';
  const surfaceText = theme === 'dark' ? '#e6edf3' : '#111827';
  const popupBg = theme === 'dark' ? '#161b22' : '#ffffff';
  const popupText = theme === 'dark' ? '#e6edf3' : '#111827';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: ${backgroundColor}; }
    #map { width: 100%; height: 100%; background: ${backgroundColor}; }
    .leaflet-container { background: ${backgroundColor}; }
    ${theme === 'dark' ? `

    /* Controles (zoom) y atribución en modo oscuro */
    .leaflet-bar {
      box-shadow: none;
      border: 1px solid ${surfaceBorder};
      border-radius: 8px;
      overflow: hidden;
    }
    .leaflet-bar a,
    .leaflet-control-zoom a {
      background: ${popupBg};
      color: ${surfaceText};
      border-bottom: 1px solid ${surfaceBorder};
    }
    .leaflet-bar a:last-child,
    .leaflet-control-zoom a:last-child {
      border-bottom: 0;
    }
    .leaflet-bar a:hover,
    .leaflet-control-zoom a:hover {
      background: ${surfaceColor};
      color: ${surfaceText};
    }
    .leaflet-bar a:active,
    .leaflet-control-zoom a:active {
      background: ${popupBg};
    }

    .leaflet-control-attribution {
      background: ${surfaceColor} !important;
      border: 1px solid ${surfaceBorder} !important;
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
      color: ${surfaceText} !important;
    }
    .leaflet-control-attribution a {
      color: ${surfaceText} !important;
      text-decoration: underline !important;
      text-decoration-color: ${surfaceBorder} !important;
      text-underline-offset: 2px;
    }
    /* Aumentar contraste del layer base (sin afectar labels) */
    .leaflet-pane.leaflet-tile-pane img {
      filter: contrast(1.07) brightness(5) saturate(1.05);
    }
    ` : ''}
    .leaflet-popup-content-wrapper, .leaflet-popup-tip { background: ${popupBg}; color: ${popupText}; }
    .leaflet-popup-content { color: ${popupText}; }
    .leaflet-control-container .leaflet-top, .leaflet-control-container .leaflet-bottom { color: ${surfaceText}; }
    ${showCoordinates ? `
    .coordinates-display {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: ${surfaceColor};
      color: ${surfaceText};
      border: 1px solid ${surfaceBorder};
      padding: 8px 12px;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      font-size: 12px;
      font-family: system-ui, -apple-system;
      z-index: 1000;
    }
    ` : ''}
  </style>
</head>
<body>
  <div id="map"></div>
  ${showCoordinates ? `
  <div class="coordinates-display">
    <div><b>Lat:</b> <span id="lat">${latitude.toFixed(6)}</span></div>
    <div><b>Lng:</b> <span id="lng">${longitude.toFixed(6)}</span></div>
  </div>
  ` : ''}

  <script>
    // Inicializar mapa
    const map = L.map('map').setView([${latitude}, ${longitude}], ${zoom});

    // Agregar tiles (con fallback si el proveedor falla)
    const primaryAttribution = ${JSON.stringify(primaryAttribution)};
    const fallbackAttribution = ${JSON.stringify(fallbackAttribution)};

    const baseLayer = L.tileLayer('${primaryTileLayerUrl}', {
      attribution: primaryAttribution,
      maxZoom: 19
    }).addTo(map);

    // Pane para detalles (calles) encima del mapa (no bloquea interacción)
    const detailsUrl = ${JSON.stringify(detailsTileLayerUrl)};
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

    // Pane para labels encima del mapa (no bloquea interacción)
    const labelsUrl = ${JSON.stringify(labelsTileLayerUrl)};
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
    }

    let switchedToFallback = false;
    function switchToFallback() {
      if (switchedToFallback) return;
      switchedToFallback = true;

      try {
        if (detailsLayer) {
          map.removeLayer(detailsLayer);
        }
        if (labelsLayer) {
          map.removeLayer(labelsLayer);
        }
      } catch (e) {}

      try {
        if (map.attributionControl && map.attributionControl.removeAttribution) {
          map.attributionControl.removeAttribution(primaryAttribution);
        }
      } catch (e) {}

      try {
        baseLayer.setUrl('${fallbackTileLayerUrl}');
        if (map.attributionControl && map.attributionControl.addAttribution) {
          map.attributionControl.addAttribution(fallbackAttribution);
        }
      } catch (e) {}
    }

    baseLayer.on('tileerror', switchToFallback);
    if (detailsLayer) {
      detailsLayer.on('tileerror', switchToFallback);
    }
    if (labelsLayer) {
      labelsLayer.on('tileerror', switchToFallback);
    }

    // Crear marcador ${draggable ? 'ARRASTRABLE (draggable)' : ''}
    const marker = L.marker([${latitude}, ${longitude}], {
      draggable: ${draggable},
      autoPan: ${draggable}
    }).addTo(map);

    ${draggable ? `
    // Actualizar coordenadas cuando se mueve el marcador
    function updateCoordinates(lat, lng) {
      ${showCoordinates ? `
      document.getElementById('lat').textContent = lat.toFixed(6);
      document.getElementById('lng').textContent = lng.toFixed(6);
      ` : ''}
      
      // Enviar coordenadas a React Native (WebView) o al padre (iframe en web)
      const message = JSON.stringify({
        latitude: lat,
        longitude: lng
      });
      
      if (window.ReactNativeWebView) {
        // Mobile: usar postMessage de WebView
        window.ReactNativeWebView.postMessage(message);
      } else {
        // Web: usar postMessage del iframe
        window.parent.postMessage(message, '*');
      }
    }

    // Evento cuando se arrastra el marcador
    marker.on('dragend', function(e) {
      const position = marker.getLatLng();
      updateCoordinates(position.lat, position.lng);
    });

    // Evento cuando se hace clic en el mapa (mover el marcador)
    map.on('click', function(e) {
      marker.setLatLng(e.latlng);
      updateCoordinates(e.latlng.lat, e.latlng.lng);
    });

    // Agregar popup al marcador
    marker.bindPopup("<b>Ubicación del negocio</b><br>Arrastra este pin para cambiar").openPopup();
    ` : `
    // Marcador estático
    marker.bindPopup("<b>Tu ubicación</b><br>Estás aquí").openPopup();
    
    // Agregar círculo de precisión (50m por defecto)
    const circle = L.circle([${latitude}, ${longitude}], {
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 0.2,
      radius: 50
    }).addTo(map);
    `}
  </script>
</body>
</html>
`;
}
