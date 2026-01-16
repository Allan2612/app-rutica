import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBusinessProducts, deleteProduct } from '@/features/products/services';

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
