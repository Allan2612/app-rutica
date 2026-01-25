import { memo, useCallback } from 'react';
import { FlatList, Text, View, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Store } from 'lucide-react-native';
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
        hasActivePromotions={item.hasActivePromotions}
        onPress={() => handleBusinessPress(item.id)}
      />
    </View>
  );

  const emptyComponent = (
    <View style={styles.emptyState}>
      <Store size={48} color={colors.text.tertiary} strokeWidth={1.5} />
      <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>No hay comercios disponibles</Text>
      <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>Los comercios activos aparecerán aquí</Text>
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
