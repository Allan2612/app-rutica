import { ModerationStatus } from '../enums';
import { Location } from './location';
import { Profile } from './profile';

export interface BusinessCategory {
  id_BCA: string;
  name_BCA: string;
}

export interface Business {
  id_BUS: string;
  owner_id_BUS: string;
  name_BUS: string;
  description_BUS: string | null;
  category_id_BUS: string | null;
  location_id_BUS: string | null;
  
  whatsapp_phone_BUS: string | null;
  contact_phone_BUS: string | null;
  contact_email_BUS: string | null;
  website_BUS: string | null;
  
  moderation_status_BUS: ModerationStatus;
  reviewed_by_BUS: string | null;
  reviewed_at_BUS: string | null;
  moderation_note_BUS: string | null;
  
  is_active_BUS: boolean;
  created_at_BUS: string;
  updated_at_BUS: string;
}

export interface BusinessWithRelations extends Business {
  owner?: Profile;
  category?: BusinessCategory;
  location?: Location;
  images?: BusinessImage[];
  social_links?: BusinessSocialLink[];
}

export interface BusinessImage {
  id_BIM: string;
  business_id_BIM: string;
  bucket_BIM: string;
  path_BIM: string;
  sort_order_BIM: number;
  created_at_BIM: string;
}

export interface BusinessSocialLink {
  id_BSL: string;
  business_id_BSL: string;
  platform_BSL: string;
  url_BSL: string;
}

export interface BusinessInsert extends Omit<Business, 'id_BUS' | 'created_at_BUS' | 'updated_at_BUS' | 'moderation_status_BUS' | 'is_active_BUS'> {
  id_BUS?: string;
  moderation_status_BUS?: ModerationStatus;
  is_active_BUS?: boolean;
}

export interface BusinessUpdate extends Partial<Omit<Business, 'id_BUS' | 'owner_id_BUS' | 'created_at_BUS'>> {}

export interface BusinessImageInsert extends Omit<BusinessImage, 'id_BIM' | 'created_at_BIM'> {
  id_BIM?: string;
}

export interface BusinessSocialLinkInsert extends Omit<BusinessSocialLink, 'id_BSL'> {
  id_BSL?: string;
}
