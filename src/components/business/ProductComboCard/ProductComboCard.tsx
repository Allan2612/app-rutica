/**
 * ProductComboCard Component
 * Muestra combos mixtos (múltiples productos) como un producto especial
 * Ejemplo: 2 Hamburguesas + 1 Refresco + 1 Papas = Combo Especial
 */

import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Package } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useThemedColors } from '@/hooks';
import { getPromotionBadgeLabel, formatPrice } from '@/utils';
import { PromoBadge } from '@/components/ui';
import type { PromotionListItem } from '@/types/entities';
import { styles } from './styles';

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
}

interface ProductComboCardProps {
    promotion: PromotionListItem;
    products: Product[];
    onPress?: () => void;
}

export const ProductComboCard = memo(function ProductComboCard({
    promotion,
    products,
    onPress,
}: ProductComboCardProps) {
    const colors = useThemedColors();
    
    // Calcular productos del combo con sus cantidades y precio que se paga
    const comboProducts = promotion.comboItems
        .map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return null;
            // Usar paidQuantity si existe, sino usar quantity
            const paidQty = item.paidQuantity ?? item.quantity;
            return { 
                ...product, 
                quantity: item.quantity,
                paidQuantity: paidQty
            };
        })
        .filter(Boolean) as (Product & { quantity: number; paidQuantity: number })[];
    
    // Calcular valor total del combo (lo que el cliente paga)
    const comboTotalValue = comboProducts.reduce(
        (sum, p) => sum + (p.price * p.paidQuantity), 
        0
    );
    
    // Calcular valor original (si fuera sin descuento de cantidad)
    const originalTotalValue = comboProducts.reduce(
        (sum, p) => sum + (p.price * p.quantity), 
        0
    );
    
    // Aplicar descuento adicional si existe
    let finalPrice = comboTotalValue;
    let hasAdditionalDiscount = false;
    
    if (promotion.discountType === 'percentage' && promotion.discountValue > 0) {
        finalPrice = comboTotalValue - (comboTotalValue * promotion.discountValue / 100);
        hasAdditionalDiscount = true;
    } else if (promotion.discountType === 'fixed' && promotion.discountValue > 0) {
        finalPrice = Math.max(0, comboTotalValue - promotion.discountValue);
        hasAdditionalDiscount = true;
    }
    
    const hasSavings = finalPrice < originalTotalValue;
    
    const comboLabel = getPromotionBadgeLabel(promotion as any);
    
    // Mostrar las primeras 3 imágenes de productos en el combo
    const displayImages = comboProducts
        .filter(p => p.imageUrl)
        .slice(0, 3)
        .map(p => p.imageUrl!);

    return (
        <Pressable
            style={[styles.card, { 
                backgroundColor: colors.background.primary, 
                borderColor: colors.primary[500],
            }]}
            onPress={onPress}
            disabled={!onPress}
        >
            {/* Badge de Combo */}
            <View style={styles.badgeContainer}>
                <PromoBadge label={comboLabel} size="small" />
            </View>

            {/* Images Grid */}
            <View style={styles.imagesContainer}>
                {displayImages.length > 0 ? (
                    <View style={styles.imagesGrid}>
                        {displayImages.map((imageUrl, index) => (
                            <Image
                                key={`${imageUrl}-${index}`}
                                source={{ uri: imageUrl }}
                                style={[
                                    styles.comboImage,
                                    displayImages.length === 1 && styles.comboImageFull,
                                    displayImages.length === 2 && styles.comboImageHalf,
                                ]}
                                contentFit="cover"
                                transition={200}
                            />
                        ))}
                    </View>
                ) : (
                    <View style={[styles.placeholderImage, { backgroundColor: colors.background.tertiary }]}>
                        <Package size={48} color={colors.text.tertiary} />
                    </View>
                )}
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Title */}
                <View style={styles.titleRow}>
                    <Package size={16} color={colors.primary[500]} />
                    <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={1}>
                        {promotion.title}
                    </Text>
                </View>

                {/* Productos incluidos */}
                <View style={styles.productsContainer}>
                    {comboProducts.map((product, index) => {
                        // Generar label correcto para cada producto
                        const quantityLabel = product.paidQuantity < product.quantity
                            ? `${product.quantity}x${product.paidQuantity}`
                            : `x${product.quantity}`;
                        
                        return (
                            <View key={`${product.id}-${index}`} style={styles.productRow}>
                                <Text style={[styles.productName, { color: colors.text.secondary }]} numberOfLines={1}>
                                    {product.name}
                                </Text>
                                <View style={styles.quantityBadge}>
                                    <Text style={styles.quantityText}>
                                        {quantityLabel}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
                
                {/* Precio del Combo */}
                <View style={[styles.priceRow, { borderTopColor: colors.border.light }]}>
                    {hasSavings ? (
                        <View style={styles.priceColumn}>
                            <Text style={[styles.originalPrice, { color: colors.text.tertiary }]}>
                                {formatPrice(originalTotalValue)}
                            </Text>
                            <Text style={[styles.comboPrice, { color: colors.success }]}>
                                {formatPrice(finalPrice)}
                            </Text>
                        </View>
                    ) : (
                        <Text style={[styles.comboPrice, { color: colors.primary[500] }]}>
                            {formatPrice(finalPrice)}
                        </Text>
                    )}
                </View>
            </View>
        </Pressable>
    );
});
