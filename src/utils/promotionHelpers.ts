import type { PromotionListItem } from '@/types/entities';
import type { DiscountType } from '@/types/enums';

/**
 * Genera el label para mostrar en el badge de una promoción
 * @param promotion Promoción completa
 * @returns Label formateado (ej: "2x1", "-10%", "-₡1000")
 */
export function getPromotionBadgeLabel(promotion: PromotionListItem): string {
    // Si es combo, usar generateComboLabel
    if (promotion.scope === 'combo' && promotion.comboItems && promotion.comboItems.length > 0) {
        return generateComboLabel(promotion.comboItems);
    }
    
    // Si es descuento, formatear según el tipo
    if (promotion.discountType === 'percentage') {
        return `-${promotion.discountValue}%`;
    }
    
    if (promotion.discountType === 'fixed') {
        return `-₡${promotion.discountValue.toLocaleString()}`;
    }
    
    return 'Promo';
}

/**
 * Genera el label del badge basado en tipo y valor de descuento (versión simplificada)
 * @param discountType Tipo de descuento
 * @param discountValue Valor del descuento
 * @returns Label formateado
 */
export function formatDiscountBadge(discountType: DiscountType | string, discountValue: number): string {
    if (discountType === 'percentage') {
        return `-${discountValue}%`;
    }
    return `-₡${discountValue.toLocaleString()}`;
}

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

    if (discountValue <= 0) {
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
 * @param productCategoryIds IDs de las categorías del producto (opcional, requerido para scope: 'category')
 * @returns true si la promoción aplica al producto
 */
export function doesPromotionApplyToProduct(
    promotion: PromotionListItem | null | undefined,
    productId: string,
    productCategoryIds?: string[]
): boolean {
    if (!promotion) return false;

    const { scope, productIds, scopeCategoryIds, comboItems } = promotion;

    // Promoción general aplica a todos los productos
    if (scope === 'all') {
        return true;
    }

    // Promoción específica de producto
    if (scope === 'products') {
        return productIds?.includes(productId) ?? false;
    }

    // Promoción por categoría - aplica si el producto pertenece a alguna de las categorías del scope
    if (scope === 'categories') {
        if (!productCategoryIds || productCategoryIds.length === 0) {
            return false;
        }
        return scopeCategoryIds?.some(catId => productCategoryIds.includes(catId)) ?? false;
    }

    // Promoción de combo - el producto está en el combo si es parte de los items
    if (scope === 'combo') {
        return comboItems?.some(item => item.productId === productId) ?? false;
    }

    return false;
}

/**
 * Verifica si un producto es parte de un combo y obtiene la cantidad requerida
 * @param promotion Promoción de tipo combo
 * @param productId ID del producto
 * @returns Cantidad requerida en el combo o 0 si no está en el combo
 */
export function getComboQuantityForProduct(
    promotion: PromotionListItem | null | undefined,
    productId: string
): number {
    if (!promotion || promotion.scope !== 'combo') return 0;
    
    const comboItem = promotion.comboItems?.find(item => item.productId === productId);
    return comboItem?.quantity ?? 0;
}

/**
 * Calcula el precio total del combo con descuento
 * @param promotion Promoción de tipo combo
 * @param productPrices Map de productId -> precio
 * @returns { originalTotal, discountedTotal, savings }
 */
export function calculateComboPrice(
    promotion: PromotionListItem | null | undefined,
    productPrices: Map<string, number>
): { originalTotal: number; discountedTotal: number; savings: number } | null {
    if (!promotion || promotion.scope !== 'combo' || !promotion.comboItems) {
        return null;
    }

    let originalTotal = 0;

    for (const item of promotion.comboItems) {
        const price = productPrices.get(item.productId) ?? 0;
        originalTotal += price * item.quantity;
    }

    const discountedTotal = calculateDiscountedPrice(originalTotal, promotion);
    
    if (discountedTotal === null) {
        return { originalTotal, discountedTotal: originalTotal, savings: 0 };
    }

    return {
        originalTotal,
        discountedTotal,
        savings: originalTotal - discountedTotal,
    };
}

/**
 * Obtiene TODAS las promociones activas que aplican a un producto
 * @param promotions Lista de promociones del negocio
 * @param productId ID del producto
 * @param productCategoryIds IDs de las categorías del producto (opcional)
 * @returns Array de promociones activas que aplican
 */
export function getAllActivePromotions(
    promotions: PromotionListItem[] | undefined,
    productId: string,
    productCategoryIds?: string[]
): PromotionListItem[] {
    if (!promotions || promotions.length === 0) return [];

    const now = new Date();
    const activePromotions: PromotionListItem[] = [];

    // Buscar TODAS las promociones activas que apliquen al producto
    for (const promo of promotions) {
        // FILTRAR: Solo mostrar promos aprobadas, pagadas y vigentes
        if (promo.moderationStatus !== 'approved' || promo.paymentState !== 'paid') {
            continue;
        }

        // Verificar que las fechas no sean null
        if (!promo.startAt || !promo.endAt) {
            continue;
        }

        const startDate = new Date(promo.startAt);
        const endDate = new Date(promo.endAt);

        // Verificar que esté en el rango de fechas
        if (now >= startDate && now <= endDate) {
            // Verificar que aplique al producto
            if (doesPromotionApplyToProduct(promo, productId, productCategoryIds)) {
                activePromotions.push(promo);
            }
        }
    }

    return activePromotions;
}

/**
 * Obtiene la primera promoción activa que aplica a un producto (legacy - usar getAllActivePromotions)
 * @param promotions Lista de promociones del negocio
 * @param productId ID del producto
 * @param productCategoryIds IDs de las categorías del producto (opcional)
 * @returns La promoción activa que aplica o null
 */
export function getActivePromotionForProduct(
    promotions: PromotionListItem[] | undefined,
    productId: string,
    productCategoryIds?: string[]
): PromotionListItem | null {
    const allPromotions = getAllActivePromotions(promotions, productId, productCategoryIds);
    return allPromotions.length > 0 ? allPromotions[0] : null;
}

/**
 * Genera una etiqueta descriptiva para un combo
 * Ej: "2x1", "3x2", "Combo"
 */
export function generateComboLabel(
    comboItems: { productId: string; quantity: number; paidQuantity?: number }[] | undefined
): string {
    if (!comboItems || comboItems.length === 0) return '';

    const uniqueProducts = comboItems.length;

    // Si es un solo producto, verificar si es un combo tipo "NxM"
    if (uniqueProducts === 1) {
        const item = comboItems[0];
        const takes = item.quantity;
        const pays = item.paidQuantity ?? item.quantity;
        
        // Siempre mostrar formato NxM si hay descuento de cantidad (ej: 3x2, 2x1)
        if (pays < takes) {
            return `${takes}x${pays}`;
        }
        
        // Si no hay descuento en cantidad pero hay cantidad > 1, mostrar cantidad
        if (takes > 1) {
            return `x${takes}`;
        }
    }

    // Si hay múltiples productos diferentes, revisar si todos tienen descuento similar
    if (uniqueProducts >= 2) {
        // Verificar si es un combo múltiple con mismo ratio (ej: 3 productos, todos 3x2)
        const firstItem = comboItems[0];
        const firstTakes = firstItem.quantity;
        const firstPays = firstItem.paidQuantity ?? firstItem.quantity;
        
        // Si todos tienen el mismo ratio de descuento
        const sameRatio = comboItems.every(item => {
            const takes = item.quantity;
            const pays = item.paidQuantity ?? item.quantity;
            return takes === firstTakes && pays === firstPays;
        });
        
        if (sameRatio && firstPays < firstTakes) {
            return `${firstTakes}x${firstPays}`;
        }
        
        return 'Combo';
    }

    return 'Combo';
}

/**
 * Verifica si una promoción es de tipo combo
 */
export function isComboPromotion(promotion: PromotionListItem | null | undefined): boolean {
    return promotion?.scope === 'combo';
}
