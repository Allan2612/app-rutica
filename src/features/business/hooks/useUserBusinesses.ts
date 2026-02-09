import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBusinessById,
  getUserBusinesses,
  deleteUserBusiness,
} from '../services/userBusinesses.service';
import { updateBusinessComplete } from '../services/updateBusiness.service';
import { createBusinessComplete } from '../services/createBusiness.service';
import type { UpdateBusinessData } from '../services/updateBusiness.service';
import { useAuthStore } from '@/store';

/**
 * Hook para obtener la lista de negocios del usuario autenticado
 */
export function useUserBusinesses() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['user-businesses', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      return getUserBusinesses(user.id);
    },
    enabled: !!user?.id,
  });
}

/**
 * Hook para eliminar un negocio
 */
export function useDeleteBusiness() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (businessId: string) => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      return deleteUserBusiness(businessId, user.id);
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['user-businesses'] });
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
  });
}

/**
 * Hook para obtener los detalles de un negocio para edición
 */
export function useBusinessById(businessId: string) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['business', businessId],
    queryFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      const result = await getBusinessById(businessId, user.id);
      return result;
    },
    enabled: !!user?.id && !!businessId,
    retry: false, // No reintentar automáticamente para ver el error real
  });
}

/**
 * Hook para actualizar un negocio
 */
export function useUpdateBusiness() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: ({ businessId, data }: { businessId: string; data: UpdateBusinessData }) => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      return updateBusinessComplete(businessId, user.id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-businesses'] });
      queryClient.invalidateQueries({ queryKey: ['business', variables.businessId] });
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
  });
}
