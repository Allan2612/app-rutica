import { memo, useCallback } from 'react';
import { ActivityIndicator, Text, View, useWindowDimensions, ScrollView, Pressable } from 'react-native';
import { Heart, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useFavoriteBusinesses } from '@/features/business/hooks/useFavoriteBusinesses';
import { BusinessCard } from '@/components/business/BusinessCard';
import { useThemedColors, useRefreshOnFocus } from '@/hooks';
import { useAuthStore } from '@/store';
import { Screen } from '@/components/layout';
import { BaseHeader } from '@/components/layout/Header';
import { BackButton } from '@/components/ui';
import { FlatList, RefreshControl } from 'react-native';
import type { BusinessListItem } from '@/features/business/hooks/useBusinesses';
import { styles } from './styles';

function FavoritesScreen() {
    const colors = useThemedColors();
    const { width } = useWindowDimensions();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const {
        data: favorites = [],
        isLoading,
        refetch,
        isRefetching,
    } = useFavoriteBusinesses();

    // Refrescar datos cuando la pantalla recibe foco
    useRefreshOnFocus(refetch);

    // Calcular número de columnas según el ancho
    const numColumns = width > 768 ? 3 : width > 600 ? 2 : 1;

    const handleBusinessPress = useCallback((businessId: string) => {
        router.push(`/(app)/(tabs)/businesses/${businessId}`);
    }, []);

    const handleBack = useCallback(() => {
        router.back();
    }, []);

    const renderItem = ({ item }: { item: BusinessListItem }) => (
        <View style={[styles.cardWrapper, { width: numColumns === 1 ? '100%' : numColumns === 2 ? '48%' : '32%' }]}>
            <BusinessCard
                id={item.id}
                name={item.name}
                categoryNames={item.categoryNames}
                categoryIds={item.categoryIds}
                locationLabel={item.locationLabel}
                imageUrl={item.imageUrl ?? undefined}
                logoUrl={item.logoUrl ?? undefined}
                rating={item.rating}
                reviewCount={item.reviewCount}
                isApproved={item.isApproved}
                hasActivePromotions={item.hasActivePromotions}
                onPress={() => handleBusinessPress(item.id)}
            />
        </View>
    );

    // Si no está autenticado
    if (!isAuthenticated) {
        return (
            <Screen>
                <BaseHeader />
                <View style={[styles.container, styles.centered, { backgroundColor: colors.background.secondary }]}>
                    <Heart size={64} color={colors.text.tertiary} strokeWidth={1.5} />
                    <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                        Inicia sesión para ver tus favoritos
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
                        Guarda tus negocios favoritos para acceder a ellos rápidamente
                    </Text>
                </View>
            </Screen>
        );
    }

    if (isLoading) {
        return (
            <Screen>
                <BaseHeader />
                <View style={[styles.container, styles.centered, { backgroundColor: colors.background.secondary }]}>
                    <ActivityIndicator size="large" color={colors.primary[500]} />
                    <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                        Cargando favoritos...
                    </Text>
                </View>
            </Screen>
        );
    }

    const emptyComponent = (
        <View style={styles.emptyState}>
            <Heart size={64} color={colors.text.tertiary} strokeWidth={1.5} />
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                No tienes favoritos aún
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
                Explora negocios y presiona el corazón para guardarlos aquí
            </Text>
        </View>
    );

    return (
        <Screen>
            <BaseHeader />
            <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
                {/* Page Header con BackButton */}
                <View style={styles.headerWithBack}>
                    <BackButton onPress={handleBack} />
                    <View style={styles.headerContent}>
                        <Text style={[styles.title, { color: colors.text.primary }]}>
                            Mis Favoritos
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                            {favorites.length} {favorites.length === 1 ? 'negocio guardado' : 'negocios guardados'}
                        </Text>
                    </View>
                </View>

                {/* Lista de favoritos */}
                <FlatList
                    key={`favorites-${numColumns}`}
                    data={favorites}
                    keyExtractor={(item) => item.id}
                    numColumns={numColumns}
                    columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    ListEmptyComponent={emptyComponent}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={refetch}
                            tintColor={colors.primary[500]}
                            colors={[colors.primary[500]]}
                        />
                    }
                />
            </View>
        </Screen>
    );
}

export default memo(FavoritesScreen);
