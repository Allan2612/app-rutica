import { Platform, useWindowDimensions } from 'react-native';

/** Ancho desde el que la web usa el panel lateral en lugar de las pestañas de abajo */
export const DESKTOP_MIN_WIDTH = 1024;

/**
 * true solo en la web con pantalla ancha (PC). La app nativa siempre es false, aunque sea una
 * tablet grande: ahí se quedan las pestañas de abajo.
 */
export function useIsDesktopWeb() {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' && width >= DESKTOP_MIN_WIDTH;
}
