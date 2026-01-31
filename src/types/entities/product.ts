import { Business } from './business';
import { Category } from './category';

// ============================================
// Product - Tabla: products (prd)
// ============================================

/**
 * Producto - Row type
 */
export interface Product {
  id_prd: string;
  business_id_prd: string | null;
  name_prd: string | null;
  description_prd: string | null;
  price_prd: number | null;
  currency_prd: string | null;
  is_active_prd: boolean;
  avg_rating_prd: number;
  reviews_count_prd: number;
  created_at_prd: string;
  updated_at_prd: string;
}

/**
 * Imagen de producto - Tabla: product_images (pim)
 * Path format: <product_id>/<prefix>-<uuid>.ext
 * Prefijos válidos: main, secondary
 */
export interface ProductImage {
  id_pim: string;
  product_id_pim: string;
  path_pim: string;
  sort_order_pim: number | null;
  created_at_pim: string;
}

/**
 * Producto con relaciones
 */
export interface ProductWithRelations extends Product {
  business?: Business | null;
  images?: ProductImage[];
  categories?: Category[];
}

// ============================================
// Insert/Update Types
// ============================================

export interface ProductInsert {
  business_id_prd: string;
  name_prd: string;
  description_prd?: string | null;
  price_prd: number;
  currency_prd?: string; // default 'CRC'
  is_active_prd?: boolean; // default true
}

export interface ProductUpdate {
  name_prd?: string;
  description_prd?: string | null;
  price_prd?: number;
  currency_prd?: string;
  is_active_prd?: boolean;
}

export interface ProductImageInsert {
  product_id_pim: string;
  path_pim: string;
  sort_order_pim?: number | null;
}

// ============================================
// UI Types (para listados y formularios)
// ============================================

/**
 * Item de lista de productos
 */
export interface ProductListItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  categoryNames: string[];
  categoryIds: string[];
  mainImageUrl: string | null;
  imageUrls: string[];
  isActive: boolean;
  rating: number;
  reviewCount: number;
}

/**
 * Datos para edición de producto
 */
export interface ProductDetailForEdit {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  categoryIds: string[];
  mainImageUrl: string | null;
  secondaryImageUrls: string[];
}

/**
 * Datos para crear/actualizar producto desde formulario
 */
export interface ProductFormData {
  name: string;
  description: string | null;
  price: number;
  currency: string;
  categoryIds: string[];
  mainImageUri?: string | null;
  secondaryImageUris?: string[];
}

// ============================================
// Helpers
// ============================================

/**
 * Extrae la URL de la imagen principal de las imágenes
 */
export function getProductMainImageUrl(images: ProductImage[] | undefined, baseUrl: string): string | null {
  const main = images?.find(img => img.path_pim.includes('/main-'));
  return main ? `${baseUrl}/${main.path_pim}` : null;
}

/**
 * Extrae las URLs de imágenes secundarias ordenadas
 */
export function getProductSecondaryImageUrls(images: ProductImage[] | undefined, baseUrl: string): string[] {
  if (!images) return [];
  return images
    .filter(img => img.path_pim.includes('/secondary-'))
    .sort((a, b) => (a.sort_order_pim ?? 0) - (b.sort_order_pim ?? 0))
    .map(img => `${baseUrl}/${img.path_pim}`);
}

/**
 * Extrae todas las URLs de imágenes ordenadas (main primero, luego secondary)
 */
export function getAllProductImageUrls(images: ProductImage[] | undefined, baseUrl: string): string[] {
  const mainUrl = getProductMainImageUrl(images, baseUrl);
  const secondaryUrls = getProductSecondaryImageUrls(images, baseUrl);
  return mainUrl ? [mainUrl, ...secondaryUrls] : secondaryUrls;
}
