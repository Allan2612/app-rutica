import { memo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { BusinessCard } from '@/components/business';
import { BusinessListItem } from '@/features/business/hooks/useBusinesses';
import { styles } from './styles';

export interface BusinessesListProps {
  data: BusinessListItem[];
  numColumns: number;
  listKey: string;
}

export const BusinessesList = memo(function BusinessesList({
  data,
  numColumns,
  listKey,
}: BusinessesListProps) {
  const renderItem = ({ item }: { item: BusinessListItem }) => (
    <View style={[styles.cardWrapper, { width: numColumns === 1 ? '100%' : numColumns === 2 ? '48%' : '32%' }]}>
      <BusinessCard
        name={item.name}
        description={item.description}
        categoryName={item.categoryName}
        categoryId={item.categoryId}
        locationLabel={item.locationLabel}
        imageUrl={item.imageUrl ?? undefined}
        logoUrl={item.logoUrl ?? undefined}
        rating={item.rating}
        reviewCount={item.reviewCount}
      />
    </View>
  );

  const emptyComponent = (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No hay comercios disponibles</Text>
      <Text style={styles.emptySubtitle}>
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
    />
  );
});
