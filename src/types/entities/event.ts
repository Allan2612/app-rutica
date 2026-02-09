import { ModerationStatus } from '@/types/enums';
import { LocationWithHierarchy } from './location';
import { Profile } from './profile';
import { Category } from './category';

// ============================================
// Event - Tabla: events (evt)
// ============================================

/**
 * Social links como JSON
 */
export interface EventSocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  whatsapp?: string;
}

/**
 * Evento - Row type
 */
export interface Event {
  id_evt: string;
  created_by_evt: string | null;
  name_evt: string | null;
  description_evt: string | null;
  location_id_evt: string | null;
  start_at_evt: string | null;
  end_at_evt: string | null;
  price_evt: number | null;
  currency_evt: string | null;
  capacity_evt: number | null;
  is_free_evt: boolean;
  social_links_evt: EventSocialLinks | null;
  contact_phone_evt: string | null;
  contact_email_evt: string | null;
  website_evt: string | null;
  ticket_url_evt: string | null;
  moderation_status_evt: ModerationStatus | null;
  reviewed_by_evt: string | null;
  reviewed_at_evt: string | null;
  moderation_note_evt: string | null;
  avg_rating_evt: number;
  reviews_count_evt: number;
  is_active_evt: boolean;
  created_at_evt: string;
  updated_at_evt: string;
}

/**
 * Imagen de evento - Tabla: event_images (eim)
 * Path format: <event_id>/<prefix>-<uuid>.ext
 * Prefijos válidos: cover, gallery
 */
export interface EventImage {
  id_eim: string;
  event_id_eim: string;
  path_eim: string;
  sort_order_eim: number | null;
  created_at_eim: string;
}

/**
 * Evento con relaciones
 */
export interface EventWithRelations extends Event {
  created_by?: Profile | null;
  categories?: Category[];
  location?: LocationWithHierarchy | null;
  images?: EventImage[];
  reviewed_by?: Profile | null;
}

// ============================================
// Insert/Update Types
// ============================================

export interface EventInsert {
  created_by_evt: string;
  name_evt: string;
  description_evt?: string | null;
  location_id_evt?: string | null;
  start_at_evt: string;
  end_at_evt: string;
  price_evt?: number | null;
  currency_evt?: string | null;
  capacity_evt?: number | null;
  is_free_evt?: boolean;
  social_links_evt?: EventSocialLinks | null;
  contact_phone_evt?: string | null;
  contact_email_evt?: string | null;
  website_evt?: string | null;
  ticket_url_evt?: string | null;
  // moderation_status_evt se setea automáticamente a 'pending'
}

export interface EventUpdate {
  name_evt?: string;
  description_evt?: string | null;
  location_id_evt?: string | null;
  start_at_evt?: string;
  end_at_evt?: string;
  price_evt?: number | null;
  currency_evt?: string | null;
  capacity_evt?: number | null;
  is_free_evt?: boolean;
  social_links_evt?: EventSocialLinks | null;
  contact_phone_evt?: string | null;
  contact_email_evt?: string | null;
  website_evt?: string | null;
  ticket_url_evt?: string | null;
  is_active_evt?: boolean;
  // Campos de moderación solo editables por admin (protegidos por trigger)
}

export interface EventImageInsert {
  event_id_eim: string;
  path_eim: string;
  sort_order_eim?: number | null;
}

// ============================================
// UI Types (para listados y formularios)
// ============================================

/**
 * Item de lista de eventos del usuario
 */
export interface UserEventListItem {
  id: string;
  name: string;
  description: string | null;
  categoryNames: string[];
  categoryIds: string[];
  locationLabel: string | null;
  coverUrl: string | null;
  startAt: string | null;
  endAt: string | null;
  price: number | null;
  isFree: boolean;
  moderationStatus: ModerationStatus;
  isActive: boolean;
  avgRating: number;
  reviewsCount: number;
  createdAt: string;
}

/**
 * Datos para edición de evento
 */
export interface EventDetailForEdit {
  id: string;
  name: string;
  description: string | null;
  categoryIds: string[];
  districtId: string | null;
  country?: string | null;
  province?: string | null;
  canton?: string | null;
  district?: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  startAt: string | null;
  endAt: string | null;
  price: number | null;
  currency: string | null;
  capacity: number | null;
  isFree: boolean;
  phone: string | null;
  email: string | null;
  website: string | null;
  ticketUrl: string | null;
  socialLinks: EventSocialLinks | null;
  coverUrl: string | null;
  galleryUrls: string[];
  isActive?: boolean;
}

/**
 * Datos para crear/actualizar evento desde formulario
 */
export interface EventFormData {
  name: string;
  description: string | null;
  categoryIds: string[];
  districtId: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  startAt: string;
  endAt: string;
  price: number | null;
  currency: string | null;
  capacity: number | null;
  isFree: boolean;
  phone: string | null;
  email: string | null;
  website: string | null;
  ticketUrl: string | null;
  socialLinks: EventSocialLinks | null;
  coverUri?: string | null;
  galleryUris?: string[];
}

// ============================================
// Helpers
// ============================================

/**
 * Extrae la URL del cover de las imágenes
 */
export function getEventCoverUrl(images: EventImage[] | undefined, baseUrl: string): string | null {
  const cover = images?.find((img) => img.path_eim.includes('/cover-'));
  return cover ? `${baseUrl}/${cover.path_eim}` : null;
}

/**
 * Extrae las URLs de galería ordenadas
 */
export function getEventGalleryUrls(images: EventImage[] | undefined, baseUrl: string): string[] {
  if (!images) return [];
  return images
    .filter((img) => img.path_eim.includes('/gallery-'))
    .sort((a, b) => (a.sort_order_eim ?? 0) - (b.sort_order_eim ?? 0))
    .map((img) => `${baseUrl}/${img.path_eim}`);
}

/**
 * Verifica si un evento está aprobado y activo
 */
export function isEventPublic(event: Event): boolean {
  return event.moderation_status_evt === 'approved' && event.is_active_evt;
}

/**
 * Verifica si un evento ya pasó
 */
export function isEventPast(event: Event): boolean {
  if (!event.end_at_evt) return false;
  return new Date(event.end_at_evt) < new Date();
}

/**
 * Verifica si un evento está en curso
 */
export function isEventOngoing(event: Event): boolean {
  const now = new Date();
  const start = event.start_at_evt ? new Date(event.start_at_evt) : null;
  const end = event.end_at_evt ? new Date(event.end_at_evt) : null;
  if (!start || !end) return false;
  return start <= now && now <= end;
}
