/**
 * UserPromotionCard Component
 * Tarjeta para mostrar promociones del usuario (gestión)
 * Usa el mismo diseño visual que BusinessCard con overlay y badges
 */

import { memo } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import { Edit2, Trash2, Tag, Calendar, Clock, DollarSign, Percent } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemedColors } from '@/hooks';
import { StatusBadge } from '@/components/ui';
import type { DiscountType } from '@/types/enums';
import { styles } from './styles';

export interface UserPromotionCardProps {
  title: string;
  description?: string | null;
  discountType: DiscountType | string;
  discountValue: number;
  startAt: string;
  endAt: string;
  businessName?: string;
  imageUrl?: string | null;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  paymentState?: 'pending' | 'verified' | 'rejected';
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export const UserPromotionCard = memo(function UserPromotionCard({
  title,
  discountType,
  discountValue,
  startAt,
  endAt,
  businessName,
  imageUrl,
  moderationStatus,
  paymentState = 'pending',
  onEdit,
  onDelete,
  isDeleting = false,
}: UserPromotionCardProps) {
  const colors = useThemedColors();

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CR', {
      day: 'numeric',
      month: 'long',
    });
  };

  // Check if promotion is active
  const now = new Date();
  const endDate = new Date(endAt);
  const isExpired = endDate < now;

  // Discount display
  const isPercentage = discountType === 'percentage';
  const discountDisplay = isPercentage
    ? `${discountValue}%`
    : `₡${discountValue.toLocaleString()}`;

  // Usar Tag icon para ambos casos
  const DiscountIcon = Tag;

  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: colors.background.primary,
          borderColor: colors.border.medium,
          opacity: isExpired ? 0.6 : 1,
        },
      ]}
      disabled={!onEdit && !onDelete}
    >
      {/* Hero Image */}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.heroFull} resizeMode="cover" />
      ) : (
        <View style={[styles.heroFull, styles.heroPlaceholder, { backgroundColor: colors.background.tertiary }]}>
          <Tag color={colors.text.tertiary} size={48} strokeWidth={1.5} />
        </View>
      )}

      {/* Discount Badge - Top Left */}
      <View style={[styles.discountBadge, { backgroundColor: '#fbbf24' }]}>
        <DiscountIcon size={14} color="#000000" strokeWidth={2.5} />
        <Text style={styles.discountText}>{discountDisplay}</Text>
      </View>

      {/* Status & Payment Badges - Top Right */}
      <View style={styles.topRightBadges}>
        <StatusBadge status={moderationStatus} />
        {paymentState === 'pending' && (
          <View style={[styles.paymentBadge, { backgroundColor: 'rgba(255,255,255,0.92)', borderColor: colors.border.medium }]}>
            <Clock size={12} color={colors.warning} />
            <Text style={[styles.paymentText, { color: colors.warning }]}>Pago pendiente</Text>
          </View>
        )}
      </View>

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)']}
        start={{ x: 0, y: 0.4 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientOverlay}
      />

      {/* Content - Bottom */}
      <View style={styles.content}>
        {/* Info Column - Left */}
        <View style={styles.infoColumn}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {businessName && (
            <Text style={styles.businessName} numberOfLines={1}>
              {businessName}
            </Text>
          )}
          <View style={styles.dateRow}>
            <Calendar size={14} color="rgba(255,255,255,0.9)" strokeWidth={1.75} />
            <Text style={styles.dateText}>
              {formatDate(startAt)} - {formatDate(endAt)}
            </Text>
            {isExpired && (
              <View style={[styles.expiredBadge, { backgroundColor: 'rgba(239, 68, 68, 0.9)' }]}>
                <Text style={styles.expiredText}>Expirada</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons - Right */}
        {(onEdit || onDelete) && (
          <View style={styles.actions}>
            {onEdit && (
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.editButton,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={onEdit}
                disabled={isDeleting}
              >
                <Edit2 color="#000000" size={18} strokeWidth={2.5} />
              </Pressable>
            )}

            {onDelete && (
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.deleteButton,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={onDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Trash2 color="#FFFFFF" size={18} strokeWidth={2.5} />
                )}
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
});




