/**
 * Servicio para gestión de promociones del usuario
 * Operaciones CRUD y consultas de promociones
 */

import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import type {
    PromotionListItem,
    PromotionDetailForEdit,
} from '@/types/entities';
import { ModerationStatus, PromotionScope, DiscountType } from '@/types/enums';
import { getImageUrl, deletePromotionImage } from './promotions.helpers';
import { canUserEdit } from '@/utils/permissionHelpers';
import { syncResourceUsage } from '@/services/subscriptionQuota.service';

const BUCKET_NAME = 'promotions-images';

// ============================================
// Types
// ============================================

interface PromotionRecord {
    id_prm: string;
    business_id_prm: string;
    scope_prm: string;
    title_prm: string;
    description_prm: string | null;
    discount_type_prm: string;
    discount_value_prm: number;
    start_at_prm: string;
    end_at_prm: string;
    moderation_status_prm: string;
    created_at_prm: string;
    businesses: {
        id_bus: string;
        name_bus: string;
    } | null;
    promotion_images?: {
        path_pim: string;
    }[] | null;
    promotion_category_map?: {
        categories: {
            id_cat: string;
            name_cat: string;
        } | null;
    }[] | null;
    promotion_products?: {
        product_id_ppr: string;
    }[] | null;
    promotion_scope_categories?: {
        category_id_psc: string;
    }[] | null;
    promotion_combo_items?: {
        product_id_pci: string;
        quantity_pci: number;
        paid_quantity_pci: number | null;
    }[] | null;
}

// ============================================
// GET - Obtener promociones del usuario
// ============================================

/**
 * Obtiene todas las promociones de un usuario (de todos sus negocios)
 */
export async function getUserPromotions(userId: string): Promise<PromotionListItem[]> {
    const { data, error } = await supabase
        .from('promotions')
        .select(`
            id_prm,
            business_id_prm,
            scope_prm,
            title_prm,
            description_prm,
            discount_type_prm,
            discount_value_prm,
            start_at_prm,
            end_at_prm,
            moderation_status_prm,
            created_at_prm,
            businesses:business_id_prm (
                id_bus,
                name_bus
            ),
            promotion_images (
                path_pim
            ),
            promotion_category_map (
                categories!inner (
                    id_cat,
                    name_cat
                )
            ),
            promotion_products (
                product_id_ppr
            ),
            promotion_scope_categories (
                category_id_psc
            ),
            promotion_combo_items (
                product_id_pci,
                quantity_pci,
                paid_quantity_pci
            )
        `)
        .eq('created_by_prm', userId)
        .order('created_at_prm', { ascending: false });

    if (error) throw error;

    return (data as unknown as PromotionRecord[] || []).map(mapRecordToListItem);
}

/**
 * Obtiene las promociones de un negocio específico
 */
export async function getPromotionsByBusiness(businessId: string): Promise<PromotionListItem[]> {
    const { data, error } = await supabase
        .from('promotions')
        .select(`
            id_prm,
            business_id_prm,
            scope_prm,
            title_prm,
            description_prm,
            discount_type_prm,
            discount_value_prm,
            start_at_prm,
            end_at_prm,
            moderation_status_prm,
            created_at_prm,
            businesses:business_id_prm (
                id_bus,
                name_bus
            ),
            promotion_images (
                path_pim
            ),
            promotion_category_map (
                categories!inner (
                    id_cat,
                    name_cat
                )
            ),
            promotion_products (
                product_id_ppr
            ),
            promotion_scope_categories (
                category_id_psc
            ),
            promotion_combo_items (
                product_id_pci,
                quantity_pci,
                paid_quantity_pci
            )
        `)
        .eq('business_id_prm', businessId)
        .order('created_at_prm', { ascending: false });

    if (error) throw error;

    return (data as unknown as PromotionRecord[] || []).map(mapRecordToListItem);
}

/**
 * Obtiene el detalle de una promoción para edición
 */
