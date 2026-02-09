/**
 * Servicio para obtener promociones públicas (aprobadas y activas)
 * Para mostrar en el listado público de promociones
 */

import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import type { PromotionListItem } from '@/types/entities';
import { getImageUrl } from './promotions.helpers';

// Database type aliases
type PromotionRow = Database['public']['Tables']['promotions']['Row'];
type BusinessRow = Database['public']['Tables']['businesses']['Row'];
type BusinessImageRow = Database['public']['Tables']['business_images']['Row'];
type PromotionImageRow = Database['public']['Tables']['promotion_images']['Row'];
type CategoryRow = Database['public']['Tables']['categories']['Row'];
type PromotionProductRow = Database['public']['Tables']['promotion_products']['Row'];
type PromotionScopeCategoryRow = Database['public']['Tables']['promotion_scope_categories']['Row'];
type PromotionComboItemRow = Database['public']['Tables']['promotion_combo_items']['Row'];

// ============================================
// Types
// ============================================

export interface PublicPromotionFilters {
  searchText?: string;
  categoryIds?: string[];
  province?: string;
  canton?: string;
  district?: string;
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
    business_images?:
      | {
          path_bim: string;
        }[]
      | null;
    locations?: {
      districts?: {
        name_dst: string;
        cantons?: {
          name_ctn: string;
          provinces?: {
            name_prv: string;
          } | null;
        } | null;
      } | null;
    } | null;
  } | null;
  promotion_images:
    | {
        path_pim: string;
      }[]
    | null;
  promotion_category_map: {
    categories: {
      id_cat: string;
      name_cat: string;
    } | null;
  }[];
  promotion_products?:
    | {
        product_id_ppr: string;
      }[]
    | null;
  promotion_scope_categories?:
    | {
        category_id_psc: string;
      }[]
    | null;
  promotion_combo_items?:
    | {
        product_id_pci: string;
        quantity_pci: number;
        paid_quantity_pci: number | null;
      }[]
    | null;
}

// ============================================
// GET - Obtener promociones públicas
// ============================================

/**
 * Obtiene todas las promociones públicas (aprobadas, pagadas y activas)
 */
export async function getPublicPromotions(
  filters: PublicPromotionFilters = {},
): Promise<PromotionListItem[]> {
  const { searchText, categoryIds, province, canton, district } = filters;
  const now = new Date().toISOString();

  let query = (supabase as any)
    .from('promotions')
    .select(
      `
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
                    path_bim
                ),
                locations (
                    districts (
                        name_dst,
                        cantons (
                            name_ctn,
                            provinces (
                                name_prv
                            )
                        )
                    )
                )
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
        `,
    )
    // Solo promociones aprobadas y activas
    .eq('moderation_status_prm', 'approved')
    .eq('is_active_prm', true)
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

  let promotions = ((data as unknown as PublicPromotionRecord[]) || []).map(mapRecordToListItem);

  // Filtrar por ubicación del negocio en JavaScript (más confiable que filtros anidados en Supabase)
  if (district || canton || province) {
    promotions = promotions.filter((promo) => {
      const promoRecord = (data as unknown as PublicPromotionRecord[]).find(
        (r) => r.id_prm === promo.id,
      );

      const districtName = promoRecord?.businesses?.locations?.districts?.name_dst;
      const cantonName = promoRecord?.businesses?.locations?.districts?.cantons?.name_ctn;
      const provinceName =
        promoRecord?.businesses?.locations?.districts?.cantons?.provinces?.name_prv;

      if (district) {
        return districtName?.toLowerCase() === district.toLowerCase();
      } else if (canton) {
        return cantonName?.toLowerCase() === canton.toLowerCase();
      } else if (province) {
        return provinceName?.toLowerCase() === province.toLowerCase();
      }
      return false;
    });
  }

  // Filtrar por categorías en JavaScript (post-query)
  if (categoryIds && categoryIds.length > 0) {
    promotions = promotions.filter((promo) => {
      // Obtener las categorías de la promoción del original
      const promoRecord = (data as unknown as PublicPromotionRecord[]).find(
        (r) => r.id_prm === promo.id,
      );
      const promoCategoryIds =
        promoRecord?.promotion_category_map?.map((pcm) => pcm.categories?.id_cat).filter(Boolean) ??
        [];
      return categoryIds.some((cid) => promoCategoryIds.includes(cid));
    });
  }

  return promotions;
}

