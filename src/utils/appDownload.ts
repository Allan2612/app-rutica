/**
 * Configuración de URLs de descarga de la app.
 *
 * Para actualizar el APK:
 * 1. Generar nuevo build: eas build --platform android --profile preview
 * 2. Obtener la URL: eas build:list --platform android --limit 1 --json --non-interactive
 * 3. Copiar el valor de artifacts.buildUrl y pegarlo en ANDROID_APK_URL
 */

// URL del APK para Android (URL pública de EAS Artifacts)
export const ANDROID_APK_URL =
  'https://expo.dev/artifacts/eas/dFqPHVAXp1vhWbAz5tkDNp.apk';

// URL de la App Store para iOS (actualizar cuando esté publicada)
export const IOS_APP_STORE_URL = '';

// URL del Play Store para Android (actualizar cuando esté publicada)
export const ANDROID_PLAY_STORE_URL = '';

/**
 * Detecta el sistema operativo del visitante desde el navegador web.
 */
export function detectMobileOS(): 'android' | 'ios' | 'desktop' {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'desktop';
  }

  const userAgent = navigator.userAgent || navigator.vendor || '';

  if (/android/i.test(userAgent)) {
    return 'android';
  }

  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'ios';
  }

  return 'desktop';
}

/**
 * Obtiene la URL de descarga apropiada según la plataforma detectada.
 * Retorna null si no hay URL configurada para esa plataforma.
 */
export function getDownloadUrl(): { url: string; platform: 'android' | 'ios' | 'desktop' } | null {
  const platform = detectMobileOS();

  switch (platform) {
    case 'android':
      if (ANDROID_PLAY_STORE_URL) return { url: ANDROID_PLAY_STORE_URL, platform };
      if (ANDROID_APK_URL) return { url: ANDROID_APK_URL, platform };
      return null;

    case 'ios':
      if (IOS_APP_STORE_URL) return { url: IOS_APP_STORE_URL, platform };
      return null;

    case 'desktop':
    default:
      // En desktop ofrecemos el APK de Android como descarga
      if (ANDROID_APK_URL) return { url: ANDROID_APK_URL, platform };
      return null;
  }
}

/**
 * Verifica si hay al menos una URL de descarga configurada.
 */
export function hasDownloadAvailable(): boolean {
  return !!(ANDROID_APK_URL || IOS_APP_STORE_URL || ANDROID_PLAY_STORE_URL);
}

/**
 * Inicia la descarga directa del archivo.
 * En web: abre la URL del APK (el navegador detecta el .apk y lo descarga).
 * En iOS: redirige al App Store.
 */
export function triggerDownload(): void {
  const download = getDownloadUrl();
  if (!download) return;

  if (typeof window !== 'undefined') {
    window.open(download.url, '_blank');
  }
}
