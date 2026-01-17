import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
    getAttractionById,
    updateAttractionComplete,
    UpdateAttractionData,
} from '../services/updateAttraction.service';
import { useAuthStore } from '@/store';

/**
 * Hook para obtener los detalles de una atracción para edición
 */
export function useAttractionById(attractionId: string) {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ['attraction', attractionId],
        queryFn: async () => {
            if (!user?.id) throw new Error('Usuario no autenticado');
            const result = await getAttractionById(attractionId, user.id);
            return result;
        },
        enabled: !!user?.id && !!attractionId,
        retry: false,
    });
}

/**
 * Hook para actualizar una atracción
 */
export function useUpdateAttraction() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: ({
            attractionId,
            data,
        }: {
            attractionId: string;
            data: UpdateAttractionData;
        }) => {
            if (!user?.id) throw new Error('Usuario no autenticado');
            return updateAttractionComplete(attractionId, user.id, data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['user-attractions'] });
            queryClient.invalidateQueries({ queryKey: ['attraction', variables.attractionId] });
            queryClient.invalidateQueries({ queryKey: ['attractions'] });
            
            Toast.show({
                type: 'success',
                text1: 'Atracción actualizada',
                text2: 'Los cambios se han guardado correctamente',
                position: 'top',
                visibilityTime: 3000,
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Error al actualizar',
                text2: error.message || 'No se pudo actualizar la atracción',
                position: 'top',
                visibilityTime: 4000,
            });
        },
    });
}
