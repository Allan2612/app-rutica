import { PromoScope, DiscountType, PlacementType, ModerationStatus, PromoPaymentState, ImageType } from '@/types/enums';
import { Business } from './business';
import { Product } from './product';
import { Profile } from './profile';
import { Category } from './category';

// ============================================
// Base Promotion Entity
// ============================================
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

// ============================================
// Promotion with Relations (Joined data)
// ============================================
export interface PromotionWithRelations extends Promotion {
  business?: Business;
  created_by?: Profile;
  reviewed_by?: Profile;
  products?: Product[];
  categories?: Category[];
  images?: PromotionImage[];
  combo_items?: PromotionComboItem[];
}

// ============================================
// Promotion Image Entity
// ============================================
export interface PromotionImage {
  id_PIM: string;
  promotion_id_PIM: string;
  image_type_PIM: ImageType;
  bucket_PIM: string;
  path_PIM: string;
  created_at_PIM: string;
}

export interface PromotionImageInsert extends Omit<PromotionImage, 'id_PIM' | 'created_at_PIM'> {
  id_PIM?: string;
}

// ============================================
// Promotion Product Map (Many-to-Many)
// ============================================
export interface PromotionProduct {
  promotion_id_PPR: string;
  product_id_PPR: string;
}

export interface PromotionProductInsert {
  promotion_id_PPR: string;
  product_id_PPR: string;
}

// ============================================
// Promotion Category Map (Many-to-Many)
// ============================================
export interface PromotionCategory {
  promotion_id_PCR: string;
  category_id_PCR: string;
}

export interface PromotionCategoryInsert {
  promotion_id_PCR: string;
  category_id_PCR: string;
}

// ============================================
// Promotion Combo Item (for combo-type promotions)
// ============================================
export interface PromotionComboItem {
  id_PCI: string;
  promotion_id_PCI: string;
  product_id_PCI: string;
  quantity_PCI: number;
}

export interface PromotionComboItemInsert extends Omit<PromotionComboItem, 'id_PCI'> {
  id_PCI?: string;
}

// ============================================
// Insert/Update Types
// ============================================
export interface PromotionInsert extends Omit<
  Promotion,
  | 'id_PRM'
  | 'created_at_PRM'
  | 'updated_at_PRM'
  | 'discount_type_PRM'
  | 'discount_value_PRM'
  | 'placement_PRM'
  | 'placement_score_PRM'
  | 'moderation_status_PRM'
  | 'payment_state_PRM'
  | 'reviewed_by_PRM'
  | 'reviewed_at_PRM'
  | 'moderation_note_PRM'
> {
  id_PRM?: string;
  discount_type_PRM?: DiscountType;
  discount_value_PRM?: number;
  placement_PRM?: PlacementType;
  placement_score_PRM?: number;
  moderation_status_PRM?: ModerationStatus;
  payment_state_PRM?: PromoPaymentState;
}

export interface PromotionUpdate extends Partial<
  Omit<Promotion, 'id_PRM' | 'business_id_PRM' | 'created_by_PRM' | 'created_at_PRM'>
> {}

// ============================================
// List/View Types for UI
// ============================================
export interface PromotionListItem {
  id: string;
  title: string;
  description: string | null;
  scope: PromoScope;
  discountType: DiscountType;
  discountValue: number;
  startAt: string;
  endAt: string;
  moderationStatus: ModerationStatus;
  paymentState: PromoPaymentState;
  businessId: string;
  businessName: string | null;
  imageUrl: string | null;
  categoryNames: string[];
  isActive: boolean;
  createdAt: string;
}

export interface PromotionDetailForEdit {
  id: string;
  businessId: string;
  scope: PromoScope;
  title: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  startAt: string;
  endAt: string;
  categoryIds: string[];
  productIds: string[];
  coverUrl: string | null;
  galleryUrls: string[];
}

export interface CreatePromotionData {
  businessId: string;
  scope: PromoScope;
  title: string;
  description?: string;
  discountType?: DiscountType;
  discountValue?: number;
  startAt: string;
  endAt: string;
  categoryIds?: string[];
  productIds?: string[];
  coverUri?: string | null;
  galleryUris?: string[];
  paymentReference?: string; // Número de referencia SINPE
}

export interface UpdatePromotionData {
  scope?: PromoScope;
  title?: string;
  description?: string;
  discountType?: DiscountType;
  discountValue?: number;
  startAt?: string;
  endAt?: string;
  categoryIds?: string[];
  productIds?: string[];
  coverUri?: string | null;
  galleryUris?: string[];
  paymentReference?: string;
}

// ============================================
// Wizard Form Data Types
// ============================================
export interface PromotionWizardFormData {
  // Step 1: Business + Basic Info
  businessId: string;
  title: string;
  description: string;
  scope: PromoScope;

  // Step 2: Discount + Products
  discountType: DiscountType;
  discountValue: number;
  selectedProductIds: string[];

  // Step 3: Dates + Categories
  startDate: Date;
  endDate: Date;
  selectedCategoryIds: string[];

  // Step 4: Image
  coverUri: string | null;

  // Step 5: Payment
  paymentReference: string;
}

export interface PromotionWizardErrors {
  businessId?: string;
  title?: string;
  description?: string;
  scope?: string;
  discountType?: string;
  discountValue?: string;
  selectedProductIds?: string;
  startDate?: string;
  endDate?: string;
  selectedCategoryIds?: string;
  coverUri?: string;
  paymentReference?: string;
}

export const WIZARD_STEPS = [
  { id: 'business' as const, title: 'Selecciona tu Negocio', description: 'Elige el negocio para tu promoción' },
  { id: 'info' as const, title: 'Información Básica', description: 'Escribe el título y descripción de tu promoción' },
  { id: 'discount' as const, title: 'Configura el Descuento', description: 'Define el tipo y valor del descuento' },
  { id: 'dates' as const, title: 'Vigencia y Categorías', description: 'Establece cuándo estará activa' },
  { id: 'image' as const, title: 'Imagen', description: 'Sube una imagen atractiva' },
  { id: 'payment' as const, title: 'Pago', description: 'Ingresa la referencia SINPE' },
] as const;

export type WizardStepId = 'business' | 'info' | 'discount' | 'dates' | 'image' | 'payment';

// ============================================
// Database Record Types (for service layer mapping)
// ============================================
export interface PromotionRecord {
  id_prm: string;
  business_id_prm: string;
  created_by_prm: string;
  scope_prm: string;
  title_prm: string;
  description_prm: string | null;
  discount_type_prm: string;
  discount_value_prm: number;
  start_at_prm: string;
  end_at_prm: string;
  moderation_status_prm: string;
  reviewed_by_prm: string | null;
  reviewed_at_prm: string | null;
  moderation_note_prm: string | null;
  payment_state_prm: string;
  payment_reference_prm: string | null;
  payment_note_prm: string | null;
  created_at_prm: string;
  updated_at_prm: string;
  businesses?: {
    id_bus: string;
    name_bus: string;
  } | null;
  promotion_images?: {
    image_type_pim: string;
    bucket_pim: string;
    path_pim: string;
  }[] | null;
  promotion_category_map?: {
    categories: {
      id_cat: string;
      name_cat: string;
    } | null;
  }[];
}
