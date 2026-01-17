import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAttractionComplete, CreateAttractionData } from '../services';
import { useAuthStore } from '@/store';

export function useCreateAttraction() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: async (data: CreateAttractionData) => {
            if (!user?.id) {
                throw new Error('Usuario no autenticado');
            }
            return createAttractionComplete(user.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-attractions'] });
        },
    });
}