export async function getPromotionById(promotionId: string, userId: string): Promise<PromotionDetailForEdit> {
    const { data, error } = await supabase
        .from('promotions')
        .select(`
            id_prm,
            business_id_prm,
            created_by_prm,
            scope_prm,
            title_prm,
            description_prm,
            discount_type_prm,
            discount_value_prm,
            start_at_prm,
            end_at_prm,
            promotion_images (
                path_pim
            ),
            promotion_category_map (
                category_id_pcr
            ),
            promotion_products (
                product_id_ppr
            ),
            promotion_scope_categories (
                category_id_psc
            ),
            promotion_combo_items (
                product_id_pci,
                quantity_pci,
                paid_quantity_pci
            )
        `)
        .eq('id_prm', promotionId)
        .single();

    if (error) throw error;

    // Verificar permisos: debe ser el propietario O admin
    const hasPermission = await canUserEdit(userId, (data as any).created_by_prm);
    if (!hasPermission) {
        throw new Error('No tienes permisos para ver esta promoción');
    }

    // Procesar imágenes - filtrar por prefijo del path
    const images = (data as any).promotion_images || [];
    const coverImage = images.find((img: any) => {
        const prefix = img.path_pim.split('/').pop()?.split('-')[0];
        return prefix === 'flyer';
    });
    const galleryImages = images.filter((img: any) => {
        const prefix = img.path_pim.split('/').pop()?.split('-')[0];
        return prefix === 'flyer';
    });

    const coverUrl = coverImage
        ? getImageUrl(BUCKET_NAME, coverImage.path_pim)
        : null;

    const galleryUrls = galleryImages.map((img: any) =>
        getImageUrl(BUCKET_NAME, img.path_pim)
    );

    return {
        id: (data as any).id_prm,
        businessId: (data as any).business_id_prm,
        scope: (data as any).scope_prm as PromotionScope,
        title: (data as any).title_prm,
        description: (data as any).description_prm,
        discountType: (data as any).discount_type_prm as DiscountType,
        discountValue: (data as any).discount_value_prm,
        startAt: (data as any).start_at_prm,
        endAt: (data as any).end_at_prm,
        categoryIds: ((data as any).promotion_category_map || []).map((pcm: { category_id_pcr: string }) => pcm.category_id_pcr),
        productIds: ((data as any).promotion_products || []).map((pp: { product_id_ppr: string }) => pp.product_id_ppr),
        scopeCategoryIds: ((data as any).promotion_scope_categories || []).map((psc: { category_id_psc: string }) => psc.category_id_psc),
        comboItems: ((data as any).promotion_combo_items || []).map((pci: { product_id_pci: string; quantity_pci: number; paid_quantity_pci?: number }) => ({
            productId: pci.product_id_pci,
            quantity: pci.quantity_pci,
            paidQuantity: pci.paid_quantity_pci ?? undefined,
        })),
        coverUrl,
        galleryUrls,
    };
}

// ============================================
// DELETE - Eliminar promoción
// ============================================

/**
 * Elimina una promoción y todos sus datos relacionados
 */
