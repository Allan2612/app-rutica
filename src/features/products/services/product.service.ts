import { supabase } from '../../../lib/supabase/client';
import { Product, ProductCategory, ProductWithRelations } from '../../../types/entities';

// Función para generar UUID v4
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface CreateProductInput {
  businessId: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  productCategoryId?: string;
}

export interface CreateProductCategoryInput {
  name: string;
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('name_PCA', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createProductCategory(input: CreateProductCategoryInput): Promise<ProductCategory> {
  const id = generateUUID();

  const { error, data } = await supabase
    .from('product_categories')
    .insert({
      id_PCA: id,
      name_PCA: input.name,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const id = generateUUID();

  // Crear el producto
  const { error: productError, data: productData } = await supabase
    .from('products')
    .insert({
      id_PRD: id,
      business_id_PRD: input.businessId,
      name_PRD: input.name,
      description_PRD: input.description ?? null,
      price_PRD: input.price,
      currency_PRD: input.currency ?? 'CRC',
      is_active_PRD: true,
    })
    .select()
    .single();

  if (productError) throw productError;

  // Mapear la categoría si existe
  if (input.productCategoryId) {
    const { error: mapError } = await supabase
      .from('product_category_map')
      .insert({
        product_id_PCM: id,
        category_id_PCM: input.productCategoryId,
      });

    if (mapError) throw mapError;
  }

  return productData;
}

export async function uploadProductImage(file: any, productId: string): Promise<string> {
  const filename = `${productId}/${Date.now()}-${Math.random().toString(36).substring(7)}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filename, file);

  if (error) throw error;
  return filename;
}

export async function saveProductImage(productId: string, path: string) {
  const id = generateUUID();

  console.log('[SAVE IMAGE] Attempting to save:', {
    id_PIM: id,
    product_id_PIM: productId,
    path_PIM: path,
    bucket_PIM: 'product-images',
    sort_order_PIM: 0,
  });

  const { error, data } = await supabase
    .from('product_images')
    .insert({
      id_PIM: id,
      product_id_PIM: productId,
      path_PIM: path,
      bucket_PIM: 'product-images',
      sort_order_PIM: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('[SAVE IMAGE ERROR]', JSON.stringify(error, null, 2));
    throw error;
  }
  console.log('[SAVE IMAGE SUCCESS]', data);
  return data;
}

export async function getProductsByBusinessId(businessId: string): Promise<ProductWithRelations[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images (*)
    `)
    .eq('business_id_PRD', businessId)
    .order('created_at_PRD', { ascending: false });

  if (error) throw error;
  return data as any;
}

export async function getProductById(productId: string): Promise<ProductWithRelations> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images (*),
      businesses (
        id_BUS,
        name_BUS
      )
    `)
    .eq('id_PRD', productId)
    .single();

  if (error) throw error;
  return data as any;
}

export async function updateProduct(productId: string, updates: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id_PRD', productId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(productId: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id_PRD', productId);

  if (error) throw error;
}
