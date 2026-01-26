/**
 * PromotionsPublicList Component
 * Lista de promociones públicas con soporte para múltiples columnas
 */

import { memo, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, useWindowDimensions } from 'react-native';
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
    const { width } = useWindowDimensions();

    // Calcular gap entre columnas
    const gap = 12;
    const horizontalPadding = 16;
    const columnWidth = (width - horizontalPadding * 2 - gap * (numColumns - 1)) / numColumns;

    const renderItem = useCallback(
        ({ item, index }: { item: PromotionListItem; index: number }) => {
            const isLastInRow = (index + 1) % numColumns === 0;
            return (
                <View
                    style={[
                        styles.cardWrapper,
                        {
                            width: numColumns > 1 ? columnWidth : '100%',
                            marginRight: isLastInRow ? 0 : gap,
                        },
                    ]}
                >
                    <PromotionPublicCard
                        promotion={item}
                        onPress={onPromotionPress}
                    />
                </View>
            );
        },
        [numColumns, columnWidth, gap, onPromotionPress]
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
        [colors]
    );

    const keyExtractor = useCallback((item: PromotionListItem) => item.id, []);

    return (
        <FlatList
            key={listKey}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={numColumns}
            contentContainerStyle={[
                styles.listContent,
                data.length === 0 && styles.emptyList,
            ]}
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
