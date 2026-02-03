import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import type { AdminProductListItem, ProductsFilters, ProductsStats } from '@/types/entities/product';

/**
 * Verifica si el usuario actual es administrador
 */
async function isUserAdmin(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await (supabase
        .from('profiles')
        .select('role_prf, is_active_prf')
        .eq('id_prf', user.id)
        .single() as any);

    return profile?.role_prf === 'admin' && profile?.is_active_prf === true;
}

/**
 * Obtiene la URL pública de una imagen del storage
 */
function getImageUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

/**
 * Obtiene todos los productos con filtros para administradores
 */
export async function getAllProductsForAdmin(filters?: ProductsFilters): Promise<AdminProductListItem[]> {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
        throw new Error('No tienes permisos de administrador');
    }

    // Obtener todos los productos con información del negocio
    let query = supabase
        .from('products')
        .select(`
            id_prd,
            name_prd,
            description_prd,
            price_prd,
            currency_prd,
            is_active_prd,
            avg_rating_prd,
            reviews_count_prd,
            created_at_prd,
            business_id_prd,
            businesses!products_business_id_prd_fkey (
                name_bus,
                profiles!businesses_owner_id_bus_fkey (
                    first_name_prf,
                    last_name1_prf,
                    last_name2_prf
                )
            )
        `)
        .order('created_at_prd', { ascending: false });

    const { data: products, error: productsError } = await query;

    if (productsError) {
        console.error('[adminProducts] Error fetching products:', productsError);
        throw new Error(`Error al obtener productos: ${productsError.message}`);
    }

    if (!products || products.length === 0) {
        return [];
    }

    const productIds = products.map((p: any) => p.id_prd);

    // Obtener categorías
    const { data: categoryMaps } = await supabase
        .from('product_category_map')
        .select(`
            product_id_pcm,
            categories!product_category_map_category_id_pcm_fkey (
                id_cat,
                name_cat
            )
        `)
        .in('product_id_pcm', productIds);

    // Obtener imagen principal (sort_order_pim = 0)
    const { data: images } = await (supabase
        .from('product_images')
        .select('product_id_pim, path_pim')
        .in('product_id_pim', productIds)
        .eq('sort_order_pim', 0) as any);

    // Mapear productos
    let mappedProducts: AdminProductListItem[] = products.map((product: any) => {
        const business = product.businesses as any;
        const ownerProfile = business?.profiles as any;

        const productCategories = categoryMaps?.filter(
            (cm: any) => cm.product_id_pcm === product.id_prd
        ) || [];

        const productImage = images?.find(
            (img: any) => img.product_id_pim === product.id_prd
        );

        // Construir nombre completo del dueño
        const ownerName = ownerProfile
            ? [
                ownerProfile.first_name_prf,
                ownerProfile.last_name1_prf,
                ownerProfile.last_name2_prf,
            ]
                .filter(Boolean)
                .join(' ')
            : 'Desconocido';

        return {
            id: product.id_prd,
            name: product.name_prd,
            description: product.description_prd,
            price: product.price_prd,
            currency: product.currency_prd,
            isActive: product.is_active_prd,
            avgRating: product.avg_rating_prd,
            reviewsCount: product.reviews_count_prd,
            createdAt: product.created_at_prd,
            businessId: product.business_id_prd,
            businessName: business?.name_bus || 'Sin negocio',
            businessOwnerName: ownerName,
            categoryNames: productCategories.map((c: any) => c.categories.name_cat),
            categoryIds: productCategories.map((c: any) => c.categories.id_cat),
            mainImageUrl: productImage ? getImageUrl('product-images', productImage.path_pim) : null,
        };
    });

    // Aplicar filtros
    if (filters?.businessName) {
        const searchTerm = filters.businessName.toLowerCase();
        mappedProducts = mappedProducts.filter(p =>
            p.businessName.toLowerCase().includes(searchTerm)
        );
    }

    if (filters?.productName) {
        const searchTerm = filters.productName.toLowerCase();
        mappedProducts = mappedProducts.filter(p =>
            p.name.toLowerCase().includes(searchTerm)
        );
    }

    if (filters?.category) {
        mappedProducts = mappedProducts.filter(p =>
            p.categoryNames.some(cat => cat.toLowerCase().includes(filters.category!.toLowerCase()))
        );
    }

    if (filters?.minPrice !== undefined) {
        mappedProducts = mappedProducts.filter(p => p.price >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
        mappedProducts = mappedProducts.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters?.isActive !== undefined) {
        mappedProducts = mappedProducts.filter(p => p.isActive === filters.isActive);
    }

    if (filters?.minRating !== undefined && filters.minRating > 0) {
        mappedProducts = mappedProducts.filter(p => {
            if (p.avgRating === null) return false;
            return p.avgRating >= filters.minRating!;
        });
        // Ordenar por rating ascendente cuando hay filtro de rating
        mappedProducts.sort((a, b) => (a.avgRating || 0) - (b.avgRating || 0));
    }

    return mappedProducts;
}

/**
 * Obtiene estadísticas de productos para el admin
 */
export async function getProductsStats(): Promise<ProductsStats> {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
        throw new Error('No tienes permisos de administrador');
    }

    const { data: products, error } = await supabase
        .from('products')
        .select('is_active_prd, price_prd');

    if (error) {
        console.error('[adminProducts] Error fetching stats:', error);
        throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }

    const totalProducts = products?.length || 0;
    const activeProducts = products?.filter((p: any) => p.is_active_prd === true).length || 0;
    const inactiveProducts = totalProducts - activeProducts;

    const totalPrice = products?.reduce((sum: number, p: any) => sum + (p.price_prd || 0), 0) || 0;
    const averagePrice = totalProducts > 0 ? totalPrice / totalProducts : 0;

    return {
        totalProducts,
        activeProducts,
        inactiveProducts,
        averagePrice: Math.round(averagePrice),
    };
}

/**
 * Elimina un producto como administrador
 */
export async function deleteProductAsAdmin(productId: string): Promise<void> {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
        throw new Error('No tienes permisos de administrador');
    }

    // Eliminar imágenes del storage
    const { data: images } = await supabase
        .from('product_images')
        .select('path_pim')
        .eq('product_id_pim', productId);

    if (images && images.length > 0) {
        const paths = images.map((img: any) => img.path_pim);
        await supabase.storage.from('product-images').remove(paths);
    }

    // Eliminar producto (cascade eliminará relaciones)
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id_prd', productId);

    if (error) {
        console.error('[adminProducts] Error deleting product:', error);
        throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
}

/**
 * Actualiza un producto como administrador
 */
export async function updateProductAsAdmin(
    productId: string,
    data: {
        name?: string;
        description?: string;
        price?: number;
        isActive?: boolean;
    }
): Promise<void> {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
        throw new Error('No tienes permisos de administrador');
    }

    // Construir objeto de actualización de forma segura
    const updates: Record<string, any> = {};
    if (data.name !== undefined) updates['name_prd'] = data.name;
    if (data.description !== undefined) updates['description_prd'] = data.description;
    if (data.price !== undefined) updates['price_prd'] = data.price;
    if (data.isActive !== undefined) updates['is_active_prd'] = data.isActive;

    const { error } = await (supabase.from('products') as any).update(updates).eq('id_prd', productId);

    if (error) {
        console.error('[adminProducts] Error updating product:', error);
        throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
}

/**
 * Cambia el estado activo/inactivo de un producto como administrador
 */
export async function toggleProductStatusAsAdmin(productId: string, isActive: boolean): Promise<void> {
    return updateProductAsAdmin(productId, { isActive });
}
