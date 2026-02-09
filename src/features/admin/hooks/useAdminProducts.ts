import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  AdminProductListItem,
  ProductsFilters,
  ProductsStats,
} from '@/types/entities/product';
import {
  getAllProductsForAdmin,
  getProductsStats,
  deleteProductAsAdmin,
  updateProductAsAdmin,
  toggleProductStatusAsAdmin,
} from '@/services/adminProducts.service';

const ADMIN_PRODUCTS_KEY = ['admin', 'products'] as const;
const ADMIN_PRODUCTS_STATS_KEY = ['admin', 'products', 'stats'] as const;

/**
 * Hook para obtener todos los productos con filtros (admin)
 */
export function useAdminProducts(filters?: ProductsFilters) {
  return useQuery<AdminProductListItem[], Error>({
    queryKey: [...ADMIN_PRODUCTS_KEY, filters],
    queryFn: () => getAllProductsForAdmin(filters),
    staleTime: 1000 * 60, // 1 minuto
  });
}

/**
 * Hook para obtener estadísticas de productos (admin)
 */
export function useProductsStats() {
  return useQuery<ProductsStats, Error>({
    queryKey: ADMIN_PRODUCTS_STATS_KEY,
    queryFn: getProductsStats,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para eliminar un producto como administrador
 */
export function useDeleteProductAsAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => deleteProductAsAdmin(productId),
    onSuccess: () => {
      // Invalidar queries de productos
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_STATS_KEY });
      queryClient.invalidateQueries({ queryKey: ['business-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

/**
 * Hook para actualizar un producto como administrador
 */
export function useUpdateProductAsAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: {
        name?: string;
        description?: string;
        price?: number;
        isActive?: boolean;
      };
    }) => updateProductAsAdmin(productId, data),
    onSuccess: () => {
      // Invalidar queries de productos
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_STATS_KEY });
      queryClient.invalidateQueries({ queryKey: ['business-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

/**
 * Hook para cambiar el estado activo/inactivo de un producto
 */
export function useToggleProductStatusAsAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, isActive }: { productId: string; isActive: boolean }) =>
      toggleProductStatusAsAdmin(productId, isActive),
    onSuccess: () => {
      // Invalidar queries de productos
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_STATS_KEY });
      queryClient.invalidateQueries({ queryKey: ['business-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
