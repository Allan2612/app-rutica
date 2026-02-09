/**
 * PromotionsPublicList Component
 * Lista de promociones públicas con soporte para múltiples columnas
 */

import { memo, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { Tag } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { PromotionPublicCard } from '../PromotionPublicCard';
import type { PromotionListItem } from '@/types/entities';
import { styles } from './styles';

interface PromotionsPublicListProps {
  data: PromotionListItem[];
  numColumns?: number;
  listKey?: string;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onPromotionPress?: (promotion: PromotionListItem) => void;
}

export const PromotionsPublicList = memo(function PromotionsPublicList({
  data,
  numColumns = 1,
  listKey,
  isRefreshing = false,
  onRefresh,
  onPromotionPress,
}: PromotionsPublicListProps) {
  const colors = useThemedColors();

  const renderItem = useCallback(
    ({ item }: { item: PromotionListItem }) => (
      <View
        style={[
          styles.cardWrapper,
          { width: numColumns === 1 ? '100%' : numColumns === 2 ? '48%' : '32%' },
        ]}
      >
        <PromotionPublicCard promotion={item} onPress={onPromotionPress} />
      </View>
    ),
    [numColumns, onPromotionPress],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Tag size={48} color={colors.text.tertiary} strokeWidth={1.5} />
        <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
          No hay promociones disponibles
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
          Las promociones activas aparecerán aquí
        </Text>
      </View>
    ),
    [colors],
  );

  const keyExtractor = useCallback((item: PromotionListItem) => item.id, []);

  return (
    <FlatList
      key={listKey}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary[500]]}
            tintColor={colors.primary[500]}
          />
        ) : undefined
      }
    />
  );
});
