/**
 * Servicio para obtener promociones públicas (aprobadas y activas)
 * Para mostrar en el listado público de promociones
 */

import { supabase } from '@/lib/supabase/client';
import type { PromotionListItem } from '@/types/entities';
import { getImageUrl } from './promotions.helpers';

// ============================================
// Types
// ============================================

export interface PublicPromotionFilters {
    searchText?: string;
    categoryIds?: string[];
}

interface PublicPromotionRecord {
    id_prm: string;
    business_id_prm: string;
    scope_prm: string;
    title_prm: string;
    description_prm: string | null;
    discount_type_prm: string;
    discount_value_prm: number;
    start_at_prm: string;
    end_at_prm: string;
    created_at_prm: string;
    businesses: {
        id_bus: string;
        name_bus: string;
        business_images?: {
            image_type_bim: string;
            bucket_bim: string;
            path_bim: string;
        }[] | null;
    } | null;
    promotion_images: {
        image_type_pim: string;
        bucket_pim: string;
        path_pim: string;
    }[] | null;
    promotion_category_map: {
        categories: {
            id_cat: string;
            name_cat: string;
        } | null;
    }[];
}

// ============================================
// GET - Obtener promociones públicas
// ============================================

/**
 * Obtiene todas las promociones públicas (aprobadas, pagadas y activas)
 */
export async function getPublicPromotions(filters: PublicPromotionFilters = {}): Promise<PromotionListItem[]> {
    const { searchText, categoryIds } = filters;
    const now = new Date().toISOString();

    let query = supabase
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
            created_at_prm,
            businesses:business_id_prm (
                id_bus,
                name_bus,
                business_images (
                    image_type_bim,
                    bucket_bim,
                    path_bim
                )
            ),
            promotion_images (
                image_type_pim,
                bucket_pim,
                path_pim
            ),
            promotion_category_map (
                categories (
                    id_cat,
                    name_cat
                )
            )
        `)
        // Solo promociones aprobadas y con pago verificado
        .eq('moderation_status_prm', 'approved')
        .eq('payment_state_prm', 'verified')
        // Solo promociones vigentes
        .lte('start_at_prm', now)
        .gte('end_at_prm', now);

    // Filtrar por texto
    if (searchText && searchText.trim().length > 0) {
        const term = searchText.trim();
        query = query.or(`title_prm.ilike.%${term}%,description_prm.ilike.%${term}%`);
    }

    // Ordenar por placement_score (relevancia) y fecha de inicio
    query = query.order('start_at_prm', { ascending: false });

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching public promotions:', error);
        return [];
    }

    let promotions = (data as unknown as PublicPromotionRecord[] || []).map(mapRecordToListItem);

    // Filtrar por categorías en JavaScript (post-query)
    if (categoryIds && categoryIds.length > 0) {
        promotions = promotions.filter(promo => {
            // Obtener las categorías de la promoción del original
            const promoRecord = (data as unknown as PublicPromotionRecord[])
                .find(r => r.id_prm === promo.id);
            const promoCategoryIds = promoRecord?.promotion_category_map
                ?.map(pcm => pcm.categories?.id_cat)
                .filter(Boolean) ?? [];
            return categoryIds.some(cid => promoCategoryIds.includes(cid));
        });
    }

    return promotions;
}

/**
 * Mapea un registro de BD a PromotionListItem
 */
function mapRecordToListItem(record: PublicPromotionRecord): PromotionListItem {
    // Obtener imagen de la promoción (flyer)
    const promoImage = record.promotion_images?.find(img => img.image_type_pim === 'flyer');
    let imageUrl: string | null = null;

    if (promoImage) {
        imageUrl = getImageUrl(promoImage.bucket_pim, promoImage.path_pim);
    } else {
        // Fallback: usar imagen del negocio
        const businessCover = record.businesses?.business_images?.find(
            img => img.image_type_bim === 'cover'
        );
        const businessLogo = record.businesses?.business_images?.find(
            img => img.image_type_bim === 'logo'
        );
        const businessImg = businessCover || businessLogo;
        if (businessImg) {
            imageUrl = getImageUrl(businessImg.bucket_bim, businessImg.path_bim);
        }
    }

    // Obtener nombres de categorías
    const categoryNames = record.promotion_category_map
        ?.map(pcm => pcm.categories?.name_cat)
        .filter((name): name is string => !!name) ?? [];

    // Determinar si está activa
    const now = new Date();
    const startAt = new Date(record.start_at_prm);
    const endAt = new Date(record.end_at_prm);
    const isActive = startAt <= now && endAt >= now;

    return {
        id: record.id_prm,
        title: record.title_prm,
        description: record.description_prm,
        scope: record.scope_prm as any,
        discountType: record.discount_type_prm as any,
        discountValue: record.discount_value_prm,
        startAt: record.start_at_prm,
        endAt: record.end_at_prm,
        moderationStatus: 'approved',
        paymentState: 'paid',
        businessId: record.business_id_prm,
        businessName: record.businesses?.name_bus ?? null,
        imageUrl,
        categoryNames,
        isActive,
        createdAt: record.created_at_prm,
    };
}
