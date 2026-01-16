import { supabase } from '@/lib/supabase/client';
import { ProductListItem } from '@/types/entities/product';

/**
 * Obtiene los productos de un negocio específico
 */
export async function getBusinessProducts(businessId: string): Promise<ProductListItem[]> {
    try {
        console.log('[PRODUCTS] Fetching products for business:', businessId);

        // Obtener productos
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('business_id_prd', businessId)
            .order('created_at_prd', { ascending: false });

        if (productsError) {
            console.error('[PRODUCTS] Error fetching products:', productsError);
            throw productsError;
        }

        if (!products || products.length === 0) {
            console.log('[PRODUCTS] No products found');
            return [];
        }

        // Obtener IDs de productos
        const productIds = products.map((p: any) => p.id_prd);

        // Obtener categorías de productos
        const { data: categoryMaps, error: categoryError } = await supabase
            .from('product_category_map')
            .select(`
                product_id_pcm,
                categories!product_category_map_category_id_pcm_fkey (
                    id_CAT,
                    name_CAT
                )
            `)
            .in('product_id_pcm', productIds);

        if (categoryError) {
            console.error('[PRODUCTS] Error fetching categories:', categoryError);
        }

        // Obtener imágenes principales
        const { data: images, error: imagesError } = await supabase
            .from('product_images')
            .select('*')
            .in('product_id_pim', productIds)
            .eq('image_type_pim', 'main')
            .order('sort_order_pim', { ascending: true });

        if (imagesError) {
            console.error('[PRODUCTS] Error fetching images:', imagesError);
        }

        // Mapear productos con sus relaciones
        const result: ProductListItem[] = products.map((product: any) => {
            // Categorías del producto
            const productCategories = (categoryMaps || [])
                .filter((cm: any) => cm.product_id_pcm === product.id_prd)
                .map((cm: any) => cm.categories);

            const categoryNames = productCategories.map((cat: any) => cat?.name_CAT || '').filter(Boolean);
            const categoryIds = productCategories.map((cat: any) => cat?.id_CAT || '').filter(Boolean);

            // Imagen principal
            const mainImage = (images || []).find((img: any) => img.product_id_pim === product.id_prd);
            const imageUrl = mainImage
                ? getImageUrl(mainImage.bucket_pim, mainImage.path_pim)
                : null;

            return {
                id: product.id_prd,
                name: product.name_prd,
                description: product.description_prd,
                price: product.price_prd,
                currency: product.currency_prd || 'CRC',
                categoryNames,
                categoryIds,
                imageUrl,
                isActive: product.is_active_prd,
            };
        });

        console.log('[PRODUCTS] Mapped products:', result.length);
        return result;
    } catch (error) {
        console.error('[PRODUCTS] getBusinessProducts error:', error);
        throw error;
    }
}

/**
 * Elimina un producto
 */
export async function deleteProduct(productId: string, businessId: string): Promise<void> {
    try {
        console.log('[PRODUCTS] Deleting product:', productId);

        // Verificar que el producto pertenece al negocio
        const { data: product, error: checkError } = await supabase
            .from('products')
            .select('business_id_prd')
            .eq('id_prd', productId)
            .single();

        if (checkError) {
            console.error('[PRODUCTS] Error checking product ownership:', checkError);
            throw new Error('No se pudo verificar el producto');
        }

        if (product.business_id_prd !== businessId) {
            throw new Error('No tienes permisos para eliminar este producto');
        }

        // Eliminar imágenes del storage
        const { data: images } = await supabase
            .from('product_images')
            .select('bucket_pim, path_pim')
            .eq('product_id_pim', productId);

        if (images && images.length > 0) {
            for (const img of images) {
                await supabase.storage.from(img.bucket_pim).remove([img.path_pim]);
            }
        }

        // Eliminar producto (cascade eliminará relaciones)
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .eq('id_prd', productId);

        if (deleteError) {
            console.error('[PRODUCTS] Error deleting product:', deleteError);
            throw deleteError;
        }

        console.log('[PRODUCTS] Product deleted successfully');
    } catch (error) {
        console.error('[PRODUCTS] deleteProduct error:', error);
        throw error;
    }
}

function getImageUrl(bucket: string, filePath: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
}

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

async function uploadProductImage(
    productId: string,
    imageUri: string,
    imageType: 'main' | 'secondary',
    sortOrder: number
): Promise<string> {
    try {
        console.log('[PRODUCTS] Uploading image:', imageType, sortOrder);

        const fileName = `${productId}_${imageType}_${sortOrder}_${Date.now()}.jpg`;
        const filePath = `${productId}/${fileName}`;

        // Convertir URI a blob
        const response = await fetch(imageUri);
        const blob = await response.blob();

        // Subir imagen
        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, blob, {
                contentType: 'image/jpeg',
                upsert: false,
            });

        if (uploadError) {
            console.error('[PRODUCTS] Upload error:', uploadError);
            throw uploadError;
        }

        // Insertar registro en product_images
        const { error: insertError } = await supabase.from('product_images').insert({
            id_pim: generateUUID(),
            product_id_pim: productId,
            image_type_pim: imageType,
            bucket_pim: 'product-images',
            path_pim: filePath,
            sort_order_pim: sortOrder,
        });

        if (insertError) {
            console.error('[PRODUCTS] Insert error:', insertError);
            // Eliminar imagen del storage si falla la inserción
            await supabase.storage.from('product-images').remove([filePath]);
            throw insertError;
        }

        console.log('[PRODUCTS] Image uploaded successfully:', filePath);
        return filePath;
    } catch (error) {
        console.error('[PRODUCTS] uploadProductImage error:', error);
        throw error;
    }
}

/**
 * Crea un nuevo producto con toda su información
 */
export async function createProductComplete(
    businessId: string,
    data: {
        name: string;
        description?: string;
        price: number;
        currency: string;
        categoryIds: string[];
        images: string[];
    }
): Promise<string> {
    try {
        console.log('[PRODUCTS] Creating product:', data.name);

        const productId = generateUUID();

        // 1. Crear producto
        const productData = {
            id_prd: productId,
            business_id_prd: businessId,
            name_prd: data.name,
            description_prd: data.description || null,
            price_prd: data.price,
            currency_prd: data.currency,
            is_active_prd: true,
        };

        console.log('[PRODUCTS] Inserting product data:', productData);

        const { error: productError } = await supabase.from('products').insert(productData);

        if (productError) {
            console.error('[PRODUCTS] Error creating product:', productError);
            throw productError;
        }

        // 2. Insertar categorías
        if (data.categoryIds.length > 0) {
            const categoryMaps = data.categoryIds.map((catId) => ({
                product_id_pcm: productId,
                category_id_pcm: catId,
            }));

            const { error: categoryError } = await supabase
                .from('product_category_map')
                .insert(categoryMaps);

            if (categoryError) {
                console.error('[PRODUCTS] Error inserting categories:', categoryError);
                // Continuar aunque falle
            }
        }

        // 3. Subir imágenes
        if (data.images.length > 0) {
            for (let i = 0; i < data.images.length; i++) {
                const imageUri = data.images[i];
                const imageType = i === 0 ? 'main' : 'secondary';
                try {
                    await uploadProductImage(productId, imageUri, imageType, i);
                } catch (error) {
                    console.error(`[PRODUCTS] Error uploading image ${i}:`, error);
                    // Continuar con otras imágenes
                }
            }
        }

        console.log('[PRODUCTS] Product created successfully:', productId);
        return productId;
    } catch (error) {
        console.error('[PRODUCTS] createProductComplete error:', error);
        throw error;
    }
}
