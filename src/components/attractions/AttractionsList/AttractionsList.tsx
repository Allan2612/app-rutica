import { memo, useCallback } from 'react';
import { FlatList, Text, View, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { AttractionPost } from '@/components/attractions/AttractionPost';
import { AttractionListItem } from '@/features/attractions/hooks/useAttractions';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface AttractionsListProps {
    data: AttractionListItem[];
    isRefreshing?: boolean;
    onRefresh?: () => void;
}

export const AttractionsList = memo(function AttractionsList({
    data,
    isRefreshing = false,
    onRefresh,
}: AttractionsListProps) {
    const colors = useThemedColors();
    const router = useRouter();

    const handleAttractionPress = useCallback((attractionId: string) => {
        // TODO: Navegar a detalle de atracción cuando exista
        // router.push(`/(app)/(tabs)/attractions/${attractionId}`);
    }, [router]);

    const renderItem = ({ item }: { item: AttractionListItem }) => (
        <AttractionPost
            name={item.name}
            description={item.description}
            categoryNames={item.categoryNames}
            categoryIds={item.categoryIds}
            locationLabel={item.locationLabel}
            latitude={item.latitude}
            longitude={item.longitude}
            imageUrls={item.imageUrls}
            authorName={item.authorName ?? undefined}
            rating={item.rating}
            reviewCount={item.reviewCount}
            isApproved={item.isApproved}
            createdAt={item.createdAt}
            onPress={() => handleAttractionPress(item.id)}
        />
    );

    const emptyComponent = (
        <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                No hay atracciones disponibles
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
                Sé el primero en compartir una atracción turística.
            </Text>
        </View>
    );

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id}
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
