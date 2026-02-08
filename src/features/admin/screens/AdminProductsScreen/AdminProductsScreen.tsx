import { useState, memo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, RefreshControl } from 'react-native';
import { Package } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useThemedColors, useRefreshOnFocus } from '@/hooks';
import { BackButton } from '@/components/ui';
import { ProductFilters, AdminProductCard, ProductStatsCards } from '@/components/admin';
import type { ProductsFilters } from '@/types/entities/product';
import {
    useAdminProducts,
    useProductsStats,
    useDeleteProductAsAdmin,
} from '@/features/admin/hooks/useAdminProducts';
import { styles } from './styles';

export const AdminProductsScreen = memo(function AdminProductsScreen() {
    const colors = useThemedColors();
    const [filters, setFilters] = useState<ProductsFilters>({});

    const { data: products, isLoading, error, refetch, isFetching } = useAdminProducts(filters);
    const { data: stats, refetch: refetchStats } = useProductsStats();
    const deleteProduct = useDeleteProductAsAdmin();

    // Refrescar datos cuando la pantalla recibe foco
    useRefreshOnFocus(refetch);
    useRefreshOnFocus(refetchStats);

    const handleDeleteProduct = async (productId: string) => {
        try {
            await deleteProduct.mutateAsync(productId);
            Toast.show({
                type: 'success',
                text1: 'Producto eliminado',
                text2: 'El producto ha sido eliminado correctamente',
                position: 'top',
            });
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo eliminar el producto. Verifica tus permisos de administrador.',
                position: 'top',
            });
            throw error;
        }
    };



    return (
        <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={refetch}
                        tintColor={colors.primary[500]}
                        colors={[colors.primary[500]]}
                    />
                }
            >
                <View style={styles.contentWrapper}>
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
                        <View style={styles.headerRow}>
                            <BackButton href="/(app)/(tabs)/manage/admin" />
                            <View style={styles.headerContent}>
                                <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                                    Gestión de Productos
                                </Text>
                                <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                                    Administra todos los productos de la plataforma
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Stats Cards */}
                    {stats && (
                        <View style={styles.statsContainer}>
                            <ProductStatsCards
                                totalProducts={stats.totalProducts}
                                activeProducts={stats.activeProducts}
                                inactiveProducts={stats.inactiveProducts}
                                averagePrice={stats.averagePrice}
                            />
                        </View>
                    )}

                    {/* Filters */}
                    <View style={styles.filtersContainer}>
                        <ProductFilters filters={filters} onFiltersChange={setFilters} />
                    </View>

                    {/* Products List */}
                    <View style={styles.listContainer}>
                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={colors.primary[500]} />
                                <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                                    Cargando productos...
                                </Text>
                            </View>
                        ) : error ? (
                            <View style={styles.errorContainer}>
                                <Text style={[styles.errorText, { color: colors.error[600] }]}>
                                    Error al cargar los productos
                                </Text>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.retryButton,
                                        {
                                            backgroundColor: colors.primary[500],
                                            opacity: pressed ? 0.8 : 1,
                                        },
                                    ]}
                                    onPress={() => refetch()}
                                >
                                    <Text style={[styles.retryButtonText, { color: colors.text.inverse }]}>
                                        Reintentar
                                    </Text>
                                </Pressable>
                            </View>
                        ) : products && products.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Package color={colors.text.tertiary} size={48} strokeWidth={1.5} />
                                <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                                    No hay productos
                                </Text>
                                <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
                                    No se encontraron productos con los filtros seleccionados
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.productsList}>
                                {products?.map((product) => (
                                    <AdminProductCard
                                        key={product.id}
                                        product={product}
                                        onDelete={handleDeleteProduct}
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
});
