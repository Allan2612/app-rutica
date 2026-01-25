/**
 * Estilos y scripts para el mapa de exploración
 */
import type { MarkerType } from '@/features/maps/types';

export interface ThemeColors {
    backgroundColor: string;
    surfaceColor: string;
    surfaceBorder: string;
    surfaceText: string;
    popupBg: string;
    popupTextColor: string;
}

export interface TileUrls {
    primary: string;
    details: string | null;
    labels: string | null;
    fallback: string;
    attribution: string;
}

/**
 * Obtiene los colores del tema
 */
export function getThemeColors(theme: 'light' | 'dark'): ThemeColors {
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
        surfaceColor: 'rgba(255,255,255,0.95)',
        surfaceBorder: '#e5e7eb',
        surfaceText: '#111827',
        popupBg: '#ffffff',
        popupTextColor: '#111827',
    };
}

/**
 * Obtiene las URLs de los tiles según el tema
 * Usa la misma configuración que BusinessMap para consistencia
 */
export function getTileUrl(theme: 'light' | 'dark'): TileUrls {
    const isDark = theme === 'dark';
    const attribution = '© OpenStreetMap contributors | © CartoDB';

    if (isDark) {
        return {
            primary: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
            details: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            labels: 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
            fallback: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution,
        };
    }

    return {
        primary: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        details: null,
        labels: null,
        fallback: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution,
    };
}

/**
 * Genera los estilos CSS del mapa
 */
export function generateMapStyles(colors: ThemeColors, isDark: boolean): string {
    const baseStyles = `
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
            margin: 10px 12px;
        }
    `;

    const controlStyles = `
        .leaflet-bar {
            box-shadow: 0 2px 8px rgba(0,0,0,${isDark ? '0.4' : '0.15'});
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
    `;

    const attributionStyles = `
        .leaflet-control-attribution {
            background: ${colors.surfaceColor} !important;
            border: 1px solid ${colors.surfaceBorder} !important;
            border-radius: 10px !important;
            padding: 4px 8px !important;
            margin: 0 8px 8px 0 !important;
            box-shadow: 0 4px 12px rgba(0,0,0,${isDark ? '0.35' : '0.1'}) !important;
            -webkit-backdrop-filter: blur(6px);
            backdrop-filter: blur(6px);
            font-size: 11px !important;
            line-height: 14px !important;
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
    `;

    const popupStyles = `
        .leaflet-popup-content-wrapper {
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .marker-popup { 
            text-align: center; 
        }
        .marker-popup h3 { 
            font-size: 14px; 
            font-weight: 600; 
            margin: 8px 0;
            line-height: 1.3;
            color: ${colors.popupTextColor};
        }
        .marker-popup .type-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: 500;
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
        .marker-popup a:hover {
            opacity: 0.9;
        }
    `;

    // Filtro para mejorar contraste en modo oscuro (igual que BusinessMap)
    const tileFilter = isDark
        ? `.leaflet-pane.leaflet-tile-pane img {
            filter: contrast(1.07) brightness(5) saturate(1.05);
        }`
        : '';

    return baseStyles + controlStyles + attributionStyles + popupStyles + tileFilter;
}

export interface MapScriptOptions {
    markersJSON: string;
    markerColorsJSON: string;
    userMarkerColor: string;
    userLatitude: number;
    userLongitude: number;
    zoom: number;
    tileUrl: TileUrls;
    showUserMarker: boolean;
    initialSelectedTypes: MarkerType[];
}

/**
 * Genera el script del mapa
 */
