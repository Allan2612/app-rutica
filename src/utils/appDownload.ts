/**
 * Configuración de URLs de descarga de la app.
 *
 * Para actualizar el APK:
 * 1. Generar nuevo build: eas build --platform android --profile preview
 * 2. Descargar el APK desde EAS
 * 3. Subir a Supabase Storage → bucket "app-downloads" como "rutica-latest.apk"
 * 4. La descarga se hace automáticamente desde la URL pública del bucket
 */

const SUPABASE_STORAGE_URL =
  'https://irmibyxlwkbsuauqnbiw.supabase.co/storage/v1/object/public/app-downloads';

// URL del APK para Android (bucket público de Supabase)
export const ANDROID_APK_URL = `${SUPABASE_STORAGE_URL}/rutica-latest.apk`;

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
 * En web: crea un <a download> para forzar la descarga del APK.
 * En iOS: redirige al App Store (no hay descarga directa).
 */
export function triggerDownload(): void {
  const download = getDownloadUrl();
  if (!download) return;

  // iOS siempre redirige a la tienda
  if (download.platform === 'ios') {
    window.open(download.url, '_blank');
    return;
  }

  // Android y Desktop: descarga directa del APK
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const link = document.createElement('a');
    link.href = download.url;
    link.download = 'rutica.apk';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
