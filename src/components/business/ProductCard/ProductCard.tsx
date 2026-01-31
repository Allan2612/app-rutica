import { memo, useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { getAllActivePromotions, calculateDiscountedPrice, isComboPromotion, getPromotionBadgeLabel, formatPrice } from '@/utils';
import type { PromotionListItem } from '@/types/entities';
import { ProductImageCarousel } from '../ProductImageCarousel';
import { CategoryChips, PromoBadge } from '@/components/ui';
import { ProductReviewsModal } from '../ProductReviewsModal';
import { styles } from './styles';

interface ProductCardProps {
    productId: string;
    name: string;
    description?: string | null;
    price: number;
    currency: string;
    imageUrl?: string | null;
    imageUrls?: string[];
    categoryIds?: string[];
    categoryNames?: string[];
    promotions?: PromotionListItem[];
    onImagePress?: (imageUrl: string) => void;
}

export const ProductCard = memo(function ProductCard({
    productId,
    name,
    description,
    price,
    currency,
    imageUrl,
    imageUrls = [],
    categoryIds = [],
    categoryNames = [],
    promotions,
    onImagePress,
}: ProductCardProps) {
    const colors = useThemedColors();
    const [cardWidth, setCardWidth] = useState(0);
    const [showAllBadges, setShowAllBadges] = useState(false);
    const [showReviewsModal, setShowReviewsModal] = useState(false);

    const images = imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : [];

    // Obtener TODAS las promociones activas para este producto
    const activePromotions = getAllActivePromotions(promotions, productId, categoryIds);
    
    // Separar promos por tipo: combos vs descuentos
    const comboPromotions = activePromotions.filter(p => isComboPromotion(p));
    const discountPromotions = activePromotions.filter(p => !isComboPromotion(p));
    
    // Separar descuentos por tipo: porcentuales y fijos
    const percentageDiscounts = discountPromotions.filter(p => p.discountType === 'percentage');
    const fixedDiscounts = discountPromotions.filter(p => p.discountType === 'fixed');
    
    // Aplicar TODOS los descuentos acumulativamente
    // IMPORTANTE: Primero porcentajes, luego fijos
    let finalPrice = price;
    
    // 1. Aplicar descuentos porcentuales
    for (const promo of percentageDiscounts) {
        const discounted = calculateDiscountedPrice(finalPrice, promo);
        if (discounted !== null && discounted < finalPrice) {
            finalPrice = discounted;
        }
    }
    
    // 2. Aplicar descuentos fijos
    for (const promo of fixedDiscounts) {
        const discounted = calculateDiscountedPrice(finalPrice, promo);
        if (discounted !== null && discounted < finalPrice) {
            finalPrice = discounted;
        }
    }
    
    const hasDiscount = finalPrice < price;

    const onLayout = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setCardWidth(width);
    };

    const totalBadges = comboPromotions.length + discountPromotions.length;
    const isMobile = Platform.OS !== 'web';
    const shouldShowExpander = isMobile && totalBadges > 1 && !showAllBadges;
    
    // En mobile mostrar solo el primero, en web mostrar todos
    const combosToShow = isMobile && !showAllBadges ? comboPromotions.slice(0, totalBadges > 1 ? 1 : comboPromotions.length) : comboPromotions;
    const discountsToShow = isMobile && !showAllBadges 
        ? (comboPromotions.length === 0 ? discountPromotions.slice(0, 1) : []) 
        : discountPromotions;

    return (
        <View style={[styles.card, { backgroundColor: colors.background.primary, borderColor: colors.border.medium }]}>
            {/* Badges Container - Múltiples badges para diferentes tipos de promos */}
            {(comboPromotions.length > 0 || discountPromotions.length > 0) && (
                <View style={styles.badgesContainer}>
                    {/* Combo Badges */}
                    {combosToShow.map((comboPromo, index) => {
                        const comboLabel = getPromotionBadgeLabel(comboPromo as any);
                        return (
                            <PromoBadge 
                                key={`combo-${comboPromo.id}-${index}`}
                                label={comboLabel}
                                size="small"
                            />
                        );
                    })}
                    
                    {/* Discount Badges */}
                    {discountsToShow.map((discountPromo, index) => {
                        const discountLabel = getPromotionBadgeLabel(discountPromo as any);
                        return (
                            <PromoBadge 
                                key={`discount-${discountPromo.id}-${index}`}
                                label={discountLabel}
                                size="small"
                            />
                        );
                    })}
                    
                    {/* Expander button en mobile */}
                    {shouldShowExpander && (
                        <Pressable 
                            style={[styles.expanderBadge, { backgroundColor: colors.primary[500] }]}
                            onPress={() => setShowAllBadges(true)}
                        >
                            <Text style={styles.expanderText}>+{totalBadges - 1}</Text>
                        </Pressable>
                    )}
                </View>
            )}
            
            <ProductImageCarousel images={images} cardWidth={cardWidth} onLayout={onLayout} onImagePress={onImagePress} />

            <View style={styles.content}>
                <Text style={[styles.name, { color: colors.text.primary }]} numberOfLines={1}>
                    {name}
                </Text>

                <CategoryChips
                    categoryNames={categoryNames}
                    categoryIds={categoryIds}
                    maxVisible={2}
                />

                {description && (
                    <Text style={[styles.description, { color: colors.text.secondary }]} numberOfLines={2}>
                        {description}
                    </Text>
                )}

                {hasDiscount ? (
                    <View style={styles.priceContainer}>
                        <Text 
                            style={[styles.originalPrice, { color: colors.text.tertiary }]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {formatPrice(price, currency)}
                        </Text>
                        <Text 
                            style={[styles.discountedPrice, { color: colors.success }]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {formatPrice(finalPrice, currency)}
                        </Text>
                    </View>
                ) : (
                    <Text 
                        style={[styles.price, { color: colors.primary[500] }]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        {formatPrice(price, currency)}
                    </Text>
                )}

                {/* Ver opiniones button */}
                <Pressable 
                    style={({ pressed }) => [
                        styles.reviewsButton, 
                        { 
                            borderColor: colors.primary[500],
                            backgroundColor: pressed ? colors.primary[50] : 'transparent'
                        }
                    ]}
                    onPress={() => setShowReviewsModal(true)}
                >
                    <MessageCircle size={18} color={colors.primary[500]} />
                    <Text style={[styles.reviewsButtonText, { color: colors.primary[500] }]}>
                        Ver opiniones
                    </Text>
                </Pressable>
            </View>

            <ProductReviewsModal
                visible={showReviewsModal}
                productId={productId}
                productName={name}
                productImage={images[0]}
                onClose={() => setShowReviewsModal(false)}
            />
        </View>
    );
});
