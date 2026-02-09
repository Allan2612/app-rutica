/**
 * PromotionCard Component
 * Tarjeta para mostrar una promoción en listados públicos
 */

import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Calendar, Store, Tag } from 'lucide-react-native';
import { PromotionListItem } from '@/types/entities';
import { useThemedColors } from '@/hooks';
import { getPromotionBadgeLabel } from '@/utils/promotionHelpers';
import { PromoBadge } from '@/components/ui';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { styles } from './styles';

interface PromotionCardProps {
  promotion: PromotionListItem;
  onPress?: (promotion: PromotionListItem) => void;
}

export function PromotionCard({ promotion, onPress }: PromotionCardProps) {
  const colors = useThemedColors();

  const badgeLabel = getPromotionBadgeLabel(promotion as any);

  const handlePress = () => {
    onPress?.(promotion);
  };

  const formatDateRange = () => {
    if (!promotion.startAt || !promotion.endAt) return 'Sin fechas';
    const start = new Date(promotion.startAt);
    const end = new Date(promotion.endAt);
    return `${start.getDate()} ${start.toLocaleDateString('es-CR', { month: 'short' })} - ${end.getDate()} ${end.toLocaleDateString('es-CR', { month: 'short' })}`;
  };

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.light,
        },
      ]}
      onPress={handlePress}
      android_ripple={{ color: colors.primary[100] }}
    >
      <View style={styles.cardContent}>
        {/* Imagen */}
        {promotion.coverUrl ? (
          <Image
            source={{ uri: promotion.coverUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.background.tertiary }]}>
            <Tag size={32} color={colors.text.tertiary} />
          </View>
        )}

        {/* Badge */}
        <View style={styles.badgeContainer}>
          <PromoBadge label={badgeLabel} size="medium" />
        </View>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={2}>
          {promotion.title}
        </Text>

        {promotion.businessName && (
          <View style={styles.infoRow}>
            <Store size={14} color={colors.text.secondary} />
            <Text style={[styles.businessName, { color: colors.text.secondary }]} numberOfLines={1}>
              {promotion.businessName}
            </Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Calendar size={14} color={colors.text.tertiary} />
          <Text style={[styles.dateRange, { color: colors.text.tertiary }]}>
            {formatDateRange()}
          </Text>
        </View>

        {promotion.categoryNames.length > 0 && (
          <View style={styles.categories}>
            {promotion.categoryNames.slice(0, 3).map((cat, idx) => {
              const categoryId = promotion.categoryIds?.[idx] || '';
              return (
                <CategoryChip
                  key={categoryId || idx}
                  categoryId={categoryId}
                  categoryName={cat}
                  variant="small"
                />
              );
            })}
          </View>
        )}

        {/* Status badge */}
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                promotion.moderationStatus === 'approved'
                  ? colors.success + '20'
                  : promotion.moderationStatus === 'rejected'
                    ? colors.error + '20'
                    : colors.warning + '20',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  promotion.moderationStatus === 'approved'
                    ? colors.success
                    : promotion.moderationStatus === 'rejected'
                      ? colors.error
                      : colors.warning,
              },
            ]}
          >
            {promotion.moderationStatus === 'pending'
              ? 'En revisión'
              : promotion.moderationStatus === 'approved'
                ? 'Aprobada'
                : 'Rechazada'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
