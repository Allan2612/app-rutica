import { memo, useCallback } from 'react';
import { FlatList, Text, View, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { BusinessCard } from '@/components/business/BusinessCard';
import { BusinessListItem } from '@/features/business/hooks/useBusinesses';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface BusinessesListProps {
  data: BusinessListItem[];
  numColumns: number;
  listKey: string;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export const BusinessesList = memo(function BusinessesList({
  data,
  numColumns,
  listKey,
  isRefreshing = false,
  onRefresh,
}: BusinessesListProps) {
  const colors = useThemedColors();
  const router = useRouter();

  const handleBusinessPress = useCallback((businessId: string) => {
    router.push(`/(app)/(tabs)/businesses/${businessId}`);
  }, [router]);

  const renderItem = ({ item }: { item: BusinessListItem }) => (
    <View style={[styles.cardWrapper, { width: numColumns === 1 ? '100%' : numColumns === 2 ? '48%' : '32%' }]}>
      <BusinessCard
        name={item.name}
        categoryNames={item.categoryNames}
        categoryIds={item.categoryIds}
        locationLabel={item.locationLabel}
        imageUrl={item.imageUrl ?? undefined}
        logoUrl={item.logoUrl ?? undefined}
        rating={item.rating}
        reviewCount={item.reviewCount}
        isApproved={item.isApproved}
        onPress={() => handleBusinessPress(item.id)}
      />
    </View>
  );

  const emptyComponent = (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
        No hay comercios disponibles
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
        Prueba ajustando la búsqueda o selecciona otra categoría.
      </Text>
    </View>
  );

  return (
    <FlatList
      key={listKey}
      data={data}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      ListEmptyComponent={emptyComponent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary[500]}
            colors={[colors.primary[500]]}
          />
        ) : undefined
      }
    />
  );
});
