import { PromotionScope, DiscountType, ModerationStatus } from '@/types/enums';
import { Business } from './business';
import { Product } from './product';
import { Profile } from './profile';
import { Category } from './category';

// ============================================
// Promotion - Tabla: promotions (prm)
// ============================================

/**
 * Promoción - Row type
 */
export interface Promotion {
  id_prm: string;
  business_id_prm: string | null;
  created_by_prm: string | null;
  scope_prm: PromotionScope | null;
  title_prm: string | null;
  description_prm: string | null;
  discount_type_prm: DiscountType | null;
  discount_value_prm: number;
  start_at_prm: string | null;
  end_at_prm: string | null;
  moderation_status_prm: ModerationStatus | null;
  reviewed_by_prm: string | null;
  reviewed_at_prm: string | null;
  moderation_note_prm: string | null;
  is_active_prm: boolean;
  created_at_prm: string;
  updated_at_prm: string;
}

/**
 * Imagen de promoción - Tabla: promotion_images (pim)
 * Path format: <promotion_id>/<prefix>-<uuid>.ext
 * Prefijos válidos: flyer
 */
export interface PromotionImage {
  id_pim: string;
  promotion_id_pim: string;
  path_pim: string;
  created_at_pim: string;
}

/**
 * Mapeo promoción-producto - Tabla: promotion_products (ppr)
 */
export interface PromotionProduct {
  promotion_id_ppr: string;
  product_id_ppr: string;
}

/**
 * Mapeo promoción-categorías de scope - Tabla: promotion_scope_categories (psc)
 * Cuando scope='categories', estas son las categorías de productos a las que aplica
 */
export interface PromotionScopeCategory {
  promotion_id_psc: string;
  category_id_psc: string;
  created_at_psc: string;
}

/**
 * Item de combo - Tabla: promotion_combo_items (pci)
 */
export interface PromotionComboItem {
  id_pci: string;
  promotion_id_pci: string;
  product_id_pci: string;
  quantity_pci: number;
  paid_quantity_pci: number | null; // Para 2x1, 3x2, etc.
  created_at_pci: string;
}

/**
 * Promoción con relaciones
 */
export interface PromotionWithRelations extends Promotion {
  business?: Business | null;
  created_by?: Profile | null;
  reviewed_by?: Profile | null;
  products?: Product[];
  categories?: Category[]; // Categorías para filtrado de la promoción
  scope_categories?: Category[]; // Categorías de productos aplicables (cuando scope='categories')
  images?: PromotionImage[];
  combo_items?: PromotionComboItem[];
}

// ============================================
// Insert/Update Types
// ============================================

export interface PromotionInsert {
  business_id_prm: string;
  created_by_prm: string;
  scope_prm: PromotionScope;
  title_prm: string;
  description_prm?: string | null;
  discount_type_prm?: DiscountType; // default 'percentage'
  discount_value_prm?: number; // default 0
  start_at_prm: string;
  end_at_prm: string;
  // moderation_status_prm se setea a 'pending'
}

export interface PromotionUpdate {
  scope_prm?: PromotionScope;
  title_prm?: string;
  description_prm?: string | null;
  discount_type_prm?: DiscountType;
  discount_value_prm?: number;
  start_at_prm?: string;
  end_at_prm?: string;
  // Campos de moderación solo editables por admin
}

export interface PromotionImageInsert {
  promotion_id_pim: string;
  path_pim: string;
}

export interface PromotionProductInsert {
  promotion_id_ppr: string;
  product_id_ppr: string;
}

export interface PromotionScopeCategoryInsert {
  promotion_id_psc: string;
  category_id_psc: string;
}

export interface PromotionComboItemInsert {
  promotion_id_pci: string;
  product_id_pci: string;
  quantity_pci: number;
  paid_quantity_pci?: number | null;
}

// ============================================
// UI Types (para listados y formularios)
// ============================================

/**
 * Item de lista de promociones
 */
export interface PromotionListItem {
  id: string;
  title: string;
  description: string | null;
  scope: PromotionScope;
  discountType: DiscountType;
  discountValue: number;
  startAt: string | null;
  endAt: string | null;
  moderationStatus: ModerationStatus;
  businessId: string;
  businessName: string | null;
  coverUrl: string | null;
  imageUrl?: string | null; // Alias para compatibilidad con UserPromotionCard
  categoryNames: string[];
  productIds: string[];
  scopeCategoryIds: string[];
  comboItems: ComboItemData[];
  isActive: boolean;
  createdAt: string;
}

/**
 * Datos para edición de promoción
 */
