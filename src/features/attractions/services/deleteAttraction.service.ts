import { supabase } from '@/lib/supabase/client';

/**
 * Elimina una atracción y todos sus recursos asociados
 */
export async function deleteUserAttraction(attractionId: string, userId: string): Promise<void> {
    // 1. Verificar que el usuario es dueño de la atracción
    const { data: attraction, error: attractionError } = await supabase
        .from('attractions')
        .select('submitted_by_atr, location_id_atr')
        .eq('id_atr', attractionId)
        .single();

    if (attractionError || !attraction) {
        throw attractionError || new Error('Atracción no encontrada');
    }

    if (attraction.submitted_by_atr !== userId) {
        throw new Error('No tienes permiso para eliminar esta atracción');
    }

    const locationId = attraction.location_id_atr;

    // 2. Obtener imágenes para eliminar del storage
    const { data: images, error: queryError } = await supabase
        .from('attraction_images')
        .select('bucket_aim, path_aim')
        .eq('attraction_id_aim', attractionId);

    if (queryError) {
        console.error('Error querying attraction images:', queryError);
    }

    // 3. Eliminar imágenes del bucket de Supabase
    if (images && images.length > 0) {
        const imagePaths = images.map((img: { bucket_aim: string; path_aim: string }) => img.path_aim);

        const { error: storageError } = await supabase.storage
            .from('attractions-images')
            .remove(imagePaths);

        if (storageError) {
            console.error('Error deleting images from storage:', storageError);
            console.error('Attempted to delete paths:', imagePaths);
        }

        // Fallback: eliminar carpeta completa
        try {
            const { data: folderFiles } = await supabase.storage
                .from('attractions-images')
                .list(attractionId, {
                    limit: 100,
                    sortBy: { column: 'name', order: 'asc' }
                });

            if (folderFiles && folderFiles.length > 0) {
                const folderPaths = folderFiles.map(file => `${attractionId}/${file.name}`);
                await supabase.storage
                    .from('attractions-images')
                    .remove(folderPaths);
            }
        } catch (folderError) {
            console.error('Error cleaning up attraction folder:', folderError);
        }
    }

    // 4. Eliminar registros de attraction_images
    const { error: imagesError } = await supabase
        .from('attraction_images')
        .delete()
        .eq('attraction_id_aim', attractionId);

    if (imagesError) {
        console.error('Error deleting attraction images records:', imagesError);
    }

    // 5. Eliminar registros de attraction_category_map
    const { error: categoryError } = await supabase
        .from('attraction_category_map')
        .delete()
        .eq('attraction_id_acm', attractionId);

    if (categoryError) {
        console.error('Error deleting attraction categories:', categoryError);
    }

    // 6. Eliminar la atracción
    const { error: deleteError } = await supabase
        .from('attractions')
        .delete()
        .eq('id_atr', attractionId);

    if (deleteError) throw deleteError;

    // 7. Eliminar ubicación si no la usa otra entidad
    if (locationId) {
        const { count: businessCount } = await supabase
            .from('businesses')
            .select('*', { count: 'exact', head: true })
            .eq('location_id_bus', locationId);

        const { count: eventCount } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('location_id_evt', locationId);

        const { count: attractionCount } = await supabase
            .from('attractions')
            .select('*', { count: 'exact', head: true })
            .eq('location_id_atr', locationId);

        if ((businessCount ?? 0) === 0 && (eventCount ?? 0) === 0 && (attractionCount ?? 0) === 0) {
            await supabase.from('locations').delete().eq('id_loc', locationId);
        }
    }
}
