import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

const BUCKET_NAME = 'events-images';

/**
 * Elimina un evento y todos sus datos relacionados
 * @param eventId - ID del evento a eliminar
 * @param userId - ID del usuario que está eliminando el evento
 */
export async function deleteUserEvent(eventId: string, userId: string): Promise<void> {
    // 1. Verificar permisos
    const { data: event, error: eventError } = await (supabase as any)
        .from('events')
        .select('created_by_evt, location_id_evt')
        .eq('id_evt', eventId)
        .single();

    if (eventError) throw eventError;
    if (!event || event.created_by_evt !== userId) {
        throw new Error('No tienes permiso para eliminar este evento');
    }

    try {
        // 2. Obtener todas las imágenes antes de eliminar
        const { data: images, error: queryError } = await supabase
            .from('event_images')
            .select('path_eim')
            .eq('event_id_eim', eventId);

        if (queryError) {
        }

        // 3. Eliminar imágenes del bucket de Supabase
        if (images && images.length > 0) {
            const imagePaths = (images as any).map((img: { path_eim: string }) => img.path_eim);
            
            // Intentar eliminar archivos individuales
            const { error: storageError } = await supabase.storage
                .from(BUCKET_NAME)
                .remove(imagePaths);

            if (storageError) {
            }

            // Intentar también listar y eliminar toda la carpeta del evento (fallback)
            try {
                const { data: folderFiles } = await supabase.storage
                    .from(BUCKET_NAME)
                    .list(eventId, {
                        limit: 100,
                        sortBy: { column: 'name', order: 'asc' }
                    });

                if (folderFiles && folderFiles.length > 0) {
                    const folderPaths = folderFiles.map(file => `${eventId}/${file.name}`);
                    await supabase.storage
                        .from(BUCKET_NAME)
                        .remove(folderPaths);
                }
            } catch (folderError) {
            }
        }

        // 4. Eliminar registros de event_images
        const { error: imagesError } = await supabase
            .from('event_images')
            .delete()
            .eq('event_id_eim', eventId);

        if (imagesError) {
        }

        // 5. Eliminar categorías asociadas
        const { error: categoriesError } = await supabase
            .from('event_category_map')
            .delete()
            .eq('event_id_ecm', eventId);

        if (categoriesError) {
        }

        // 6. Eliminar el evento
        const { error: deleteError } = await supabase
            .from('events')
            .delete()
            .eq('id_evt', eventId);

        if (deleteError) throw deleteError;

        // 7. Eliminar la ubicación si existe (solo si no está siendo usada por otros eventos)
        if (event.location_id_evt) {
            const { data: otherEvents } = await supabase
                .from('events')
                .select('id_evt')
                .eq('location_id_evt', event.location_id_evt)
                .limit(1);

            // Si no hay otros eventos usando esta ubicación, eliminarla
            if (!otherEvents || otherEvents.length === 0) {
                await supabase
                    .from('locations')
                    .delete()
                    .eq('id_loc', event.location_id_evt);
            }
        }
    } catch (error) {
        throw error;
    }
}
