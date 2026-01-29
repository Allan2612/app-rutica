import { ModerationStatus } from '@/types/enums';
import { LocationWithHierarchy } from './location';
import { Profile } from './profile';
import { Category } from './category';

// ============================================
// Attraction - Tabla: attractions (atr)
// ============================================

/**
 * Atracción turística - Row type
 */
export interface Attraction {
  id_atr: string;
  submitted_by_atr: string | null;
  name_atr: string | null;
  description_atr: string | null;
  location_id_atr: string | null;
  moderation_status_atr: ModerationStatus | null;
  reviewed_by_atr: string | null;
  reviewed_at_atr: string | null;
  moderation_note_atr: string | null;
  avg_rating_atr: number;
  reviews_count_atr: number;
  is_active_atr: boolean;
  created_at_atr: string;
  updated_at_atr: string;
}

/**
 * Imagen de atracción - Tabla: attraction_images (aim)
 * Path format: <attraction_id>/<prefix>-<uuid>.ext
 * Prefijos válidos: cover, gallery
 */
export interface AttractionImage {
  id_aim: string;
  attraction_id_aim: string;
  path_aim: string;
  sort_order_aim: number | null;
  created_at_aim: string;
}

/**
 * Atracción con relaciones
 */
export interface AttractionWithRelations extends Attraction {
  submitted_by?: Profile | null;
  categories?: Category[];
  location?: LocationWithHierarchy | null;
  images?: AttractionImage[];
  reviewed_by?: Profile | null;
}

// ============================================
// Insert/Update Types
// ============================================

export interface AttractionInsert {
  submitted_by_atr: string;
  name_atr: string;
  description_atr?: string | null;
  location_id_atr?: string | null;
  // moderation_status_atr se setea automáticamente a 'pending'
}

export interface AttractionUpdate {
  name_atr?: string;
  description_atr?: string | null;
  location_id_atr?: string | null;
  is_active_atr?: boolean;
  // Campos de moderación solo editables por admin (protegidos por trigger)
}

export interface AttractionImageInsert {
  attraction_id_aim: string;
  path_aim: string;
  sort_order_aim?: number | null;
}

// ============================================
// UI Types (para listados y formularios)
// ============================================

/**
 * Item de lista de atracciones del usuario
 */
export interface UserAttractionListItem {
  id: string;
  name: string;
  description: string | null;
  categoryNames: string[];
  categoryIds: string[];
  locationLabel: string | null;
  coverImageUrl: string | null;
  moderationStatus: ModerationStatus;
  isActive: boolean;
  avgRating: number;
  reviewsCount: number;
  createdAt: string;
}

/**
 * Datos para edición de atracción
 */
export interface AttractionDetailForEdit {
  id: string;
  name: string;
  description: string | null;
  categoryIds: string[];
  districtId: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  coverImageUrl: string | null;
  galleryUrls: string[];
}

/**
 * Datos para crear/actualizar atracción desde formulario
 */
export interface AttractionFormData {
  name: string;
  description: string | null;
  categoryIds: string[];
  districtId: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  coverImageUri?: string | null;
  galleryUris?: string[];
}

// ============================================
// Helpers
// ============================================

/**
 * Extrae la URL de la imagen de portada de las imágenes
 */
export function getAttractionCoverImageUrl(images: AttractionImage[] | undefined, baseUrl: string): string | null {
  const cover = images?.find(img => img.path_aim.includes('/cover-'));
  return cover ? `${baseUrl}/${cover.path_aim}` : null;
}

/**
 * Extrae las URLs de galería ordenadas
 */
export function getAttractionGalleryUrls(images: AttractionImage[] | undefined, baseUrl: string): string[] {
  if (!images) return [];
  return images
    .filter(img => img.path_aim.includes('/gallery-'))
    .sort((a, b) => (a.sort_order_aim ?? 0) - (b.sort_order_aim ?? 0))
    .map(img => `${baseUrl}/${img.path_aim}`);
}

/**
 * Verifica si una atracción está aprobada y activa
 */
export function isAttractionPublic(attraction: Attraction): boolean {
  return attraction.moderation_status_atr === 'approved' && attraction.is_active_atr;
}
