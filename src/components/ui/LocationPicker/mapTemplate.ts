/**
 * Genera el HTML para el mapa interactivo Leaflet
 */
export function generateMapHTML(latitude: number, longitude: number): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
    #map { width: 100%; height: 100%; }
    .coordinates-display {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: white;
      padding: 8px 12px;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      font-size: 12px;
      font-family: system-ui, -apple-system;
      z-index: 1000;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <div class="coordinates-display">
    <div><b>Lat:</b> <span id="lat">${latitude.toFixed(6)}</span></div>
    <div><b>Lng:</b> <span id="lng">${longitude.toFixed(6)}</span></div>
  </div>

  <script>
    // Inicializar mapa
    const map = L.map('map').setView([${latitude}, ${longitude}], 15);

    // Agregar tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Crear marcador ARRASTRABLE (draggable)
    const marker = L.marker([${latitude}, ${longitude}], {
      draggable: true,
      autoPan: true
    }).addTo(map);

    // Actualizar coordenadas cuando se mueve el marcador
    function updateCoordinates(lat, lng) {
      document.getElementById('lat').textContent = lat.toFixed(6);
      document.getElementById('lng').textContent = lng.toFixed(6);
      
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
  </script>
</body>
</html>
`;
}
