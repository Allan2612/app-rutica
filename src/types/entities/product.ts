import { Business } from './business';
import { Category } from './category';

export interface Product {
  id_prd: string;
  business_id_prd: string;
  name_prd: string;
  description_prd: string | null;
  price_prd: number;
  currency_prd: string;
  is_active_prd: boolean;
  created_at_prd: string;
  updated_at_prd: string;
}

export interface ProductWithRelations extends Product {
  business?: Business;
  images?: ProductImage[];
  categories?: Category[];  // Cambiado: usa Category unificado
}

export interface ProductImage {
  id_pim: string;
  product_id_pim: string;
  bucket_pim: string;
  path_pim: string;
  sort_order_pim: number;
  created_at_pim: string;
}

export interface ProductCategoryMap {
  product_id_pcm: string;
  category_id_pcm: string;
}

export interface ProductInsert extends Omit<Product, 'id_prd' | 'created_at_prd' | 'updated_at_prd' | 'currency_prd' | 'is_active_prd'> {
  id_prd?: string;
  currency_prd?: string;
  is_active_prd?: boolean;
}

export interface ProductUpdate extends Partial<Omit<Product, 'id_prd' | 'business_id_prd' | 'created_at_prd'>> { }

export interface ProductImageInsert extends Omit<ProductImage, 'id_pim' | 'created_at_pim'> {
  id_pim?: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  categoryNames: string[];
  categoryIds: string[];
  imageUrl: string | null;
  isActive: boolean;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  categoryIds: string[];
  mainImage: string | null;
  secondaryImages: string[];
}

export interface UpdateProductData extends CreateProductData { }
