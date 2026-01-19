import { memo } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Package } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useBusinessProducts } from '@/features/products/hooks/useBusinessProducts';
import { ProductCard } from '../ProductCard';
import { styles } from './styles';

interface BusinessProductsProps {
    businessId: string;
}

export const BusinessProducts = memo(function BusinessProducts({ businessId }: BusinessProductsProps) {
    const colors = useThemedColors();
    const { data: products = [], isLoading } = useBusinessProducts(businessId);

    // Si no hay productos, no mostrar nada
    if (!isLoading && products.length === 0) {
        return null;
    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>
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
            <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>
                Nuestros Productos
            </Text>

            <FlatList
                data={products}
                renderItem={({ item }) => (
                    <ProductCard
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        currency={item.currency}
                        imageUrls={item.imageUrls}
                    />
                )}
                keyExtractor={(item) => item.id}
                numColumns={3}
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
