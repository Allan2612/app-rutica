// ============================================
// Category System - Tabla central compartida
// ============================================

/**
 * Categoría del sistema - Tabla: categories (cat)
 * 
 * Esta tabla es compartida por todas las entidades:
 * - Business (via business_category_map)
 * - Events (via event_category_map)
 * - Attractions (via attraction_category_map)
 * - Products (via product_category_map)
 * - Promotions (via promotion_category_map)
 */
export interface Category {
  id_cat: string;
  name_cat: string;
  created_at_cat: string;
  parent_id_cat: string | null;
  icon_cat: string | null;
  sort_order_cat: number;
  is_active_cat: boolean;
}

// ============================================
// Category Maps (Many-to-Many relations)
// ============================================

export interface BusinessCategoryMap {
  business_id_bcm: string;
  category_id_bcm: string;
}

export interface EventCategoryMap {
  event_id_ecm: string;
  category_id_ecm: string;
}

export interface AttractionCategoryMap {
  attraction_id_acm: string;
  category_id_acm: string;
}

export interface ProductCategoryMap {
  product_id_pcm: string;
  category_id_pcm: string;
}

export interface PromotionCategoryMap {
  promotion_id_pcr: string;
  category_id_pcr: string;
}

// ============================================
// UI Helper Types
// ============================================

/**
 * Formato simplificado para uso en componentes/UI
 */
export interface CategoryOption {
  id: string;
  name: string;
  parentId?: string | null;
}

/**
 * Categoría jerárquica para el modal de filtros
 */
export interface HierarchicalCategoryOption {
  id: string;
  name: string;
  parentId: string | null;
}

// ============================================
// Helpers
// ============================================

/**
 * Convierte Category (BD) a CategoryOption (UI)
 */
export function categoryToOption(category: Category): CategoryOption {
  return {
    id: category.id_cat,
    name: category.name_cat,
  };
}

/**
 * Convierte array de Categories a CategoryOptions
 */
export function categoriesToOptions(categories: Category[]): CategoryOption[] {
  return categories.map(categoryToOption);
}

/**
 * Obtiene nombres de categorías como string separado por comas
 */
export function getCategoryNames(categories: Category[] | undefined): string {
  if (!categories?.length) return '';
  return categories.map(c => c.name_cat).join(', ');
}

/**
 * Obtiene IDs de categorías
 */
export function getCategoryIds(categories: Category[] | undefined): string[] {
  if (!categories?.length) return [];
  return categories.map(c => c.id_cat);
}

