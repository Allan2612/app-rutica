import { generateMapHTML as generateMapHTMLBase } from '@/components/ui/LocationPicker/mapTemplate';

/**
 * Genera el HTML para el mapa de visualización (sin drag)
 */
export function generateMapHTML(latitude: number, longitude: number): string {
  return generateMapHTMLBase(latitude, longitude, {
    draggable: false,
    showCoordinates: false,
    zoom: 16,
  });
}

/**
 * Genera URL para Google Maps Embed
 */
export function generateGoogleMapsURL(latitude: number, longitude: number): string {
  const apiKey = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8';
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=16`;
}
