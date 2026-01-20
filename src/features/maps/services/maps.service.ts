import { generateMapHTML as generateMapHTMLBase, type MapOptions } from '@/components/ui/LocationPicker/mapTemplate';

interface MapViewOptions {
  theme?: MapOptions['theme'];
  zoom?: number;
  popupText?: string;
}

/**
 * Genera el HTML para el mapa de visualización (sin drag)
 */
export function generateMapHTML(
  latitude: number,
  longitude: number,
  options: MapViewOptions = {}
): string {
  return generateMapHTMLBase(latitude, longitude, {
    draggable: false,
    showCoordinates: false,
    zoom: options.zoom ?? 16,
    theme: options.theme,
    popupText: options.popupText,
  });
}
