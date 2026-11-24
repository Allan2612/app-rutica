import { supabase } from '@/lib/supabase/client';

/** URL pública de un archivo de Storage ('' si no hay path). */
export function publicStorageUrl(bucket: string, path: string | null | undefined): string {
  if (!path) return '';
  return supabase.storage.from(bucket).getPublicUrl(path.replace(/^\/+/, '')).data.publicUrl;
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
