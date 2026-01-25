/**
 * PromotionsList Component
 * Lista de promociones con soporte para FlatList
 * TODO: Implementar diseño completo
 */

import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { PromotionListItem } from '@/types/entities';
import { PromotionCard } from '../PromotionCard';

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
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: PromotionListItem }) => (
    <PromotionCard promotion={item} onPress={onPromotionPress} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
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

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});




