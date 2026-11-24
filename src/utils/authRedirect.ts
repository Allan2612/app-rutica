import { Platform } from 'react-native';

/**
 * Dominio público de la app web. En el navegador se usa el dominio desde el que se pidió (así el
 * correo trae de vuelta al mismo sitio); este valor queda de respaldo. Cada dominio debe estar en
 * Supabase → Auth → Redirect URLs, o Supabase usa el Site URL.
 */
const WEB_APP_URL = 'https://rutica.avt.codes';

/**
 * Scheme de deep linking para la app nativa.
 */
const NATIVE_SCHEME = 'rutica';

/**
 * Genera la URL de redirect adecuada según la plataforma.
 * - En web: el dominio actual (rutica.avt.codes o el de Vercel)
 * - En nativo: usa el deep link scheme
 */
export function getAuthRedirectUrl(path: string): string {
  if (Platform.OS === 'web') {
    const origin = typeof window !== 'undefined' ? window.location.origin : WEB_APP_URL;
    return `${origin}${path}`;
  }
  return `${NATIVE_SCHEME}://${path.startsWith('/') ? path.slice(1) : path}`;
}
