/**
 * PromotionPublicCard Component
 * Tarjeta atractiva para mostrar promociones públicas
 * Diseño similar a BusinessCard con énfasis en el descuento
 */

import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Tag, Store, Calendar, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemedColors } from '@/hooks';
import { getCategoryColorScheme } from '@/utils/categoryColors';
import { getPromotionBadgeLabel, formatDate } from '@/utils';
import { PromoBadge } from '@/components/ui';
import type { PromotionListItem } from '@/types/entities';
import { styles } from './styles';

export interface PromotionPublicCardProps {
    promotion: PromotionListItem;
    onPress?: (promotion: PromotionListItem) => void;
}

export const PromotionPublicCard = memo(function PromotionPublicCard({
    promotion,
    onPress,
}: PromotionPublicCardProps) {
    const colors = useThemedColors();

    // Obtener label del badge
    const badgeLabel = getPromotionBadgeLabel(promotion);

    // Calcular días restantes
    const now = new Date();
    const endDate = new Date(promotion.endAt);
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isEndingSoon = daysRemaining <= 3 && daysRemaining > 0;

    const handlePress = () => {
        onPress?.(promotion);
    };

    return (
        <Pressable
            style={[
                styles.card,
                {
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.medium,
                },
            ]}
            onPress={handlePress}
            disabled={!onPress}
        >
            {/* Hero Image */}
            {promotion.imageUrl ? (
                <Image
                    source={{ uri: promotion.imageUrl }}
                    style={styles.heroFull}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                />
            ) : (
                <View
                    style={[
                        styles.heroFull,
                        styles.heroPlaceholder,
                        { backgroundColor: colors.background.tertiary },
                    ]}
                >
                    <Tag size={48} color={colors.text.tertiary} strokeWidth={1.5} />
                </View>
            )}

            {/* Badge de promoción */}
            <View style={styles.badgeContainer}>
                <PromoBadge label={badgeLabel} size="large" />
            </View>

            {/* Ending Soon Badge */}
            {isEndingSoon && (
                <View style={[styles.urgencyBadge, { backgroundColor: colors.error }]}>
                    <Clock size={12} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.urgencyText}>
                        {daysRemaining === 1 ? 'Último día' : `${daysRemaining} días`}
                    </Text>
                </View>
            )}

            {/* Gradient Overlay */}
            <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
                start={{ x: 0, y: 0.3 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientOverlay}
            />

            {/* Content */}
            <View style={styles.content}>
                {/* Title */}
                <Text style={styles.title} numberOfLines={2}>
                    {promotion.title}
                </Text>

                {/* Business Name */}
                {promotion.businessName && (
                    <View style={styles.businessRow}>
                        <Store size={14} color="rgba(255,255,255,0.9)" strokeWidth={1.75} />
                        <Text style={styles.businessName} numberOfLines={1}>
                            {promotion.businessName}
                        </Text>
                    </View>
                )}

                {/* Date Range */}
                <View style={styles.dateRow}>
                    <Calendar size={14} color="rgba(255,255,255,0.8)" strokeWidth={1.75} />
                    <Text style={styles.dateText}>
                        {formatDate(promotion.startAt)} - {formatDate(promotion.endAt)}
                    </Text>
                </View>

                {/* Categories */}
                {promotion.categoryNames.length > 0 && (
                    <View style={styles.categoriesRow}>
                        {promotion.categoryNames.slice(0, 2).map((catName, index) => {
                            const categoryColor = getCategoryColorScheme(`cat-${index}`);
                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.categoryChip,
                                        { backgroundColor: categoryColor.backgroundColor },
                                    ]}
                                >
                                    <Text
                                        style={[styles.categoryText, { color: categoryColor.textColor }]}
                                    >
                                        {catName}
                                    </Text>
                                </View>
                            );
                        })}
                        {promotion.categoryNames.length > 2 && (
                            <View
                                style={[
                                    styles.categoryChip,
                                    { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                                ]}
                            >
                                <Text style={[styles.categoryText, { color: '#FFFFFF' }]}>
                                    +{promotion.categoryNames.length - 2}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </Pressable>
    );
});