/**
 * Obtiene las promociones activas de un negocio específico (públicas)
 * Para mostrar en la vista pública del negocio y aplicar descuentos
 */
export async function getBusinessActivePromotions(
  businessId: string,
): Promise<PromotionListItem[]> {
  const now = new Date().toISOString();

  const { data, error } = await (supabase as any)
    .from('promotions')
    .select(
      `
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
                    path_bim
                )
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
        `,
    )
    .eq('business_id_prm', businessId)
    .eq('moderation_status_prm', 'approved')
    .eq('is_active_prm', true)
    .lte('start_at_prm', now)
    .gte('end_at_prm', now)
    .order('start_at_prm', { ascending: false });

  if (error) {
    console.error('Error fetching business active promotions:', error);
    return [];
  }

  return ((data as unknown as PublicPromotionRecord[]) || []).map(mapRecordToListItem);
}

/**
 * Mapea un registro de BD a PromotionListItem
 */
function mapRecordToListItem(record: PublicPromotionRecord): PromotionListItem {
  // Obtener imagen de la promoción (flyer)
  // En V3, el tipo de imagen se extrae del path (flyer-*, cover-*, logo-*)
  const promoImage = record.promotion_images?.find((img) => {
    const prefix = img.path_pim.split('/').pop()?.split('-')[0];
    return prefix === 'flyer';
  });
  let imageUrl: string | null = null;

  if (promoImage) {
    // Bucket para promociones es 'promotions-images'
    imageUrl = getImageUrl('promotions-images', promoImage.path_pim);
  } else {
    // Fallback: usar imagen del negocio
    const businessCover = record.businesses?.business_images?.find((img) => {
      const prefix = img.path_bim.split('/').pop()?.split('-')[0];
      return prefix === 'cover';
    });
    const businessLogo = record.businesses?.business_images?.find((img) => {
      const prefix = img.path_bim.split('/').pop()?.split('-')[0];
      return prefix === 'logo';
    });
    const businessImg = businessCover || businessLogo;
    if (businessImg) {
      // Bucket para negocios es 'business-images'
      imageUrl = getImageUrl('business-images', businessImg.path_bim);
    }
  }

  // Obtener nombres de categorías con sus IDs
  const categories =
    record.promotion_category_map
      ?.map((pcm) => pcm.categories)
      .filter(
        (cat): cat is { id_cat: string; name_cat: string } =>
          !!cat && !!cat.id_cat && !!cat.name_cat,
      )
      .map((cat) => ({
        id: cat.id_cat,
        name: cat.name_cat,
      })) ?? [];

  const categoryNames = categories.map((c) => c.name);
  const categoryIds = categories.map((c) => c.id);

  // Obtener IDs de productos (para scope: 'product')
  const productIds =
    record.promotion_products?.map((pp) => pp.product_id_ppr).filter(Boolean) ?? [];

  // Obtener IDs de categorías de scope (para scope: 'category')
  const scopeCategoryIds =
    record.promotion_scope_categories?.map((psc) => psc.category_id_psc).filter(Boolean) ?? [];

  // Obtener items de combo (para scope: 'combo')
  const comboItems =
    record.promotion_combo_items
      ?.map((pci) => ({
        productId: pci.product_id_pci,
        quantity: pci.quantity_pci,
        paidQuantity: pci.paid_quantity_pci ?? undefined,
      }))
      .filter((item) => item.productId) ?? [];

  // Determinar si está activa
  const now = new Date();
  const startAt = new Date(record.start_at_prm);
  const endAt = new Date(record.end_at_prm);
  const isActive = startAt <= now && endAt >= now;

  // Construir locationLabel desde la ubicación del negocio
  const districtName = record.businesses?.locations?.districts?.name_dst;
  const cantonName = record.businesses?.locations?.districts?.cantons?.name_ctn;
  const provinceName = record.businesses?.locations?.districts?.cantons?.provinces?.name_prv;
  const locationParts = [provinceName, cantonName, districtName].filter(Boolean);
  const locationLabel = locationParts.length ? locationParts.join(', ') : null;

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
    moderationNote: null,
    businessId: record.business_id_prm,
    businessName: record.businesses?.name_bus ?? null,
    coverUrl: imageUrl,
    locationLabel,
    categoryNames,
    categoryIds,
    productIds,
    scopeCategoryIds,
    comboItems,
    isActive,
    createdAt: record.created_at_prm,
  };
}
