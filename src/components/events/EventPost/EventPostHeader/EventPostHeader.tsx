import { memo } from 'react';
import { View, Text } from 'react-native';
import { PartyPopper, Star } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { getInitials, getTimeAgo } from '../helpers';
import { styles } from '../styles';

interface EventPostHeaderProps {
    authorName?: string | null;
    createdAt?: string;
    rating?: number;
    reviewCount?: number;
}

export const EventPostHeader = memo(function EventPostHeader({
    authorName,
    createdAt,
    rating = 0,
    reviewCount = 0,
}: EventPostHeaderProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.header}>
            <View style={[styles.avatar, { backgroundColor: colors.primary[100] }]}>
                {authorName ? (
                    <Text style={[styles.avatarText, { color: colors.primary[700] }]}>
                        {getInitials(authorName)}
                    </Text>
                ) : (
                    <PartyPopper size={20} color={colors.primary[600]} />
                )}
            </View>
            <View style={styles.headerInfo}>
                <Text style={[styles.authorName, { color: colors.text.primary }]}>
                    {authorName ?? 'Rutica'}
                </Text>
                <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                    {createdAt ? getTimeAgo(createdAt) : ''}
                </Text>
            </View>
            {/* Rating a la derecha */}
            {rating > 0 && (
                <View style={styles.headerRating}>
                    <Star size={14} color="#fbbf24" fill="#fbbf24" />
                    <Text style={[styles.ratingText, { color: colors.text.secondary }]}>
                        {rating.toFixed(1)} ({reviewCount})
                    </Text>
                </View>
            )}
        </View>
    );
});
