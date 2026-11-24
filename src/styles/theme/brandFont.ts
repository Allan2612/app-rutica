import { Platform, TextStyle } from 'react-native';

/**
 * Tipografía de marca (Caveat Bold).
 *
 * - Nativo: la fuente va embebida en el build (plugin expo-font en app.json) y se
 *   registra como `Caveat_700Bold`. NO se debe agregar `fontWeight`: en Android,
 *   pedir bold sobre una familia personalizada de un solo archivo hace que el
 *   sistema caiga a Roboto.
 * - Web: se carga desde Google Fonts (public/index.html) con el nombre `Caveat`.
 */
export const brandFont: TextStyle = Platform.select<TextStyle>({
  web: { fontFamily: 'Caveat', fontWeight: '700' },
  default: { fontFamily: 'Caveat_700Bold' },
});