export interface PromotionDetailForEdit {
  id: string;
  businessId: string;
  scope: PromotionScope;
  title: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  startAt: string | null;
  endAt: string | null;
  categoryIds: string[];
  productIds: string[];
  scopeCategoryIds: string[];
  comboItems: ComboItemData[];
  coverUrl: string | null;
  galleryUrls: string[];
}

/**
 * Datos para crear/actualizar promoción desde formulario
 */
export interface PromotionFormData {
  businessId: string;
  scope: PromotionScope;
  title: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  startAt: string;
  endAt: string;
  categoryIds: string[];
  productIds: string[];
  scopeCategoryIds: string[];
  comboItems: ComboItemData[];
  coverUri?: string | null;
  galleryUris?: string[];
}

// ============================================
// Combo Item Data | null; // Para 2x1 (quantity=2, paidQuantity=1), 3x2 (quantity=3, paidQuantity=2), etc.
// ============================================

export interface ComboItemData {
  productId: string;
  quantity: number;
  paidQuantity?: number;
}

// ============================================
// Wizard Types
// ============================================

export interface PromotionWizardFormData {
  // Step 1: Business + Basic Info
  businessId: string;
  title: string;
  description: string;
  scope: PromotionScope;

  // Step 2: Discount + Products/Categories/Combo
  discountType: DiscountType;
  discountValue: number;
  selectedProductIds: string[];
  scopeCategoryIds: string[];
  comboItems: ComboItemData[];

  // Step 3: Dates + Categories
  startDate: Date;
  endDate: Date;
  selectedCategoryIds: string[];

  // Step 4: Image
  coverUri: string | null;
}

export interface PromotionWizardErrors {
  businessId?: string;
  title?: string;
  description?: string;
  scope?: string;
  discountType?: string;
  discountValue?: string;
  selectedProductIds?: string;
  scopeCategoryIds?: string;
  comboItems?: string;
  startDate?: string;
  endDate?: string;
  selectedCategoryIds?: string;
  coverUri?: string;
}

export const WIZARD_STEPS = [
  { id: 'business' as const, title: 'Selecciona tu Negocio', description: 'Elige el negocio para tu promoción' },
  { id: 'info' as const, title: 'Información Básica', description: 'Escribe el título y descripción de tu promoción' },
  { id: 'discount' as const, title: 'Configura el Descuento', description: 'Define el tipo y valor del descuento' },
  { id: 'dates' as const, title: 'Vigencia y Categorías', description: 'Establece cuándo estará activa' },
  { id: 'image' as const, title: 'Imagen', description: 'Sube una imagen atractiva' },
] as const;

export type WizardStepId = 'business' | 'info' | 'discount' | 'dates' | 'image';

// ============================================
// Helpers
// ============================================

/**
 * Extrae la URL del flyer de las imágenes
 */
export function getPromotionCoverUrl(images: PromotionImage[] | undefined, baseUrl: string): string | null {
  const flyer = images?.find(img => img.path_pim.includes('/flyer-'));
  return flyer ? `${baseUrl}/${flyer.path_pim}` : null;
}

/**
 * Extrae todas las URLs de flyers (por si hay múltiples)
 */
export function getPromotionGalleryUrls(images: PromotionImage[] | undefined, baseUrl: string): string[] {
  if (!images) return [];
  return images
    .filter(img => img.path_pim.includes('/flyer-'))
    .map(img => `${baseUrl}/${img.path_pim}`);
}

/**
 * Verifica si una promoción está aprobada y activa
 */
export function isPromotionActive(promotion: Promotion): boolean {
  return (
    promotion.moderation_status_prm === 'approved' &&
    promotion.is_active_prm
  );
}

/**
 * Verifica si una promoción está vigente (fecha actual dentro del rango)
 */
export function isPromotionCurrent(promotion: Promotion): boolean {
  const now = new Date();
  const start = promotion.start_at_prm ? new Date(promotion.start_at_prm) : null;
  const end = promotion.end_at_prm ? new Date(promotion.end_at_prm) : null;
  if (!start || !end) return false;
  return start <= now && now <= end;
}

/**
 * Verifica si una promoción está visible públicamente (activa + vigente)
 */
export function isPromotionPublic(promotion: Promotion): boolean {
  return isPromotionActive(promotion) && isPromotionCurrent(promotion);
}

/**
 * Calcula el precio con descuento
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discountType: DiscountType,
  discountValue: number
): number {
  if (discountType === 'percentage') {
    return originalPrice * (1 - discountValue / 100);
  }
  return Math.max(0, originalPrice - discountValue);
}
