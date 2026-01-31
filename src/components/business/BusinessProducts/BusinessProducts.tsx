import { memo, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, Platform } from 'react-native';
import { Package } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useBusinessProducts } from '@/features/products/hooks/useBusinessProducts';
import { useBusinessActivePromotions } from '@/features/promotions/hooks';
import { getAllActivePromotions, isComboPromotion } from '@/utils';
import { ProductCard } from '../ProductCard';
import { ProductComboCard } from '../ProductComboCard';
import { styles } from './styles';

interface BusinessProductsProps {
    businessId: string;
    onImagePress?: (imageUrl: string) => void;
}

export const BusinessProducts = memo(function BusinessProducts({ businessId, onImagePress }: BusinessProductsProps) {
    const colors = useThemedColors();
    const { data: products = [], isLoading } = useBusinessProducts(businessId);
    const { data: promotions = [] } = useBusinessActivePromotions(businessId);

    // Identificar combos mixtos (múltiples productos diferentes)
    const mixedCombos = useMemo(() => {
        // Solo combos con items
        return promotions.filter(promo => 
            isComboPromotion(promo) && promo.comboItems.length > 0
        );
    }, [promotions]);

    // Combinar productos regulares + combos mixtos
    const allItems = useMemo(() => {
        const items: Array<{ type: 'product' | 'combo'; data: any }> = [];

        // Agregar productos regulares
        products.forEach(product => {
            items.push({ type: 'product', data: product });
        });

        // Agregar combos mixtos como productos especiales
        mixedCombos.forEach(combo => {
            items.push({ type: 'combo', data: combo });
        });

        return items;
    }, [products, mixedCombos]);

    // Si no hay productos ni combos, no mostrar nada
    if (!isLoading && allItems.length === 0) {
        return null;
    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                    Nuestros Productos
                </Text>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[500]} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Nuestros Productos {mixedCombos.length > 0}
            </Text>

            <FlatList
                data={allItems}
                renderItem={({ item }) => {
                    if (item.type === 'combo') {
                        return (
                            <ProductComboCard
                                promotion={item.data}
                                products={products.map(p => ({
                                    id: p.id,
                                    name: p.name,
                                    price: p.price,
                                    imageUrl: p.imageUrls?.[0] || null,
                                }))}
                            />
                        );
                    }

                    return (
                        <ProductCard
                            productId={item.data.id}
                            name={item.data.name}
                            description={item.data.description}
                            price={item.data.price}
                            currency={item.data.currency}
                            imageUrls={item.data.imageUrls}
                            categoryIds={item.data.categoryIds}
                            categoryNames={item.data.categoryNames}
                            rating={item.data.rating}
                            reviewCount={item.data.reviewCount}
                            promotions={promotions}
                            onImagePress={onImagePress}
                        />
                    );
                }}
                keyExtractor={(item) =>
                    item.type === 'combo'
                        ? `combo-${item.data.id}`
                        : `product-${item.data.id}`
                }
                numColumns={Platform.OS === 'web' ? 2 : 2}
                columnWrapperStyle={styles.row}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Package size={48} color={colors.text.tertiary} />
                        <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                            No hay productos disponibles
                        </Text>
                    </View>
                }
            />
        </View>
    );
});
