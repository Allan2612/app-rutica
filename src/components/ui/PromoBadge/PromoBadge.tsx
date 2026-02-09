/**
 * PromoBadge Component
 * Badge reutilizable para mostrar promociones (descuentos, combos, etc.)
 * Color amarillo consistente en toda la aplicación
 */

import { memo } from 'react';
import { View, Text } from 'react-native';
import { Tag } from 'lucide-react-native';
import { colors } from '@/styles/theme/colors';
import { BADGE_ICON_SIZES } from '@/styles/theme';
import { styles } from './styles';

export interface PromoBadgeProps {
  /** Texto a mostrar en el badge (ej: "2x1", "-10%", "₡500") */
  label: string;
  /** Tamaño del badge */
  size?: 'small' | 'medium' | 'large';
}

export const PromoBadge = memo(function PromoBadge({ label, size = 'medium' }: PromoBadgeProps) {
  const sizeStyle =
    size === 'small' ? styles.small : size === 'large' ? styles.large : styles.medium;

  const textSizeStyle =
    size === 'small'
      ? styles.text_small
      : size === 'large'
        ? styles.text_large
        : styles.text_medium;

  const iconSize = BADGE_ICON_SIZES[size];

  return (
    <View style={[styles.badge, sizeStyle]}>
      <Tag size={iconSize} color={colors.promo.badgeText} strokeWidth={2.5} />
      <Text style={[styles.text, textSizeStyle]}>{label}</Text>
    </View>
  );
});
