import { EventType, ModerationStatus } from '@/types/enums';
import { Location } from './location';
import { Profile } from './profile';

/**
 * Evento
 * Tabla: events (EVT)
 */
export interface Event {
  id_EVT: string;
  submitted_by_EVT: string;
  name_EVT: string;
  description_EVT: string | null;
  event_type_EVT: EventType;
  location_id_EVT: string | null;
  
  start_at_EVT: string;
  end_at_EVT: string;
  
  moderation_status_EVT: ModerationStatus;
  reviewed_by_EVT: string | null;
  reviewed_at_EVT: string | null;
  moderation_note_EVT: string | null;
  
  is_active_EVT: boolean;
  created_at_EVT: string;
  updated_at_EVT: string;
}

/**
 * Evento con relaciones cargadas
 */
export interface EventWithRelations extends Event {
  submitted_by?: Profile;
  location?: Location;
  images?: EventImage[];
}

/**
 * Imagen de evento
 * Tabla: event_images (EIM)
 */
export interface EventImage {
  id_EIM: string;
  event_id_EIM: string;
  bucket_EIM: string;
  path_EIM: string;
  sort_order_EIM: number;
  created_at_EIM: string;
}

/**
 * Reseña de evento
 * Tabla: event_reviews (ERV)
 */
export interface EventReview {
  id_ERV: string;
  event_id_ERV: string;
  user_id_ERV: string;
  rating_ERV: number;
  comment_ERV: string | null;
  created_at_ERV: string;
}

export interface EventReviewWithRelations extends EventReview {
  user?: Profile;
  event?: Event;
}

// Insert types
export interface EventInsert extends Omit<Event, 'id_EVT' | 'created_at_EVT' | 'updated_at_EVT' | 'moderation_status_EVT' | 'is_active_EVT'> {
  id_EVT?: string;
  moderation_status_EVT?: ModerationStatus;
  is_active_EVT?: boolean;
}

export interface EventImageInsert extends Omit<EventImage, 'id_EIM' | 'created_at_EIM'> {
  id_EIM?: string;
}

export interface EventReviewInsert extends Omit<EventReview, 'id_ERV' | 'created_at_ERV'> {
  id_ERV?: string;
}

// Update types
export interface EventUpdate extends Partial<Omit<Event, 'id_EVT' | 'submitted_by_EVT' | 'created_at_EVT'>> {}
