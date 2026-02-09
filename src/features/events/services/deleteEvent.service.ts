import { supabase } from '@/lib/supabase/client';

// ============================================
// Constants
// ============================================

const STORAGE_BUCKET = 'events-images';

// ============================================
// Types
// ============================================

interface EventOwnerQuery {
  created_by_evt: string | null;
  location_id_evt: string | null;
}

interface ImagePathQuery {
  path_eim: string;
}

// ============================================
// Delete Event (Soft Delete)
// ============================================

/**
 * Elimina completamente un evento, sus registros relacionados e imágenes
 *
 * Según las políticas RLS:
 * - El dueño puede hacer DELETE en: events, event_images, event_category_map
 * - Se eliminan en orden correcto para respetar foreign keys
 *
 * @param eventId - ID del evento a eliminar
 * @param userId - ID del usuario que está eliminando el evento
 */
export async function deleteUserEvent(eventId: string, userId: string): Promise<void> {
  // 1. Verificar que el usuario es dueño del evento
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('created_by_evt, location_id_evt')
    .eq('id_evt', eventId)
    .single<EventOwnerQuery>();

  if (eventError || !event) {
    throw eventError || new Error('Evento no encontrado');
  }

  if (event.created_by_evt !== userId) {
    throw new Error('No tienes permiso para eliminar este evento');
  }

  try {
    // 2. Obtener imágenes para eliminar del storage
    const { data: images } = await supabase
      .from('event_images')
      .select('path_eim')
      .eq('event_id_eim', eventId)
      .returns<ImagePathQuery[]>();

    // 3. Eliminar registros de event_category_map (sin FK al evento)
    const { error: categoryError } = await supabase
      .from('event_category_map')
      .delete()
      .eq('event_id_ecm', eventId);

    if (categoryError) {
      console.error('[deleteUserEvent] Error deleting category map:', categoryError);
      throw new Error('No se pudo eliminar las categorías del evento');
    }

    // 4. Eliminar registros de event_images (sin FK al evento)
    const { error: imagesError } = await supabase
      .from('event_images')
      .delete()
      .eq('event_id_eim', eventId);

    if (imagesError) {
      console.error('[deleteUserEvent] Error deleting image records:', imagesError);
      throw new Error('No se pudo eliminar los registros de imágenes');
    }

    // 5. Eliminar el evento
    const { error: deleteError } = await supabase.from('events').delete().eq('id_evt', eventId);

    if (deleteError) {
      console.error('[deleteUserEvent] Error deleting event:', deleteError);
      throw new Error('No se pudo eliminar el evento');
    }

    // 6. Eliminar imágenes del storage (después de eliminar registros)
    if (images && images.length > 0) {
      const imagePaths = images.map((img) => img.path_eim);

      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove(imagePaths);

      if (storageError) {
        console.warn('[deleteUserEvent] Storage remove warning:', storageError);
      }
    }

    // 7. Limpiar carpeta completa del storage
    try {
      const { data: folderFiles } = await supabase.storage.from(STORAGE_BUCKET).list(eventId, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' },
      });

      if (folderFiles && folderFiles.length > 0) {
        const folderPaths = folderFiles.map((file) => `${eventId}/${file.name}`);
        await supabase.storage.from(STORAGE_BUCKET).remove(folderPaths);
      }
    } catch (folderError) {
      console.warn('[deleteUserEvent] Folder cleanup warning:', folderError);
    }
  } catch (error) {
    console.error('[deleteUserEvent] Error:', error);
    throw error;
  }
}
