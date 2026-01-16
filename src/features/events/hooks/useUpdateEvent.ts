import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEventById, updateEventComplete, UpdateEventData } from '../services/updateEvent.service';
import { useAuthStore } from '@/store';

/**
 * Hook para obtener los detalles de un evento para edición
 */
export function useEventById(eventId: string) {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ['event', eventId],
        queryFn: async () => {
            if (!user?.id) throw new Error('Usuario no autenticado');
            const result = await getEventById(eventId, user.id);
            return result;
        },
        enabled: !!user?.id && !!eventId,
        retry: false,
    });
}

/**
 * Hook para actualizar un evento
 */
export function useUpdateEvent() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: ({ eventId, data }: { eventId: string; data: UpdateEventData }) => {
            if (!user?.id) throw new Error('Usuario no autenticado');
            return updateEventComplete(eventId, user.id, data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['user-events'] });
            queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
}
