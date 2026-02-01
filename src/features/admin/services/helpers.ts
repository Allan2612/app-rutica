// ============================================
// Admin Module - Storage Helpers
// ============================================

import { supabase } from '@/lib/supabase/client';
import type { ImageType } from '@/types/enums';

// ============================================
// Constants - Buckets por entidad
// ============================================

export const STORAGE_BUCKETS = {
  profiles: 'profile-images',
  businesses: 'business-images',
  events: 'events-images',
  attractions: 'attractions-images',
  products: 'product-images',
  promotions: 'promotions-images',
} as const;

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];

// ============================================
// Helper Functions
// ============================================

/**
 * Construye URL pública de imagen desde path
 * Retorna string vacío si no hay path
 */
export function getImageUrl(bucket: StorageBucket, path: string | null | undefined): string {
  if (!path) return '';
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Extrae el tipo de imagen del path
 * Path format: <entity_id>/<prefix>-<uuid>.ext
 * Ej: "abc123/cover-xyz.jpg" -> "cover"
 */
export function getImageTypeFromPath(path: string): ImageType | undefined {
  if (!path) return undefined;
  const filename = path.split('/').pop() || '';
  const prefix = filename.split('-')[0];
  
  const validTypes: ImageType[] = ['cover', 'logo', 'gallery', 'product', 'combo', 'brand', 'flyer'];
  return validTypes.includes(prefix as ImageType) ? (prefix as ImageType) : undefined;
}

/**
 * Formatea la ubicación desde la jerarquía normalizada
 * Incluye Provincia > Cantón > Distrito
 */
export function formatLocationFromHierarchy(location: {
  address_loc?: string | null;
  districts?: {
    name_dst?: string;
    cantons?: {
      name_ctn?: string;
      provinces?: {
        name_prv?: string;
      };
    };
  };
} | null): string | null {
  if (!location?.districts) return null;

  const parts = [
    location.districts?.cantons?.provinces?.name_prv,
    location.districts?.cantons?.name_ctn,
    location.districts?.name_dst,
  ].filter(Boolean);

  return parts.length ? parts.join(', ') : null;
}

/**
 * Formatea nombre completo desde profile
 */
export function formatFullName(profile: {
  first_name_prf?: string | null;
  last_name1_prf?: string | null;
  last_name2_prf?: string | null;
} | null, fallback = 'Usuario'): string {
  if (!profile) return fallback;
  
  const parts = [
    profile.first_name_prf,
    profile.last_name1_prf,
    profile.last_name2_prf,
  ].filter(Boolean);
  
  return parts.length > 0 ? parts.join(' ') : fallback;
}

/**
 * Formatea fecha para display en admin (incluye hora)
 */
export function formatDateAdmin(date: string | null | undefined): string {
  if (!date) return 'No especificado';
  
  return new Date(date).toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formatea fecha corta para admin
 */
export function formatDateShort(date: string | null | undefined): string {
  if (!date) return 'No especificado';
  
  return new Date(date).toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formatea moneda con manejo de null
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return `₡${value.toLocaleString('es-CR')}`;
}
