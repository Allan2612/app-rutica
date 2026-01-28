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
    if (data.paymentReference !== undefined) updatePayload.payment_reference_prm = data.paymentReference;

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

    // 5. Actualizar scopeCategoryIds (para scope: 'category')
    // TODO: Descomentar cuando se cree la tabla promotion_product_categories en la BD
    /*
    if (data.scopeCategoryIds !== undefined) {
        // Eliminar categorías de scope existentes
        await supabase
            .from('promotion_product_categories')
            .delete()
            .eq('promotion_id_ppc', promotionId);

        // Insertar nuevas categorías de scope
        if (data.scopeCategoryIds.length > 0) {
            const scopeCategoryMaps = data.scopeCategoryIds.map((categoryId) => ({
                promotion_id_ppc: promotionId,
                category_id_ppc: categoryId,
            }));

            const { error: scopeCategoryError } = await supabase
                .from('promotion_product_categories')
                .insert(scopeCategoryMaps);

            if (scopeCategoryError) {
                console.error('Error updating scope categories:', scopeCategoryError);
            }
        }
    }
    */

    // 6. Actualizar comboItems (para scope: 'combo')
    if (data.comboItems !== undefined) {
        // Eliminar items de combo existentes
        await supabase
            .from('promotion_combo_items')
            .delete()
            .eq('promotion_id_pci', promotionId);

        // Insertar nuevos items de combo
        if (data.comboItems.length > 0) {
            const comboItemMaps = data.comboItems.map((item) => ({
                promotion_id_pci: promotionId,
                product_id_pci: item.productId,
                quantity_pci: item.quantity,
                paid_quantity_pci: item.paidQuantity ?? null,
            }));

            const { error: comboError } = await supabase
                .from('promotion_combo_items')
                .insert(comboItemMaps);

            if (comboError) {
                console.error('Error updating combo items:', comboError);
            }
        }
    }

    // 7. Gestionar imagen de cover
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

    // 8. Gestionar imágenes de galería
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
