import { memo, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Calendar, Users, Coins, MapPin } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { CategoryChip } from '@/components/ui/CategoryChip';
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
    locationLabel: string | null;
    isApproved?: boolean;
    authorName?: string | null;
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
    locationLabel,
    isApproved = false,
    authorName,
}: EventHeaderProps) => {
    const colors = useThemedColors();
    const [expandedDescription, setExpandedDescription] = useState(false);

    const shouldTruncate = description && description.length > 200;
    const displayDescription = shouldTruncate && !expandedDescription
        ? `${description.substring(0, 200)}...`
        : description;

    return (
        <View style={styles.header}>
            <View style={styles.infoSection}>
                {/* Name + Verification */}
                <View style={styles.nameRow}>
                    <Text style={[styles.name, { color: colors.text.primary }]}>{name}</Text>
                    {isApproved && (
                        <Image
                            source={require('../../../../assets/verification.png')}
                            style={styles.verificationIcon}
                            resizeMode="contain"
                        />
                    )}
                </View>

                {/* Description */}
                {description && (
                    <View style={styles.descriptionContainer}>
                        <Text style={[styles.description, { color: colors.text.primary }]}>
                            {displayDescription}
                        </Text>
                        {shouldTruncate && (
                            <Pressable onPress={() => setExpandedDescription(!expandedDescription)}>
                                <Text style={[styles.readMoreText, { color: colors.primary[500] }]}>
                                    {expandedDescription ? 'Ver menos' : 'Ver más'}
                                </Text>
                            </Pressable>
                        )}
                    </View>
                )}

                {/* Categories */}
                {categoryNames.length > 0 && (
                    <View style={styles.categoriesRow}>
                        {categoryNames.map((catName, idx) => (
                            <CategoryChip
                                key={categoryIds[idx] || idx}
                                categoryId={categoryIds[idx]}
                                categoryName={catName}
                                variant="small"
                            />
                        ))}
                    </View>
                )}

                {/* Info Pills */}
                <View style={styles.infoPills}>
                    {/* Date */}
                    <View style={[styles.infoPill, { backgroundColor: colors.background.tertiary }]}>
                        <Calendar size={16} color={colors.primary[500]} />
                        <Text style={[styles.infoPillText, { color: colors.text.secondary }]}>
                            {formatEventDate(startAt, endAt)}
                        </Text>
                    </View>

                    {/* Price */}
                    <View style={[styles.infoPill, { backgroundColor: isFree ? '#f0fdf4' : colors.background.tertiary }]}>
                        <Coins size={16} color={isFree ? '#22c55e' : colors.primary[500]} />
                        <Text style={[styles.infoPillText, { color: isFree ? '#22c55e' : colors.text.secondary }]}>
                            {isFree ? 'Entrada gratuita' : `${currency ?? '₡'}${price?.toLocaleString()}`}
                        </Text>
                    </View>

                    {/* Capacity */}
                    {capacity && (
                        <View style={[styles.infoPill, { backgroundColor: colors.background.tertiary }]}>
                            <Users size={16} color={colors.text.tertiary} />
                            <Text style={[styles.infoPillText, { color: colors.text.secondary }]}>
                                {capacity} personas
                            </Text>
                        </View>
                    )}
                </View>

                {/* Location */}
                {locationLabel && (
                    <View style={styles.locationRow}>
                        <MapPin size={18} color={colors.primary[500]} />
                        <Text style={[styles.locationText, { color: colors.primary[500] }]}>
                            {locationLabel}
                        </Text>
                    </View>
                )}

                {/* Author */}
                {authorName && (
                    <Text style={[styles.authorText, { color: colors.text.tertiary }]}>
                        Organizado por {authorName}
                    </Text>
                )}
            </View>
        </View>
    );
});

EventHeader.displayName = 'EventHeader';
