import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Calendar, Users, Coins, MapPin, Star, ExternalLink } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { getCategoryColorScheme } from '@/utils/categoryColors';
import { styles } from './styles';

interface EventHeaderProps {
    name: string;
    description: string | null;
    categoryIds: string[];
    categoryNames: string[];
    startAt: string;
    endAt: string;
    isFree: boolean;
    price: number | null;
    currency: string | null;
    capacity: number | null;
    rating: number;
    reviewCount: number;
    locationLabel: string | null;
    latitude: number | null;
    longitude: number | null;
    onOpenMaps: () => void;
}

function formatEventDate(startAt: string, endAt: string): string {
    const start = new Date(startAt);
    const now = new Date();

    const dateOpts: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const timeOpts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

    if (start.toDateString() === now.toDateString()) {
        return `Hoy, ${start.toLocaleTimeString('es-CR', timeOpts)}`;
    }

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    if (start.toDateString() === tomorrow.toDateString()) {
        return `Mañana, ${start.toLocaleTimeString('es-CR', timeOpts)}`;
    }

    const dateStr = start.toLocaleDateString('es-CR', dateOpts);
    const timeStr = start.toLocaleTimeString('es-CR', timeOpts);
    return `${dateStr} • ${timeStr}`;
}

export const EventHeader = memo(({
    name,
    description,
    categoryIds,
    categoryNames,
    startAt,
    endAt,
    isFree,
    price,
    currency,
    capacity,
    rating,
    reviewCount,
    locationLabel,
    latitude,
    longitude,
    onOpenMaps,
}: EventHeaderProps) => {
    const colors = useThemedColors();

    return (
        <>
            {/* Categories */}
            <View style={styles.categoriesRow}>
                {categoryNames.map((catName, idx) => {
                    const catId = categoryIds[idx];
                    const colorScheme = getCategoryColorScheme(catId);
                    return (
                        <View key={catId} style={[styles.categoryBadge, { backgroundColor: colorScheme.backgroundColor }]}>
                            <Text style={[styles.categoryText, { color: colorScheme.textColor }]}>{catName}</Text>
                        </View>
                    );
                })}
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: colors.text.primary }]}>{name}</Text>

            {/* Description */}
            {description && (
                <Text style={[styles.descriptionText, { color: colors.text.secondary }]} numberOfLines={3}>
                    {description}
                </Text>
            )}

            {/* Date */}
            <View style={styles.infoRow}>
                <Calendar size={18} color={colors.primary[500]} />
                <Text style={[styles.infoText, { color: colors.text.secondary }]}>
                    {formatEventDate(startAt, endAt)}
                </Text>
            </View>

            {/* Price */}
            <View style={styles.infoRow}>
                <Coins size={18} color={isFree ? '#22c55e' : colors.primary[500]} />
                <Text style={[styles.infoText, { color: isFree ? '#22c55e' : colors.text.secondary }]}>
                    {isFree ? 'Entrada gratuita' : `${currency ?? '₡'}${price?.toLocaleString()}`}
                </Text>
            </View>

            {/* Capacity */}
            {capacity && (
                <View style={styles.infoRow}>
                    <Users size={18} color={colors.text.tertiary} />
                    <Text style={[styles.infoText, { color: colors.text.secondary }]}>
                        Capacidad: {capacity} personas
                    </Text>
                </View>
            )}

            {/* Rating */}
            {rating > 0 && (
                <View style={styles.infoRow}>
                    <Star size={18} color="#facc15" fill="#facc15" />
                    <Text style={[styles.infoText, { color: colors.text.secondary }]}>
                        {rating.toFixed(1)} ({reviewCount})
                    </Text>
                </View>
            )}

            {/* Location */}
            {locationLabel && (
                <Pressable style={styles.infoRow} onPress={onOpenMaps}>
                    <MapPin size={18} color={colors.primary[500]} />
                    <Text style={[styles.locationText, { color: colors.text.secondary }]}>
                        {locationLabel}
                    </Text>
                    {latitude && longitude && (
                        <ExternalLink size={14} color={colors.primary[500]} />
                    )}
                </Pressable>
            )}
        </>
    );
});

EventHeader.displayName = 'EventHeader';
