/**
 * PromotionsList Component
 * Lista de promociones con soporte para FlatList
 * TODO: Implementar diseño completo
 */

import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useThemedColors } from '@/hooks';
import { PromotionListItem } from '@/types/entities';
import { PromotionCard } from '../PromotionCard';
import { styles } from './styles';

interface PromotionsListProps {
  promotions: PromotionListItem[];
  isLoading?: boolean;
  onPromotionPress?: (promotion: PromotionListItem) => void;
  emptyMessage?: string;
  ListHeaderComponent?: React.ReactElement;
}

export function PromotionsList({
  promotions,
  isLoading = false,
  onPromotionPress,
  emptyMessage = 'No hay promociones disponibles',
  ListHeaderComponent,
}: PromotionsListProps) {
  const colors = useThemedColors();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  const renderItem = ({ item }: { item: PromotionListItem }) => (
    <PromotionCard promotion={item} onPress={onPromotionPress} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.text.secondary }]}>{emptyMessage}</Text>
    </View>
  );

  return (
    <FlatList
      data={promotions}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={renderEmpty}
      ListHeaderComponent={ListHeaderComponent}
      showsVerticalScrollIndicator={false}
    />
  );
}
