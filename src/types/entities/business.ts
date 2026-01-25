import { ModerationStatus } from '@/types/enums';
import { Location } from './location';
import { Profile } from './profile';
import { Category } from './category';

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
  categories?: Category[];  // Cambiado: ahora usa Category[] en lugar de BusinessCategory
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

export interface BusinessUpdate extends Partial<Omit<Business, 'id_BUS' | 'owner_id_BUS' | 'created_at_BUS'>> { }

export interface BusinessImageInsert extends Omit<BusinessImage, 'id_BIM' | 'created_at_BIM'> {
  id_BIM?: string;
}

export interface BusinessSocialLinkInsert extends Omit<BusinessSocialLink, 'id_BSL'> {
  id_BSL?: string;
}

// Types for user business management
export interface UserBusinessListItem {
  id: string;
  name: string;
  description: string | null;
  categoryNames: string[];
  categoryIds: string[];
  locationLabel: string | null;
  imageUrl: string | null;
  logoUrl: string | null;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdAt: string;
}

export interface BusinessRecord {
  id_bus: string;
  name_bus: string;
  description_bus: string | null;
  moderation_status_bus: string;
  is_active_bus: boolean;
  created_at_bus: string;
  locations: {
    canton_loc: string | null;
    district_loc: string | null;
    province_loc: string | null;
  }[] | null;
  business_images: {
    image_type_bim: string;
    bucket_bim: string;
    path_bim: string;
    sort_order_bim: number;
  }[] | null;
  business_category_map: {
    categories: {
      id_cat: string;
      name_cat: string;
    } | null;
  }[];
}

export interface BusinessDetailForEdit {
  id: string;
  name: string;
  description: string | null;
  categoryIds: string[];
  province: string | null;
  canton: string | null;
  district: string | null;
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
}

export interface UpdateBusinessData {
  name: string;
  description: string | null;
  categoryIds: string[];
  country: string | null;
  province: string | null;
  canton: string | null;
  district: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  phone: string | null;
  email: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  logoUri?: string | null;
  coverUri?: string | null;
  galleryUris: string[];
}
