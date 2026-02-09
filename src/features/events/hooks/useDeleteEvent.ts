import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUserEvent } from '../services/deleteEvent.service';
import { useAuthStore } from '@/store';

/**
 * Hook para eliminar un evento
 */
export function useDeleteEvent() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      return deleteUserEvent(eventId, user.id);
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['user-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
