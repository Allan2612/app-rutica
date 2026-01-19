import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBusinessProducts, getProduct, deleteProduct, createProductComplete, updateProduct } from '@/features/products/services';

/**
 * Hook para obtener los productos de un negocio
 */
export function useBusinessProducts(businessId: string) {
    return useQuery({
        queryKey: ['business-products', businessId],
        queryFn: () => getBusinessProducts(businessId),
        enabled: !!businessId,
    });
}

/**
 * Hook para obtener un producto específico
 */
export function useProduct(productId: string) {
    return useQuery({
        queryKey: ['product', productId],
        queryFn: () => getProduct(productId),
        enabled: !!productId,
    });
}

/**
 * Hook para eliminar un producto
 */
export function useDeleteProduct(businessId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: string) => deleteProduct(productId, businessId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business-products', businessId] });
        },
    });
}

/**
 * Hook para crear un producto
 */
export function useCreateProduct(businessId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            name: string;
            description?: string;
            price: number;
            currency: string;
            categoryIds: string[];
            images: string[];
        }) => createProductComplete(businessId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business-products', businessId] });
        },
    });
}

/**
 * Hook para actualizar un producto
 */
export function useUpdateProduct(businessId: string, productId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            name: string;
            description?: string;
            price: number;
            currency: string;
            categoryIds: string[];
            images: string[];
        }) => updateProduct(productId, businessId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business-products', businessId] });
            queryClient.invalidateQueries({ queryKey: ['product', productId] });
        },
    });
}
