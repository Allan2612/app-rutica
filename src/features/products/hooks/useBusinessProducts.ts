import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBusinessProducts, deleteProduct, createProductComplete } from '@/features/products/services';

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