export async function deleteUserPromotion(promotionId: string, userId: string): Promise<void> {
    // 1. Verificar permisos y obtener businessId
    const { data: promotion, error: fetchError } = await (supabase as any)
        .from('promotions')
        .select('created_by_prm, business_id_prm')
        .eq('id_prm', promotionId)
        .single();

    if (fetchError) throw fetchError;
    if (!promotion || promotion.created_by_prm !== userId) {
        throw new Error('No tienes permisos para eliminar esta promoción');
    }

    const businessId = promotion.business_id_prm;

    // 2. Obtener imágenes para eliminar del storage
    const { data: images } = await supabase
        .from('promotion_images')
        .select('path_pim')
        .eq('promotion_id_pim', promotionId);

    // 3. Eliminar imágenes del storage
    if (images && images.length > 0) {
        for (const img of images as any) {
            await deletePromotionImage(img.path_pim);
        }
    }

    // 4. Eliminar registros de imágenes
    await supabase
        .from('promotion_images')
        .delete()
        .eq('promotion_id_pim', promotionId);

    // 5. Eliminar mapeos de categorías
    await supabase
        .from('promotion_category_map')
        .delete()
        .eq('promotion_id_pcr', promotionId);

    // 6. Eliminar mapeos de productos
    await supabase
        .from('promotion_products')
        .delete()
        .eq('promotion_id_ppr', promotionId);

    // 7. Eliminar categorías de scope
    await supabase
        .from('promotion_scope_categories')
        .delete()
        .eq('promotion_id_psc', promotionId);

    // 8. Eliminar items de combo
    await supabase
        .from('promotion_combo_items')
        .delete()
        .eq('promotion_id_pci', promotionId);

    // 9. Eliminar la promoción
    const { error: deleteError } = await supabase
        .from('promotions')
        .delete()
        .eq('id_prm', promotionId);

    if (deleteError) {
        throw deleteError;
    }

    // 10. Sincronizar cuota de promociones para el negocio
    await syncResourceUsage(userId, 'promotion', businessId, 'business');
}

// ============================================
// Helpers
// ============================================

/**
 * Mapea un registro de BD a un item de lista para UI
 */
function mapRecordToListItem(record: PromotionRecord): PromotionListItem {
    // Obtener imagen de cover si existe - filtrar por prefijo del path
    const coverImage = record.promotion_images?.find((img) => {
        const prefix = img.path_pim.split('/').pop()?.split('-')[0];
        return prefix === 'flyer';
    });

    const coverUrl = coverImage
        ? getImageUrl(BUCKET_NAME, coverImage.path_pim)
        : null;

    // Extraer nombres de categorías con sus IDs
    const categories = record.promotion_category_map
        ?.map((pcm) => pcm.categories)
        .filter((cat): cat is { id_cat: string; name_cat: string } => !!cat && !!cat.id_cat && !!cat.name_cat)
        .map(cat => ({
            id: cat.id_cat,
            name: cat.name_cat
        })) ?? [];

    const categoryNames = categories.map(c => c.name);
    const categoryIds = categories.map(c => c.id);

    // Extraer IDs de productos (para scope: 'product')
    const productIds = record.promotion_products
        ?.map((pp) => pp.product_id_ppr)
        .filter((id): id is string => !!id) ?? [];

    // Extraer IDs de categorías de scope (para scope: 'category')
    const scopeCategoryIds = (record as any).promotion_scope_categories
        ?.map((psc: any) => psc.category_id_psc)
        .filter((id: string): id is string => !!id) ?? [];

    // Extraer items de combo (para scope: 'combo')
    const comboItems = (record as any).promotion_combo_items
        ?.map((pci: any) => ({
            productId: pci.product_id_pci,
            quantity: pci.quantity_pci,
            paidQuantity: pci.paid_quantity_pci ?? undefined,
        }))
        .filter((item: any) => item.productId) ?? [];

    // Determinar si está activa (aprobada y en rango de fechas)
    const now = new Date();
    const startDate = new Date(record.start_at_prm);
    const endDate = new Date(record.end_at_prm);
    const isActive =
        record.moderation_status_prm === 'approved' &&
        now >= startDate &&
        now <= endDate;

    const result = {
        id: record.id_prm,
        title: record.title_prm,
        description: record.description_prm,
        scope: record.scope_prm as PromotionScope,
        discountType: record.discount_type_prm as DiscountType,
        discountValue: record.discount_value_prm,
        startAt: record.start_at_prm,
        endAt: record.end_at_prm,
        moderationStatus: record.moderation_status_prm as ModerationStatus,
        businessId: record.business_id_prm,
        businessName: record.businesses?.name_bus ?? null,
        coverUrl,
        imageUrl: coverUrl, // Alias para compatibilidad con UserPromotionCard
        categoryNames,
        categoryIds,
        productIds,
        scopeCategoryIds,
        comboItems,
        isActive,
        createdAt: record.created_at_prm,
    };

    return result;
}
