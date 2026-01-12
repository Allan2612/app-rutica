import { PromoScope, DiscountType, PlacementType, ModerationStatus, PromoPaymentState } from '@/types/enums';
import { Business } from './business';
import { Product, ProductCategory } from './product';
import { Profile } from './profile';

export interface Promotion {
  id_PRM: string;
  business_id_PRM: string;
  created_by_PRM: string;
  
  scope_PRM: PromoScope;
  title_PRM: string;
  description_PRM: string | null;
  
  discount_type_PRM: DiscountType;
  discount_value_PRM: number;
  
  start_at_PRM: string;
  end_at_PRM: string;
  
  placement_PRM: PlacementType;
  placement_score_PRM: number;
  
  moderation_status_PRM: ModerationStatus;
  reviewed_by_PRM: string | null;
  reviewed_at_PRM: string | null;
  moderation_note_PRM: string | null;
  
  payment_state_PRM: PromoPaymentState;
  payment_reference_PRM: string | null;
  payment_note_PRM: string | null;
  
  created_at_PRM: string;
  updated_at_PRM: string;
}

export interface PromotionWithRelations extends Promotion {
  business?: Business;
  created_by?: Profile;
  products?: Product[];
  categories?: ProductCategory[];
  combo_items?: PromotionComboItem[];
}

export interface PromotionProduct {
  promotion_id_PPR: string;
  product_id_PPR: string;
}

export interface PromotionCategory {
  promotion_id_PCR: string;
  category_id_PCR: string;
}

export interface PromotionComboItem {
  id_PCI: string;
  promotion_id_PCI: string;
  product_id_PCI: string;
  quantity_PCI: number;
}

export interface PromotionInsert extends Omit<Promotion, 'id_PRM' | 'created_at_PRM' | 'updated_at_PRM' | 'discount_type_PRM' | 'discount_value_PRM' | 'placement_PRM' | 'placement_score_PRM' | 'moderation_status_PRM' | 'payment_state_PRM'> {
  id_PRM?: string;
  discount_type_PRM?: DiscountType;
  discount_value_PRM?: number;
  placement_PRM?: PlacementType;
  placement_score_PRM?: number;
  moderation_status_PRM?: ModerationStatus;
  payment_state_PRM?: PromoPaymentState;
}

export interface PromotionUpdate extends Partial<Omit<Promotion, 'id_PRM' | 'business_id_PRM' | 'created_by_PRM' | 'created_at_PRM'>> {}

export interface PromotionComboItemInsert extends Omit<PromotionComboItem, 'id_PCI'> {
  id_PCI?: string;
}
