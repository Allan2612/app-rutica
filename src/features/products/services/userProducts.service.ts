import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import { ProductListItem } from '@/types/entities/product';

const BUCKET_NAME = 'product-images';

/**
 * Obtiene los productos de un negocio específico
 */
export async function getBusinessProducts(businessId: string): Promise<ProductListItem[]> {
    try {
        // Obtener productos
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('business_id_prd', businessId)
            .order('created_at_prd', { ascending: false });

        if (productsError) {
            throw productsError;
        }

        if (!products || products.length === 0) {
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
                    id_cat,
                    name_cat
                )
            `)
            .in('product_id_pcm', productIds);

        if (categoryError) {
            // Error fetching categories
        }

        // Obtener todas las imágenes (main y gallery)
        const { data: images, error: imagesError } = await supabase
            .from('product_images')
            .select('product_id_pim, path_pim, sort_order_pim')
            .in('product_id_pim', productIds)
            .order('sort_order_pim', { ascending: true });

        if (imagesError) {
            // Error fetching images
        }

        // Mapear productos con sus relaciones
        const result: ProductListItem[] = products.map((product: any) => {
            // Categorías del producto
            const productCategories = (categoryMaps || [])
                .filter((cm: any) => cm.product_id_pcm === product.id_prd)
                .map((cm: any) => cm.categories);

            const categoryNames = productCategories.map((cat: any) => cat?.name_cat || '').filter(Boolean);
            const categoryIds = productCategories.map((cat: any) => cat?.id_cat || '').filter(Boolean);

            // Todas las imágenes del producto
            const productImages = (images || []).filter((img: any) => img.product_id_pim === product.id_prd);
            const imageUrls = productImages.map((img: any) => getImageUrl(BUCKET_NAME, img.path_pim));
            const mainImageUrl = imageUrls.length > 0 ? imageUrls[0] : null;

            return {
                id: product.id_prd,
                name: product.name_prd,
                description: product.description_prd,
                price: product.price_prd,
                currency: product.currency_prd || 'CRC',
                categoryNames,
                categoryIds,
                mainImageUrl,
                imageUrls,
                isActive: product.is_active_prd,
            };
        });

        return result;
    } catch (error) {
        throw error;
    }
}

/**
 * Obtiene un producto específico con todas sus relaciones
 */
export async function getProduct(productId: string): Promise<any> {
    try {
        // Obtener producto
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id_prd', productId)
            .single();

        if (productError) {
            throw productError;
        }

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        // Obtener categorías
        const { data: categoryMaps, error: categoryError } = await supabase
            .from('product_category_map')
            .select(`
                product_id_pcm,
                categories!product_category_map_category_id_pcm_fkey (
                    id_cat,
                    name_cat
                )
            `)
            .eq('product_id_pcm', productId);

        if (categoryError) {
            // Error fetching categories
        }

        // Obtener imágenes
        const { data: images, error: imagesError } = await supabase
            .from('product_images')
            .select('path_pim, sort_order_pim')
            .eq('product_id_pim', productId)
            .order('sort_order_pim', { ascending: true });

        if (imagesError) {
            // Error fetching images
        }

        // Mapear categorías
        const categoryNames = (categoryMaps || [])
            .map((cm: any) => cm.categories?.name_cat)
            .filter(Boolean);
        const categoryIds = (categoryMaps || [])
            .map((cm: any) => cm.categories?.id_cat)
            .filter(Boolean);

        // Mapear imágenes
        const imageUrls = (images || []).map((img: any) =>
            getImageUrl(BUCKET_NAME, img.path_pim)
        );

        const result = {
            id: (product as any).id_prd,
            businessId: (product as any).business_id_prd,
            name: (product as any).name_prd,
            description: (product as any).description_prd,
            price: (product as any).price_prd,
            currency: (product as any).currency_prd || 'CRC',
            categoryNames,
            categoryIds,
            images: imageUrls,
            isActive: (product as any).is_active_prd,
        };

        return result;
    } catch (error) {
        throw error;
    }
}

/**
 * Actualiza un producto existente
 */
export async function updateProduct(
    productId: string,
    businessId: string,
    data: {
        name: string;
        description?: string;
        price: number;
        currency: string;
        categoryIds: string[];
        images: string[];
    }
): Promise<void> {
    try {
        // Verificar propiedad del producto
        const { data: product, error: checkError } = await (supabase as any)
            .from('products')
            .select('business_id_prd')
            .eq('id_prd', productId)
            .single();

        if (checkError) {
            throw new Error('No se pudo verificar el producto');
        }

        if (product.business_id_prd !== businessId) {
            throw new Error('No tienes permisos para editar este producto');
        }

        // 1. Actualizar datos del producto
        const { error: updateError } = await (supabase as any)
            .from('products')
            .update({
                name_prd: data.name,
                description_prd: data.description || null,
                price_prd: data.price,
                currency_prd: data.currency,
            })
            .eq('id_prd', productId);

        if (updateError) {
            throw updateError;
        }

        // 2. Actualizar categorías
        // Eliminar categorías existentes
        await supabase.from('product_category_map').delete().eq('product_id_pcm', productId);

        // Insertar nuevas categorías
        if (data.categoryIds.length > 0) {
            const categoryMaps = data.categoryIds.map((catId) => ({
                product_id_pcm: productId,
                category_id_pcm: catId,
            }));

            const { error: categoryError } = await (supabase as any)
                .from('product_category_map')
                .insert(categoryMaps);

            if (categoryError) {
                // Error updating categories
            }
        }

        // 3. Actualizar imágenes
        // Obtener imágenes existentes
        const { data: existingImages } = await supabase
            .from('product_images')
            .select('id_pim, path_pim')
            .eq('product_id_pim', productId);

        const existingUrls = (existingImages || []).map((img: any) =>
            getImageUrl(BUCKET_NAME, img.path_pim)
        );

        // Eliminar imágenes que ya no están
        for (const img of (existingImages as any) || []) {
            const imageUrl = getImageUrl(BUCKET_NAME, img.path_pim);
            if (!data.images.includes(imageUrl)) {
                await supabase.storage.from(BUCKET_NAME).remove([img.path_pim]);
                await supabase.from('product_images').delete().eq('id_pim', img.id_pim);
            }
        }

        // Subir nuevas imágenes
        for (let i = 0; i < data.images.length; i++) {
            const imageUri = data.images[i];
            // Si la imagen es nueva (no está en existingUrls)
            if (!existingUrls.includes(imageUri)) {
                const imageType = i === 0 ? 'main' : 'secondary';
                try {
                    await uploadProductImage(productId, imageUri, imageType, i);
                } catch (error) {
                    // Error uploading image
                }
            }
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Elimina un producto
 */
export async function deleteProduct(productId: string, businessId: string): Promise<void> {
    try {
        // Verificar que el producto pertenece al negocio
        const { data: product, error: checkError } = await (supabase as any)
            .from('products')
            .select('business_id_prd')
            .eq('id_prd', productId)
            .single();

        if (checkError) {
            throw new Error('No se pudo verificar el producto');
        }

        if (product.business_id_prd !== businessId) {
            throw new Error('No tienes permisos para eliminar este producto');
        }

        // Eliminar imágenes del storage
        const { data: images } = await supabase
            .from('product_images')
            .select('path_pim')
            .eq('product_id_pim', productId);

        if (images && images.length > 0) {
            for (const img of images as any) {
                await supabase.storage.from(BUCKET_NAME).remove([img.path_pim]);
            }
        }

        // Eliminar producto (cascade eliminará relaciones)
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .eq('id_prd', productId);

        if (deleteError) {
            throw deleteError;
        }
    } catch (error) {
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
        // Filename includes type prefix: main-* or secondary-*
        const fileName = `${imageType}-${Date.now()}_${sortOrder}.jpg`;
        const filePath = `${productId}/${fileName}`;

        // Convertir URI a blob
        const response = await fetch(imageUri);
        const blob = await response.blob();

        // Subir imagen
        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, blob, {
                contentType: 'image/jpeg',
                upsert: false,
            });

        if (uploadError) {
            throw uploadError;
        }

        // Insertar registro en product_images
        const { error: insertError } = await (supabase as any).from('product_images').insert({
            id_pim: generateUUID(),
            product_id_pim: productId,
            path_pim: filePath,
            sort_order_pim: sortOrder,
        });

        if (insertError) {
            // Eliminar imagen del storage si falla la inserción
            await supabase.storage.from(BUCKET_NAME).remove([filePath]);
            throw insertError;
        }

        return filePath;
    } catch (error) {
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

        const { error: productError } = await (supabase as any).from('products').insert(productData);

        if (productError) {
            throw productError;
        }

        // 2. Insertar categorías
        if (data.categoryIds.length > 0) {
            const categoryMaps = data.categoryIds.map((catId) => ({
                product_id_pcm: productId,
                category_id_pcm: catId,
            }));

            const { error: categoryError } = await (supabase as any)
                .from('product_category_map')
                .insert(categoryMaps);

            if (categoryError) {
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
                    // Continuar con otras imágenes
                }
            }
        }

        return productId;
    } catch (error) {
        throw error;
    }
}
