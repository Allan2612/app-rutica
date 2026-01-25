/**
 * Servicio para actualizar promociones
 * Incluye gestión de imágenes y actualización de categorías/productos
 */

import { supabase } from '@/lib/supabase/client';
import type { UpdatePromotionData } from '@/types/entities';
import { generateUUID, isNewImage, uploadPromotionImage, deletePromotionImage, extractPathFromUrl } from './promotions.helpers';

const BUCKET_NAME = 'promotions-images';

/**
 * Actualiza una promoción existente
 */
export async function updatePromotionComplete(
    promotionId: string,
    userId: string,
    data: UpdatePromotionData
): Promise<void> {
    // 1. Verificar permisos
    const { data: promotion, error: fetchError } = await supabase
        .from('promotions')
        .select('created_by_prm')
        .eq('id_prm', promotionId)
        .single();

    if (fetchError) throw fetchError;
    if (!promotion || promotion.created_by_prm !== userId) {
        throw new Error('No tienes permisos para editar esta promoción');
    }

    // 2. Actualizar datos base de la promoción
    const updatePayload: Record<string, unknown> = {
        updated_at_prm: new Date().toISOString(),
    };

    if (data.scope !== undefined) updatePayload.scope_prm = data.scope;
    if (data.title !== undefined) updatePayload.title_prm = data.title;
    if (data.description !== undefined) updatePayload.description_prm = data.description;
    if (data.discountType !== undefined) updatePayload.discount_type_prm = data.discountType;
    if (data.discountValue !== undefined) updatePayload.discount_value_prm = data.discountValue;
    if (data.startAt !== undefined) updatePayload.start_at_prm = data.startAt;
    if (data.endAt !== undefined) updatePayload.end_at_prm = data.endAt;

    const { error: updateError } = await supabase
        .from('promotions')
        .update(updatePayload)
        .eq('id_prm', promotionId);

    if (updateError) throw updateError;

    // 3. Actualizar categorías si se proporcionaron
    if (data.categoryIds !== undefined) {
        // Eliminar categorías existentes
        await supabase
            .from('promotion_category_map')
            .delete()
            .eq('promotion_id_pcr', promotionId);

        // Insertar nuevas categorías
        if (data.categoryIds.length > 0) {
            const categoryMaps = data.categoryIds.map((categoryId) => ({
                promotion_id_pcr: promotionId,
                category_id_pcr: categoryId,
            }));

            const { error: categoryError } = await supabase
                .from('promotion_category_map')
                .insert(categoryMaps);

            if (categoryError) {
                console.error('Error updating categories:', categoryError);
            }
        }
    }

    // 4. Actualizar productos si se proporcionaron
    if (data.productIds !== undefined) {
        // Eliminar productos existentes
        await supabase
            .from('promotion_products')
            .delete()
            .eq('promotion_id_ppr', promotionId);

        // Insertar nuevos productos
        if (data.productIds.length > 0) {
            const productMaps = data.productIds.map((productId) => ({
                promotion_id_ppr: promotionId,
                product_id_ppr: productId,
            }));

            const { error: productError } = await supabase
                .from('promotion_products')
                .insert(productMaps);

            if (productError) {
                console.error('Error updating products:', productError);
            }
        }
    }

    // 5. Gestionar imagen de cover
    if (data.coverUri !== undefined) {
        // Obtener imagen de cover actual
        const { data: currentCover } = await supabase
            .from('promotion_images')
            .select('id_pim, path_pim')
            .eq('promotion_id_pim', promotionId)
            .eq('image_type_pim', 'flyer')
            .single();

        if (data.coverUri === null) {
            // Eliminar cover existente
            if (currentCover) {
                await deletePromotionImage(currentCover.path_pim);
                await supabase
                    .from('promotion_images')
                    .delete()
                    .eq('id_pim', currentCover.id_pim);
            }
        } else if (isNewImage(data.coverUri)) {
            // Eliminar cover anterior si existe
            if (currentCover) {
                await deletePromotionImage(currentCover.path_pim);
                await supabase
                    .from('promotion_images')
                    .delete()
                    .eq('id_pim', currentCover.id_pim);
            }

            // Subir nueva imagen
            const coverPath = await uploadPromotionImage(promotionId, data.coverUri, 'flyer');
            
            await supabase
                .from('promotion_images')
                .insert({
                    id_pim: generateUUID(),
                    promotion_id_pim: promotionId,
                    image_type_pim: 'flyer',
                    bucket_pim: BUCKET_NAME,
                    path_pim: coverPath,
                });
        }
        // Si no es nueva imagen (URL existente), no hacemos nada
    }

    // 6. Gestionar imágenes de galería
    if (data.galleryUris !== undefined) {
        // Obtener imágenes de galería actuales
        const { data: currentGallery } = await supabase
            .from('promotion_images')
            .select('id_pim, path_pim, bucket_pim')
            .eq('promotion_id_pim', promotionId)
            .eq('image_type_pim', 'flyer');

        const currentPaths = currentGallery?.map(img => img.path_pim) ?? [];
        const newUris = data.galleryUris;

        // Determinar qué imágenes eliminar (las que no están en newUris como URL)
        for (const img of currentGallery ?? []) {
            const imgUrl = supabase.storage.from(img.bucket_pim).getPublicUrl(img.path_pim).data.publicUrl;
            if (!newUris.includes(imgUrl)) {
                await deletePromotionImage(img.path_pim);
                await supabase
                    .from('promotion_images')
                    .delete()
                    .eq('id_pim', img.id_pim);
            }
        }

        // Subir nuevas imágenes
        for (const uri of newUris) {
            if (isNewImage(uri)) {
const galleryPath = await uploadPromotionImage(promotionId, uri, 'flyer');
                
                await supabase
                    .from('promotion_images')
                    .insert({
                        id_pim: generateUUID(),
                        promotion_id_pim: promotionId,
                        image_type_pim: 'flyer',
                        bucket_pim: BUCKET_NAME,
                        path_pim: galleryPath,
                    });
            }
        }
    }
}
