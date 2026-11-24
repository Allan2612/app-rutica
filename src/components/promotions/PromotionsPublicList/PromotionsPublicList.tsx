/**
 * PromotionsPublicList Component
 * Lista de promociones públicas con soporte para múltiples columnas
 */

import { memo, type ReactElement, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, Pressable } from 'react-native';
import { router } from 'expo-router';
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
  /** Paginación (5.14): se llama al acercarse al final */
  onEndReached?: () => void;
  footer?: ReactElement | null;
  onPromotionPress?: (promotion: PromotionListItem) => void;
}

export const PromotionsPublicList = memo(function PromotionsPublicList({
  data,
  numColumns = 1,
  listKey,
  isRefreshing = false,
  onRefresh,
  onEndReached,
  footer,
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
          Todavía no hay ofertas activas
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
          Cuando los comercios publiquen descuentos, van a aparecer aquí.
        </Text>
        <Pressable
          onPress={() => router.push('/(app)/(tabs)/businesses?tab=commerces')}
          accessibilityRole="button"
          style={({ pressed }) => ({
            marginTop: 16,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: colors.primary[500],
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ color: colors.primary[600], fontWeight: '600' }}>Ver comercios</Text>
        </Pressable>
      </View>
    ),
    [colors],
  );

  const keyExtractor = useCallback((item: PromotionListItem) => item.id, []);

  return (
    <FlatList
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={footer}
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
