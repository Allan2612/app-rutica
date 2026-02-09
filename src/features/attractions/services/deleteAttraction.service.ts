import { supabase } from '@/lib/supabase/client';

// ============================================
// Constants
// ============================================

const STORAGE_BUCKET = 'attractions-images';

interface AttractionOwnerQuery {
  submitted_by_atr: string | null;
  location_id_atr: string | null;
}

interface ImagePathQuery {
  path_aim: string;
}

// ============================================
// Delete Attraction
// ============================================

/**
 * Elimina una atracción y todos sus recursos asociados
 */
export async function deleteUserAttraction(attractionId: string, userId: string): Promise<void> {
  // 1. Verificar que el usuario es dueño de la atracción
  const { data: attraction, error: attractionError } = await supabase
    .from('attractions')
    .select('submitted_by_atr, location_id_atr')
    .eq('id_atr', attractionId)
    .single<AttractionOwnerQuery>();

  if (attractionError || !attraction) {
    throw attractionError || new Error('Atracción no encontrada');
  }

  if (attraction.submitted_by_atr !== userId) {
    throw new Error('No tienes permiso para eliminar esta atracción');
  }

  const locationId = attraction.location_id_atr;

  // 2. Obtener imágenes para eliminar del storage (V3: solo path_aim)
  const { data: images, error: queryError } = await supabase
    .from('attraction_images')
    .select('path_aim')
    .eq('attraction_id_aim', attractionId)
    .returns<ImagePathQuery[]>();

  if (queryError) {
    console.error('[deleteUserAttraction] Error fetching images:', queryError);
  }

  // 3. Eliminar imágenes del bucket de Supabase
  if (images && images.length > 0) {
    const imagePaths = images.map((img) => img.path_aim);

    const { error: storageError } = await supabase.storage.from(STORAGE_BUCKET).remove(imagePaths);

    if (storageError) {
      console.error('[deleteUserAttraction] Storage remove error:', storageError);
    }

    // Fallback: eliminar carpeta completa
    try {
      const { data: folderFiles } = await supabase.storage.from(STORAGE_BUCKET).list(attractionId, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' },
      });

      if (folderFiles && folderFiles.length > 0) {
        const folderPaths = folderFiles.map((file) => `${attractionId}/${file.name}`);
        await supabase.storage.from(STORAGE_BUCKET).remove(folderPaths);
      }
    } catch (folderError) {
      console.error('[deleteUserAttraction] Folder cleanup error:', folderError);
    }
  }

  // 4. Eliminar registros de attraction_images
  const { error: imagesError } = await supabase
    .from('attraction_images')
    .delete()
    .eq('attraction_id_aim', attractionId);

  if (imagesError) {
    console.error('[deleteUserAttraction] Error deleting image records:', imagesError);
  }

  // 5. Eliminar registros de attraction_category_map
  const { error: categoryError } = await supabase
    .from('attraction_category_map')
    .delete()
    .eq('attraction_id_acm', attractionId);

  if (categoryError) {
    console.error('[deleteUserAttraction] Error deleting category maps:', categoryError);
  }

  // 6. Eliminar reseñas (attraction_reviews tiene CASCADE DELETE, pero lo hacemos explícito)
  const { error: reviewsError } = await supabase
    .from('attraction_reviews')
    .delete()
    .eq('attraction_id_arv', attractionId);

  if (reviewsError) {
    console.error('[deleteUserAttraction] Error deleting reviews:', reviewsError);
  }

  // 7. Eliminar la atracción (esto también eliminará datos relacionados con CASCADE DELETE)
  const { error: deleteError } = await supabase
    .from('attractions')
    .delete()
    .eq('id_atr', attractionId);

  if (deleteError) throw deleteError;

  // 8. NO eliminar la ubicación - se reutiliza
  // La ubicación se mantiene en la BD para ser reutilizada por otras entidades
}
