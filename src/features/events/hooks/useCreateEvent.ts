import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEventComplete, CreateEventData } from '../services';
import { useAuthStore } from '@/store';

export function useCreateEvent() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: async (data: CreateEventData) => {
            if (!user?.id) {
                throw new Error('Usuario no autenticado');
            }
            return await createEventComplete(user.id, data);
        },
        onSuccess: () => {
            // Invalidar queries relacionadas con eventos del usuario
            queryClient.invalidateQueries({ queryKey: ['user-events', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
}
