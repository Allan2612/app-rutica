import { memo, useCallback, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useThemedColors } from '@/hooks';
import { useBusinessProducts, useDeleteProduct } from '@/features/products/hooks';
import { ProductsHeader, ProductsEmptyState, ProductsList } from '@/components/manage';
import { styles } from './styles';

export const ManageProductsScreen = memo(function ManageProductsScreen() {
    const colors = useThemedColors();
    const router = useRouter();
    const { id: businessId, name: businessName } = useLocalSearchParams<{ id: string; name?: string }>();

    const { data: products = [], isLoading } = useBusinessProducts(businessId || '');
    const deleteMutation = useDeleteProduct(businessId || '');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    const handleAddProduct = useCallback(() => {
        router.push(`/(app)/(tabs)/manage/businesses/${businessId}/products/add`);
    }, [router, businessId]);

    const handleEditProduct = useCallback(
        (productId: string) => {
            router.push(`/(app)/(tabs)/manage/businesses/${businessId}/products/${productId}/edit`);
        },
        [router, businessId]
    );

    const handleDeleteProduct = useCallback(
        async (productId: string, productName: string) => {
            if (!confirm(`¿Estás seguro de eliminar "${productName}"?`)) {
                return;
            }

            try {
                setDeletingId(productId);
                await deleteMutation.mutateAsync(productId);
                Toast.show({
                    type: 'success',
                    text1: 'Producto eliminado',
                    text2: `"${productName}" ha sido eliminado correctamente`,
                    position: 'top',
                    visibilityTime: 3000,
                });
            } catch (error) {
                console.error('Error deleting product:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Error al eliminar',
                    text2: 'No se pudo eliminar el producto. Intenta de nuevo.',
                    position: 'top',
                    visibilityTime: 4000,
                });
            } finally {
                setDeletingId(null);
            }
        },
        [deleteMutation]
    );

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[500]} />
                    <Text style={[styles.emptyDescription, { color: colors.text.secondary, marginTop: 16 }]}>
                        Cargando productos...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ProductsHeader
                    businessName={businessName}
                    onBack={handleBack}
                    onAdd={handleAddProduct}
                />

                {products.length === 0 ? (
                    <ProductsEmptyState />
                ) : (
                    <ProductsList
                        products={products}
                        deletingId={deletingId}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                    />
                )}
            </ScrollView>
        </View>
    );
});