export function generateMapScript(options: MapScriptOptions): string {
    const {
        markersJSON,
        markerColorsJSON,
        userMarkerColor,
        userLatitude,
        userLongitude,
        zoom,
        tileUrl,
        showUserMarker,
        initialSelectedTypes,
    } = options;

    const initialTypesJSON = JSON.stringify(initialSelectedTypes);

    return `
        (function() {
            var markers = ${markersJSON};
            var MARKER_COLORS = ${markerColorsJSON};
            var USER_MARKER_COLOR = '${userMarkerColor}';
            var userLat = ${userLatitude};
            var userLng = ${userLongitude};
            
            var map = L.map('map', {
                zoomControl: true,
                attributionControl: true
            }).setView([userLat, userLng], ${zoom});

            // Capa principal de tiles
            var primaryLayer = L.tileLayer('${tileUrl.primary}', {
                attribution: '${tileUrl.attribution}',
                maxZoom: 19,
                subdomains: 'abcd'
            }).addTo(map);

            ${tileUrl.details
            ? `
            // Crear pane para capa de detalles
            map.createPane('details');
            map.getPane('details').style.zIndex = 640;
            map.getPane('details').style.pointerEvents = 'none';
            
            // Capa de detalles (modo oscuro)
            var detailsLayer = L.tileLayer('${tileUrl.details}', {
                pane: 'details',
                maxZoom: 19,
                subdomains: 'abcd',
                opacity: 0.35
            }).addTo(map);
            `
            : ''
        }

            ${tileUrl.labels
            ? `
            // Crear pane para capa de etiquetas
            map.createPane('labels');
            map.getPane('labels').style.zIndex = 650;
            map.getPane('labels').style.pointerEvents = 'none';
            
            // Capa de etiquetas (modo oscuro)
            var labelsLayer = L.tileLayer('${tileUrl.labels}', {
                pane: 'labels',
                maxZoom: 19,
                subdomains: 'abcd',
                opacity: 1
            }).addTo(map);
            `
            : ''
        }

            // Crear icono de marcador (mismo tamaño que el marcador del usuario)
            function createMarkerIcon(color) {
                return L.divIcon({
                    className: 'custom-marker',
                    html: '<div style="' +
                        'width: 16px; height: 16px; ' +
                        'background: ' + color + '; ' +
                        'border: 3px solid white; ' +
                        'border-radius: 50%; ' +
                        'box-shadow: 0 2px 6px rgba(0,0,0,0.35);' +
                    '"></div>',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    popupAnchor: [0, -12]
                });
            }

            // Crear icono del usuario
            function createUserIcon() {
                return L.divIcon({
                    className: 'user-marker',
                    html: '<div style="' +
                        'width: 16px; height: 16px; ' +
                        'background: ' + USER_MARKER_COLOR + '; ' +
                        'border: 3px solid white; ' +
                        'border-radius: 50%; ' +
                        'box-shadow: 0 0 0 4px rgba(239,68,68,0.25), 0 2px 6px rgba(0,0,0,0.35);' +
                    '"></div>',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    popupAnchor: [0, -12]
                });
            }

            // Layers para cada tipo de marcador
            var markerLayers = {
                attraction: L.layerGroup(),
                event: L.layerGroup(),
                business: L.layerGroup()
            };

            var TYPE_LABELS = { business: 'Negocio', attraction: 'Atracción', event: 'Evento' };
            var TYPE_ROUTES = { business: '/businesses', attraction: '/attractions', event: '/events' };

            // Layer para marcador del usuario
            var userMarkerLayer = L.layerGroup();
            var userMarker = L.marker([userLat, userLng], { icon: createUserIcon() })
                .bindPopup('<b>Mi ubicación</b>');
            userMarker.addTo(userMarkerLayer);

            // Estado de visibilidad
            var selectedTypes = ${initialTypesJSON};
            var showUser = ${showUserMarker};

            // Añadir marcador del usuario si está habilitado
            if (showUser) {
                userMarkerLayer.addTo(map);
            }

            // Función para navegar a detalles
            function navigateTo(route) {
                var message = JSON.stringify({ type: 'navigate', route: route });
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(message);
                } else {
                    window.parent.postMessage(message, '*');
                }
            }

            // Hacer navigateTo global para onclick
            window.navigateTo = navigateTo;

            // Añadir marcadores a sus capas
            markers.forEach(function(m) {
                var color = MARKER_COLORS[m.type] || '#6b7280';
                var icon = createMarkerIcon(color);
                var label = TYPE_LABELS[m.type] || m.type;
                var route = TYPE_ROUTES[m.type] + '/' + m.id + '?from=maps';
                
                var popupContent = '<div class="marker-popup">' +
                    '<span class="type-badge" style="background:' + color + ';">' + label + '</span>' +
                    '<h3>' + m.name + '</h3>' +
                    '<a href="#" onclick="navigateTo(\\'' + route + '\\'); return false;">Ver más</a>' +
                '</div>';
                
                var marker = L.marker([m.latitude, m.longitude], { icon: icon })
                    .bindPopup(popupContent);
                
                if (markerLayers[m.type]) {
                    marker.addTo(markerLayers[m.type]);
                }
            });

            // Añadir capas iniciales
            selectedTypes.forEach(function(type) {
                if (markerLayers[type]) {
                    markerLayers[type].addTo(map);
                }
            });

            // Escuchar mensajes para actualizar filtros
            function handleMessage(event) {
                var data;
                try {
                    data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                } catch (e) {
                    return;
                }

                if (data.type === 'updateFilters') {
                    // Actualizar tipos seleccionados
                    var newSelectedTypes = data.selectedTypes || [];
                    var newShowUser = data.showUserLocation;

                    // Actualizar marcadores de tipos
                    ['attraction', 'event', 'business'].forEach(function(type) {
                        var isSelected = newSelectedTypes.indexOf(type) !== -1;
                        var wasSelected = selectedTypes.indexOf(type) !== -1;

                        if (isSelected && !wasSelected) {
                            markerLayers[type].addTo(map);
                        } else if (!isSelected && wasSelected) {
                            map.removeLayer(markerLayers[type]);
                        }
                    });

                    // Actualizar marcador del usuario
                    if (newShowUser !== showUser) {
                        if (newShowUser) {
                            userMarkerLayer.addTo(map);
                        } else {
                            map.removeLayer(userMarkerLayer);
                        }
                        showUser = newShowUser;
                    }

                    selectedTypes = newSelectedTypes;
                }
            }

            // Soportar tanto window.addEventListener como document.addEventListener
            window.addEventListener('message', handleMessage);
            document.addEventListener('message', handleMessage);
        })();
    `;
}
