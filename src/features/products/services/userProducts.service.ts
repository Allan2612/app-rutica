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
            .eq('business_id_PRD', businessId)
            .order('created_at_PRD', { ascending: false });

        if (productsError) {
            console.error('[PRODUCTS] Error fetching products:', productsError);
            throw productsError;
        }

        if (!products || products.length === 0) {
            console.log('[PRODUCTS] No products found');
            return [];
        }

        // Obtener IDs de productos
        const productIds = products.map((p: any) => p.id_PRD);

        // Obtener categorías de productos
        const { data: categoryMaps, error: categoryError } = await supabase
            .from('product_category_map')
            .select(`
                product_id_PCM,
                categories!product_category_map_category_id_PCM_fkey (
                    id_CAT,
                    name_CAT
                )
            `)
            .in('product_id_PCM', productIds);

        if (categoryError) {
            console.error('[PRODUCTS] Error fetching categories:', categoryError);
        }

        // Obtener imágenes principales
        const { data: images, error: imagesError } = await supabase
            .from('product_images')
            .select('*')
            .in('product_id_PIM', productIds)
            .eq('image_type_PIM', 'main')
            .order('sort_order_PIM', { ascending: true });

        if (imagesError) {
            console.error('[PRODUCTS] Error fetching images:', imagesError);
        }

        // Mapear productos con sus relaciones
        const result: ProductListItem[] = products.map((product: any) => {
            // Categorías del producto
            const productCategories = (categoryMaps || [])
                .filter((cm: any) => cm.product_id_PCM === product.id_PRD)
                .map((cm: any) => cm.categories);

            const categoryNames = productCategories.map((cat: any) => cat?.name_CAT || '').filter(Boolean);
            const categoryIds = productCategories.map((cat: any) => cat?.id_CAT || '').filter(Boolean);

            // Imagen principal
            const mainImage = (images || []).find((img: any) => img.product_id_PIM === product.id_PRD);
            const imageUrl = mainImage
                ? getImageUrl(mainImage.bucket_PIM, mainImage.path_PIM)
                : null;

            return {
                id: product.id_PRD,
                name: product.name_PRD,
                description: product.description_PRD,
                price: product.price_PRD,
                currency: product.currency_PRD || 'CRC',
                categoryNames,
                categoryIds,
                imageUrl,
                isActive: product.is_active_PRD,
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
            .select('business_id_PRD')
            .eq('id_PRD', productId)
            .single();

        if (checkError) {
            console.error('[PRODUCTS] Error checking product ownership:', checkError);
            throw new Error('No se pudo verificar el producto');
        }

        if (product.business_id_PRD !== businessId) {
            throw new Error('No tienes permisos para eliminar este producto');
        }

        // Eliminar imágenes del storage
        const { data: images } = await supabase
            .from('product_images')
            .select('bucket_PIM, path_PIM')
            .eq('product_id_PIM', productId);

        if (images && images.length > 0) {
            for (const img of images) {
                await supabase.storage.from(img.bucket_PIM).remove([img.path_PIM]);
            }
        }

        // Eliminar producto (cascade eliminará relaciones)
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .eq('id_PRD', productId);

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
