import { Business } from './business';

export interface ProductCategory {
  id_PCA: string;
  name_PCA: string;
}

export interface Product {
  id_PRD: string;
  business_id_PRD: string;
  name_PRD: string;
  description_PRD: string | null;
  price_PRD: number;
  currency_PRD: string;
  is_active_PRD: boolean;
  created_at_PRD: string;
  updated_at_PRD: string;
}

export interface ProductWithRelations extends Product {
  business?: Business;
  images?: ProductImage[];
  categories?: ProductCategory[];
}

export interface ProductImage {
  id_PIM: string;
  product_id_PIM: string;
  bucket_PIM: string;
  path_PIM: string;
  sort_order_PIM: number;
  created_at_PIM: string;
}

export interface ProductCategoryMap {
  product_id_PCM: string;
  category_id_PCM: string;
}

export interface ProductInsert extends Omit<Product, 'id_PRD' | 'created_at_PRD' | 'updated_at_PRD' | 'currency_PRD' | 'is_active_PRD'> {
  id_PRD?: string;
  currency_PRD?: string;
  is_active_PRD?: boolean;
}

export interface ProductUpdate extends Partial<Omit<Product, 'id_PRD' | 'business_id_PRD' | 'created_at_PRD'>> { }

export interface ProductImageInsert extends Omit<ProductImage, 'id_PIM' | 'created_at_PIM'> {
  id_PIM?: string;
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
