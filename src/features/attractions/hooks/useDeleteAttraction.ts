import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUserAttraction } from '../services';
import { useAuthStore } from '@/store';

export function useDeleteAttraction() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (attractionId: string) => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      return deleteUserAttraction(attractionId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-attractions'] });
    },
  });
}
