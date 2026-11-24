import { supabase } from '@/lib/supabase/client';

/**
 * Anchos de imagen que se piden al servidor. Supabase redimensiona, no agranda las chicas y
 * entrega WebP a los navegadores que lo aceptan (una foto de 16 MB baja a ~400 KB en `full`).
 */
export const IMAGE_WIDTH = {
  /** Avatares y logos chicos */
  thumb: 160,
  /** Tarjetas de listados y carruseles del inicio */
  card: 640,
  /** Detalle, galería y visor */
  full: 1200,
} as const;

/** Duración de la caché al subir: los nombres son únicos (timestamp/UUID), nunca cambian. */
export const UPLOAD_CACHE_SECONDS = String(60 * 60 * 24 * 365);

/**
 * URL pública de una imagen de Storage ('' si no hay path). Sin `width` devuelve el archivo
 * original: los formularios de edición comparan esas URLs para saber qué fotos conservar,
 * así que solo el código que muestra imágenes pide versiones redimensionadas.
 */
export function publicStorageUrl(
  bucket: string,
  path: string | null | undefined,
  width: number | null = null,
): string {
  if (!path) return '';
  const clean = path.replace(/^\/+/, '');
  const options = width ? { transform: { width, quality: 75 } } : undefined;
  return supabase.storage.from(bucket).getPublicUrl(clean, options).data.publicUrl;
}

/**
 * Tipo de imagen según el prefijo del archivo (V3):
 * `<entidad_id>/<tipo>-<timestamp>-<random>.<ext>` → 'cover' | 'logo' | 'gallery' | ...
 */
export function getImageTypeFromPath(path: string | null | undefined): string {
  if (!path) return '';
  const filename = path.split('/').pop() || '';
  return filename.split('-')[0];
}
