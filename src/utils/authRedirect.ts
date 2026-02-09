import { Platform } from 'react-native';

/**
 * URL base de la app web desplegada en Vercel.
 * Se usa para construir redirect URLs de autenticación (emails de confirmación y recuperación).
 */
const WEB_APP_URL = 'https://rutica-orpin.vercel.app';

/**
 * Scheme de deep linking para la app nativa.
 */
const NATIVE_SCHEME = 'rutica';

/**
 * Genera la URL de redirect adecuada según la plataforma.
 * - En web: usa la URL de Vercel
 * - En nativo: usa el deep link scheme
 */
export function getAuthRedirectUrl(path: string): string {
  if (Platform.OS === 'web') {
    return `${WEB_APP_URL}${path}`;
  }
  return `${NATIVE_SCHEME}://${path.startsWith('/') ? path.slice(1) : path}`;
}
