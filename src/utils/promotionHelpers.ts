import type { PromotionListItem } from '@/types/entities';

/**
 * Calcula el precio con descuento aplicado según el tipo de promoción
 * @param originalPrice Precio original del producto
 * @param promotion Promoción a aplicar
 * @returns Precio con descuento o null si no aplica descuento
 */
export function calculateDiscountedPrice(
    originalPrice: number,
    promotion: PromotionListItem | null | undefined
): number | null {
    if (!promotion) return null;

    const { discountType, discountValue } = promotion;

    if (discountType === 'none' || discountValue <= 0) {
        return null;
    }

    if (discountType === 'percentage') {
        // Descuento porcentual
        const discountAmount = (originalPrice * discountValue) / 100;
        return Math.max(0, originalPrice - discountAmount);
    }

    if (discountType === 'fixed') {
        // Descuento fijo
        return Math.max(0, originalPrice - discountValue);
    }

    return null;
}

/**
 * Verifica si una promoción aplica a un producto específico
 * @param promotion Promoción a verificar
 * @param productId ID del producto
 * @returns true si la promoción aplica al producto
 */
export function doesPromotionApplyToProduct(
    promotion: PromotionListItem | null | undefined,
    productId: string
): boolean {
    if (!promotion) return false;

    const { scope, productIds } = promotion;

    // Promoción general aplica a todos los productos
    if (scope === 'general') {
        return true;
    }

    // Promoción específica de producto
    if (scope === 'product') {
        return productIds?.includes(productId) ?? false;
    }

    // Por ahora, category y combo no están implementados
    return false;
}

/**
 * Obtiene la promoción activa que aplica a un producto
 * @param promotions Lista de promociones del negocio
 * @param productId ID del producto
 * @returns La promoción activa que aplica o null
 */
export function getActivePromotionForProduct(
    promotions: PromotionListItem[] | undefined,
    productId: string
): PromotionListItem | null {
    if (!promotions || promotions.length === 0) return null;

    const now = new Date();

    // Buscar la primera promoción activa que aplique al producto
    for (const promo of promotions) {
        const startDate = new Date(promo.startAt);
        const endDate = new Date(promo.endAt);

        // Verificar que esté en el rango de fechas
        if (now >= startDate && now <= endDate) {
            // Verificar que aplique al producto
            if (doesPromotionApplyToProduct(promo, productId)) {
                return promo;
            }
        }
    }

    return null;
}
