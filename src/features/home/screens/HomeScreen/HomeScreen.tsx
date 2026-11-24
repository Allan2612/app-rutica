/**
 * HomeScreen — inicio "buscar primero": saludo, buscador y categorías arriba, y carruseles
 * con contenido real (comercios, lugares, ofertas, eventos). Las secciones vacías no se muestran.
 */

import { memo, useCallback, useMemo } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator, Text, Pressable } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { useThemedColors, useRefreshOnFocus } from '@/hooks';
import { useHomeData } from '../../hooks/useHomeData';
import {
  HomeSearchHeader,
  FeaturedPromotions,
  FeaturedBusinesses,
  FeaturedEvents,
  FeaturedAttractions,
  CallToAction,
} from '../../../../components/home';
import { styles } from './styles';

export const HomeScreen = memo(function HomeScreen() {
  const colors = useThemedColors();
  const { promotions, businesses, events, attractions, isLoading, isError, refetch } =
    useHomeData();

  // Accesos por categoría: solo las que tienen comercios destacados (nunca llevan a una lista vacía)
  const categoryChips = useMemo(() => {
    const seen = new Map<string, string>();
    for (const b of businesses.data ?? []) {
      b.categoryIds.forEach((id, i) => {
        const name = b.categoryNames[i];
        if (id && name && !seen.has(id)) seen.set(id, name);
      });
    }
    return [...seen].slice(0, 10).map(([id, name]) => ({ id, name }));
  }, [businesses.data]);
  const hasPromotions = (promotions.data?.length ?? 0) > 0;
  const hasEvents = (events.data?.length ?? 0) > 0;

  // Refrescar datos cuando la pantalla recibe foco
  useRefreshOnFocus(refetch);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const isRefreshing =
    promotions.isFetching || businesses.isFetching || events.isFetching || attractions.isFetching;

  // Initial loading state
  if (isLoading && !businesses.data && !attractions.data) {
    return (
      <View
        style={[
          styles.container,
          styles.loadingContainer,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  // Error state
  if (isError && !businesses.data && !attractions.data) {
    return (
      <View
        style={[
          styles.container,
          styles.errorContainer,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <AlertTriangle size={48} color={colors.error} strokeWidth={1.5} />
        <Text style={[styles.errorText, { color: colors.text.secondary }]}>
          No pudimos cargar el contenido. Por favor, intenta de nuevo.
        </Text>
        <Pressable
          style={[styles.retryButton, { backgroundColor: colors.primary[500] }]}
          onPress={handleRefresh}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary[500]]}
            tintColor={colors.primary[500]}
          />
        }
      >
        <HomeSearchHeader categories={categoryChips} />

        <FeaturedBusinesses businesses={businesses.data ?? []} isLoading={businesses.isLoading} />

        <FeaturedAttractions
          attractions={attractions.data ?? []}
          isLoading={attractions.isLoading}
        />

        {(promotions.isLoading || hasPromotions) && (
          <FeaturedPromotions promotions={promotions.data ?? []} isLoading={promotions.isLoading} />
        )}

        {(events.isLoading || hasEvents) && (
          <FeaturedEvents events={events.data ?? []} isLoading={events.isLoading} />
        )}

        {/* Call to Action for Non-Sellers */}
        <CallToAction />
      </ScrollView>
    </View>
  );
});
