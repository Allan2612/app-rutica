import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBusinessComplete, CreateBusinessData } from '../services';
import { useAuthStore } from '@/store';

/**
 * Hook para crear un nuevo negocio
 */
export function useCreateBusiness() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (data: CreateBusinessData) => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      return createBusinessComplete(user.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-businesses'] });
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
  });
}
