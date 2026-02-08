/**
 * Servicio para crear promociones
 * Incluye subida de imágenes y vinculación de categorías/productos
 */

import { supabase } from '@/lib/supabase/client';
import type { PromotionFormData } from '@/types/entities';
import { generateUUID, isNewImage, uploadPromotionImage } from './promotions.helpers';
import { syncResourceUsage } from '@/services/subscriptionQuota.service';

/**
 * Crea una nueva promoción con toda su información
 */
export async function createPromotionComplete(
    userId: string,
    data: PromotionFormData
): Promise<string> {
    const promotionId = generateUUID();

    try {
        // 1. Crear la promoción base
        const { error: promotionError } = await supabase
            .from('promotions')
            .insert({
                id_prm: promotionId,
                business_id_prm: data.businessId,
                created_by_prm: userId,
                scope_prm: data.scope,
                title_prm: data.title,
                description_prm: data.description ?? null,
                discount_type_prm: data.discountType ?? 'percentage',
                discount_value_prm: data.discountValue ?? 0,
                start_at_prm: data.startAt,
                end_at_prm: data.endAt,
                moderation_status_prm: 'pending',
            } as any);

        if (promotionError) throw promotionError;

        // 2. Vincular categorías
        if (data.categoryIds && data.categoryIds.length > 0) {
            const categoryMaps = data.categoryIds.map((categoryId: string) => ({
                promotion_id_pcr: promotionId,
                category_id_pcr: categoryId,
            }));

            const { error: categoryError } = await supabase
                .from('promotion_category_map')
                .insert(categoryMaps as any);

            if (categoryError) {
                console.error('Error linking categories:', categoryError);
            }
        }

        // 3. Vincular productos (si scope es 'products')
        if (data.scope === 'products' && data.productIds && data.productIds.length > 0) {
            const productMaps = data.productIds.map((productId: string) => ({
                promotion_id_ppr: promotionId,
                product_id_ppr: productId,
            }));

            const { error: productError } = await supabase
                .from('promotion_products')
                .insert(productMaps as any);

            if (productError) {
                console.error('Error linking products:', productError);
            }
        }

        // 3b. Vincular categorías de scope (si scope es 'categories')
        // Usa la tabla promotion_scope_categories para almacenar las categorías a las que aplica
        if (data.scope === 'categories' && data.scopeCategoryIds && data.scopeCategoryIds.length > 0) {
            const scopeCategoryMaps = data.scopeCategoryIds.map((categoryId: string) => ({
                promotion_id_psc: promotionId,
                category_id_psc: categoryId,
            }));

            const { error: scopeCategoryError } = await supabase
                .from('promotion_scope_categories')
                .insert(scopeCategoryMaps as any);

            if (scopeCategoryError) {
                console.error('Error linking scope categories:', scopeCategoryError);
            }
        }

        // 3c. Crear items de combo (si scope es 'combo')
        if (data.scope === 'combo' && data.comboItems && data.comboItems.length > 0) {
            const comboItemInserts = data.comboItems.map((item: { productId: string; quantity: number; paidQuantity?: number }) => ({
                id_pci: generateUUID(),
                promotion_id_pci: promotionId,
                product_id_pci: item.productId,
                quantity_pci: item.quantity,
                paid_quantity_pci: item.paidQuantity ?? null,
            }));

            const { error: comboError } = await supabase
                .from('promotion_combo_items')
                .insert(comboItemInserts as any);

            if (comboError) {
                console.error('Error creating combo items:', comboError);
            }
        }

        // 4. Subir y registrar imagen de cover
        if (data.coverUri && isNewImage(data.coverUri)) {
            try {
                const coverPath = await uploadPromotionImage(promotionId, data.coverUri, 'flyer');

                const imageInsert = {
                    id_pim: generateUUID(),
                    promotion_id_pim: promotionId,
                    path_pim: coverPath,
                };

                const { error: imgInsertError } = await supabase
                    .from('promotion_images')
                    .insert(imageInsert as any);

                if (imgInsertError) {
                    throw imgInsertError;
                }
            } catch (imgError) {
                console.error('Error uploading cover image:', imgError);
                throw imgError; // Re-throw para que se maneje en el catch principal
            }
        }

        // 5. Subir y registrar imágenes de galería
        if (data.galleryUris && data.galleryUris.length > 0) {
            for (const galleryUri of data.galleryUris) {
                if (isNewImage(galleryUri)) {
                    try {
                        const galleryPath = await uploadPromotionImage(promotionId, galleryUri, 'flyer');

                        const imageInsert = {
                            id_pim: generateUUID(),
                            promotion_id_pim: promotionId,
                            path_pim: galleryPath,
                        };

                        const { error: imgInsertError } = await supabase
                            .from('promotion_images')
                            .insert(imageInsert as any);

                        if (imgInsertError) {
                            console.error('[createPromotion] Error inserting gallery image:', imgInsertError);
                            throw imgInsertError;
                        }
                    } catch (imgError) {
                        console.error('Error uploading gallery image:', imgError);
                        throw imgError; // Re-throw para que se maneje en el catch principal
                    }
                }
            }
        }

        // 6. Sincronizar cuota de promociones para el negocio
        await syncResourceUsage(userId, 'promotion', data.businessId, 'business');

        return promotionId;
    } catch (error) {
        // Rollback: eliminar la promoción si algo falló
        await supabase.from('promotion_images').delete().eq('promotion_id_pim', promotionId);
        await supabase.from('promotion_category_map').delete().eq('promotion_id_pcr', promotionId);
        await supabase.from('promotion_products').delete().eq('promotion_id_ppr', promotionId);
        await supabase.from('promotion_scope_categories').delete().eq('promotion_id_psc', promotionId);
        await supabase.from('promotion_combo_items').delete().eq('promotion_id_pci', promotionId);
        await supabase.from('promotions').delete().eq('id_prm', promotionId);

        throw error;
    }
}
