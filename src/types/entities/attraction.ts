import { ModerationStatus } from '@/types/enums';
import { Location } from './location';
import { Profile } from './profile';

export interface AttractionCategory {
  id_ACA: string;
  name_ACA: string;
}

export interface Attraction {
  id_ATR: string;
  submitted_by_ATR: string;
  name_ATR: string;
  description_ATR: string | null;
  location_id_ATR: string | null;
  
  moderation_status_ATR: ModerationStatus;
  reviewed_by_ATR: string | null;
  reviewed_at_ATR: string | null;
  moderation_note_ATR: string | null;
  
  avg_rating_ATR: number;
  reviews_count_ATR: number;
  
  is_active_ATR: boolean;
  created_at_ATR: string;
  updated_at_ATR: string;
}

export interface AttractionWithRelations extends Attraction {
  submitted_by?: Profile;
  category?: AttractionCategory;
  location?: Location;
  images?: AttractionImage[];
}

export interface AttractionImage {
  id_AIM: string;
  attraction_id_AIM: string;
  bucket_AIM: string;
  path_AIM: string;
  sort_order_AIM: number;
  created_at_AIM: string;
}

export interface AttractionInsert extends Omit<Attraction, 'id_ATR' | 'created_at_ATR' | 'updated_at_ATR' | 'moderation_status_ATR' | 'is_active_ATR'> {
  id_ATR?: string;
  moderation_status_ATR?: ModerationStatus;
  is_active_ATR?: boolean;
}

export interface AttractionUpdate extends Partial<Omit<Attraction, 'id_ATR' | 'submitted_by_ATR' | 'created_at_ATR'>> {}

export interface AttractionImageInsert extends Omit<AttractionImage, 'id_AIM' | 'created_at_AIM'> {
  id_AIM?: string;
}
