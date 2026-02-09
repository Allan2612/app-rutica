import { ModerationStatus } from '@/types/enums';
import { LocationWithHierarchy } from './location';
import { Profile } from './profile';
import { Category } from './category';

// ============================================
// Business - Tabla: businesses (bus)
// ============================================

/**
 * Social links como JSON
 */
export interface BusinessSocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  whatsapp?: string;
}

/**
 * Negocio - Row type
 */
export interface Business {
  id_bus: string;
  owner_id_bus: string | null;
  name_bus: string | null;
  description_bus: string | null;
  location_id_bus: string | null;
  social_links_bus: BusinessSocialLinks | null;
  contact_phone_bus: string | null;
  contact_email_bus: string | null;
  website_bus: string | null;
  // Moderación
  moderation_status_bus: ModerationStatus | null;
  reviewed_by_bus: string | null;
  reviewed_at_bus: string | null;
  moderation_note_bus: string | null;
  avg_rating_bus: number;
  reviews_count_bus: number;
  is_active_bus: boolean;
  created_at_bus: string;
  updated_at_bus: string;
}

/**
 * Imagen de negocio - Tabla: business_images (bim)
 * Path format: <business_id>/<prefix>-<uuid>.ext
 * Prefijos válidos: logo, cover, gallery
 */
export interface BusinessImage {
  id_bim: string;
  business_id_bim: string;
  path_bim: string;
  sort_order_bim: number | null;
  created_at_bim: string;
}

/**
 * Negocio con relaciones
 */
export interface BusinessWithRelations extends Business {
  owner?: Profile | null;
  categories?: Category[];
  location?: LocationWithHierarchy | null;
  images?: BusinessImage[];
  reviewed_by?: Profile | null;
}

// ============================================
// Insert/Update Types
// ============================================

export interface BusinessInsert {
  owner_id_bus: string;
  name_bus: string;
  description_bus?: string | null;
  location_id_bus?: string | null;
  social_links_bus?: BusinessSocialLinks | null;
  contact_phone_bus?: string | null;
  contact_email_bus?: string | null;
  website_bus?: string | null;
  // moderation_status_bus se setea automáticamente a 'pending'
}

export interface BusinessUpdate {
  name_bus?: string;
  description_bus?: string | null;
  location_id_bus?: string | null;
  social_links_bus?: BusinessSocialLinks | null;
  contact_phone_bus?: string | null;
  contact_email_bus?: string | null;
  website_bus?: string | null;
  is_active_bus?: boolean;
  // Campos de moderación solo editables por admin (protegidos por trigger)
}

export interface BusinessImageInsert {
  business_id_bim: string;
  path_bim: string;
  sort_order_bim?: number | null;
}

// ============================================
// UI Types (para listados y formularios)
// ============================================

/**
 * Item de lista de negocios del usuario
 */
export interface UserBusinessListItem {
  id: string;
  name: string;
  description: string | null;
  categoryNames: string[];
  categoryIds: string[];
  locationLabel: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  moderationStatus: ModerationStatus;
  moderationNote: string | null;
  isActive: boolean;
  avgRating: number;
  reviewsCount: number;
  createdAt: string;
}

/**
 * Datos para edición de negocio
 */
export interface BusinessDetailForEdit {
  id: string;
  name: string;
  description: string | null;
  categoryIds: string[];
  districtId: string | null;
  country: string;
  province: string;
  canton: string;
  district: string;
  address: string | null;
  latitude: number;
  longitude: number;
  phone: string | null;
  email: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  galleryUrls: string[];
  isActive?: boolean;
}

/**
 * Datos para crear/actualizar negocio desde formulario
 */
export interface BusinessFormData {
  name: string;
  description: string | null;
  categoryIds: string[];
  districtId: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  socialLinks: BusinessSocialLinks | null;
  logoUri?: string | null;
  coverUri?: string | null;
  galleryUris?: string[];
}

// ============================================
// Helpers
// ============================================

/**
 * Extrae la URL del logo de las imágenes
 */
export function getBusinessLogoUrl(images: BusinessImage[] | undefined, baseUrl: string): string | null {
  const logo = images?.find(img => img.path_bim.includes('/logo-'));
  return logo ? `${baseUrl}/${logo.path_bim}` : null;
}

/**
 * Extrae la URL del cover de las imágenes
 */
export function getBusinessCoverUrl(images: BusinessImage[] | undefined, baseUrl: string): string | null {
  const cover = images?.find(img => img.path_bim.includes('/cover-'));
  return cover ? `${baseUrl}/${cover.path_bim}` : null;
}

/**
 * Extrae las URLs de galería ordenadas
 */
export function getBusinessGalleryUrls(images: BusinessImage[] | undefined, baseUrl: string): string[] {
  if (!images) return [];
  return images
    .filter(img => img.path_bim.includes('/gallery-'))
    .sort((a, b) => (a.sort_order_bim ?? 0) - (b.sort_order_bim ?? 0))
    .map(img => `${baseUrl}/${img.path_bim}`);
}

/**
 * Verifica si un negocio está aprobado y activo
 */
export function isBusinessPublic(business: Business): boolean {
  return business.moderation_status_bus === 'approved' && business.is_active_bus;
}
