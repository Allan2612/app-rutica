import { memo } from 'react';
import { FlatList, RefreshControl, Text, View, ActivityIndicator } from 'react-native';
import { useThemedColors } from '@/hooks';
import { EventPost } from '@/components/events/EventPost';
import type { EventListItem } from '@/features/events/hooks/useEvents';
import { styles } from './styles';

interface EventsListProps {
    events: EventListItem[];
    isLoading?: boolean;
    isRefreshing?: boolean;
    onRefresh?: () => void;
    onEventPress?: (id: string) => void;
    emptyMessage?: string;
}

export const EventsList = memo(function EventsList({
    events,
    isLoading = false,
    isRefreshing = false,
    onRefresh,
    onEventPress,
    emptyMessage = 'No hay eventos disponibles',
}: EventsListProps) {
    const colors = useThemedColors();

    if (isLoading && events.length === 0) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    if (!isLoading && events.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                    {emptyMessage}
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <EventPost
                    eventId={item.id}
                    name={item.name}
                    description={item.description}
                    startAt={item.startAt}
                    endAt={item.endAt}
                    isFree={item.isFree}
                    price={item.price}
                    currency={item.currency}
                    capacity={item.capacity}
                    categoryNames={item.categoryNames}
                    categoryIds={item.categoryIds}
                    locationLabel={item.locationLabel}
                    latitude={item.latitude}
                    longitude={item.longitude}
                    imageUrls={item.imageUrls}
                    authorName={item.authorName}
                    authorAvatarUrl={item.authorAvatarUrl}
                    isApproved={item.isApproved}
                    createdAt={item.createdAt}
                    contactPhone={item.contactPhone}
                    contactEmail={item.contactEmail}
                    website={item.website}
                    socialLinks={item.socialLinks}
                    rating={item.rating}
                    reviewCount={item.reviewCount}
                    onPress={onEventPress ? () => onEventPress(item.id) : undefined}
                />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
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
