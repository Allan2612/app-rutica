/**
 * Límites geográficos de Costa Rica (con margen de seguridad para evitar fronteras)
 */
export const COSTA_RICA_BOUNDS = {
  north: 11.15, // Reducido desde 11.22 para evitar Nicaragua
  south: 8.1, // Aumentado desde 8.03 para evitar Panamá
  east: -82.6, // Reducido desde -82.55 para margen
  west: -85.9, // Aumentado desde -85.95 para margen
};

/**
 * Verifica si unas coordenadas están dentro de Costa Rica
 */
export function isWithinCostaRica(latitude: number, longitude: number): boolean {
  return (
    latitude >= COSTA_RICA_BOUNDS.south &&
    latitude <= COSTA_RICA_BOUNDS.north &&
    longitude >= COSTA_RICA_BOUNDS.west &&
    longitude <= COSTA_RICA_BOUNDS.east
  );
}

/**
 * Centro geográfico de Costa Rica (aproximado)
 */
export const COSTA_RICA_CENTER = {
  latitude: 9.7489,
  longitude: -83.7534,
};
