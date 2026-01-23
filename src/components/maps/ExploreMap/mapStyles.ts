/**
 * Estilos y scripts para el mapa de exploración
 */

interface ThemeColors {
    backgroundColor: string;
    popupBg: string;
    popupText: string;
    popupBorder: string;
}

/**
 * Genera los colores del tema
 */
export function getThemeColors(theme: 'light' | 'dark'): ThemeColors {
    if (theme === 'dark') {
        return {
            backgroundColor: '#0d1117',
            popupBg: '#161b22',
            popupText: '#e6edf3',
            popupBorder: '#30363d',
        };
    }
    return {
        backgroundColor: '#ffffff',
        popupBg: '#ffffff',
        popupText: '#111827',
        popupBorder: '#e5e7eb',
    };
}

/**
 * Genera URL de tiles según tema
 */
export function getTileUrl(theme: 'light' | 'dark'): string {
    return theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
}

/**
 * Genera los estilos CSS del mapa
 */
export function generateMapStyles(colors: ThemeColors, isDark: boolean): string {
    const darkModeStyles = isDark ? `
        .leaflet-tile { filter: brightness(0.9); }
        .leaflet-control-zoom a { 
            background: #21262d !important; 
            color: #c9d1d9 !important; 
            border-color: #30363d !important; 
        }` : '';

    return `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #map { height: 100%; width: 100%; }
        body { background: ${colors.backgroundColor}; }
        .leaflet-popup-content-wrapper {
            background: ${colors.popupBg};
            border: 1px solid ${colors.popupBorder};
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .leaflet-popup-content { 
            color: ${colors.popupText}; 
            margin: 12px 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .leaflet-popup-tip { 
            background: ${colors.popupBg}; 
            border-color: ${colors.popupBorder}; 
        }
        .marker-popup { text-align: center; }
        .marker-popup h3 { 
            font-size: 14px; 
            font-weight: 600; 
            margin-bottom: 8px;
            line-height: 1.3;
        }
        .marker-popup .type-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: 500;
            margin-bottom: 8px;
            color: white;
        }
        .marker-popup a {
            display: inline-block;
            margin-top: 4px;
            padding: 6px 14px;
            background: ${isDark ? '#238636' : '#16a34a'};
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
        }
        ${darkModeStyles}`;
}

/**
 * Genera el script JavaScript del mapa
 */
export function generateMapScript(params: {
    markersJSON: string;
    markerColorsJSON: string;
    userMarkerColor: string;
    userLatitude: number;
    userLongitude: number;
    zoom: number;
    tileUrl: string;
}): string {
    const { markersJSON, markerColorsJSON, userMarkerColor, userLatitude, userLongitude, zoom, tileUrl } = params;

    return `
        const markers = ${markersJSON};
        const MARKER_COLORS = ${markerColorsJSON};
        const USER_COLOR = '${userMarkerColor}';
        const TYPE_LABELS = { business: 'Negocio', attraction: 'Atracción', event: 'Evento' };
        const TYPE_ROUTES = { business: '/businesses', attraction: '/attractions', event: '/events' };

        const map = L.map('map', {
            center: [${userLatitude}, ${userLongitude}],
            zoom: ${zoom},
            zoomControl: true,
            attributionControl: true
        });

        L.tileLayer('${tileUrl}', {
            attribution: '© OpenStreetMap © CartoDB',
            maxZoom: 19
        }).addTo(map);

        function createIcon(color) {
            return L.divIcon({
                className: 'custom-marker',
                html: '<div style="background:' + color + '; width:28px; height:28px; border-radius:50%; border:3px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
                iconSize: [28, 28],
                iconAnchor: [14, 14],
                popupAnchor: [0, -14]
            });
        }

        L.marker([${userLatitude}, ${userLongitude}], {
            icon: createIcon(USER_COLOR)
        }).addTo(map).bindPopup('<div class="marker-popup"><h3>📍 Tu ubicación</h3></div>');

        markers.forEach(function(m) {
            const color = MARKER_COLORS[m.type];
            const label = TYPE_LABELS[m.type];
            const route = TYPE_ROUTES[m.type] + '/' + m.id;
            
            const popupContent = '<div class="marker-popup">' +
                '<span class="type-badge" style="background:' + color + ';">' + label + '</span>' +
                '<h3>' + m.name + '</h3>' +
                '<a href="#" onclick="navigateTo(\\'' + route + '\\'); return false;">Ver más</a>' +
            '</div>';

            L.marker([m.latitude, m.longitude], {
                icon: createIcon(color)
            }).addTo(map).bindPopup(popupContent);
        });

        function navigateTo(route) {
            const message = JSON.stringify({ type: 'navigate', route: route });
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(message);
            } else {
                window.parent.postMessage(message, '*');
            }
        }`;
}
