import { memo } from 'react';
import { View, Text } from 'react-native';
import { ModerationStatus } from '@/types/enums';
import { styles } from './styles';

export interface StatusBadgeProps {
  status: ModerationStatus;
  size?: 'sm' | 'md';
}

const STATUS_LABELS: Record<ModerationStatus, string> = {
  pending: 'En revisión',
  approved: 'Activo',
  rejected: 'Rechazado',
};

export const StatusBadge = memo(function StatusBadge({
  status,
  size = 'md',
}: StatusBadgeProps) {
  return (
    <View style={[styles.badge, styles[`badge_${status}`], styles[`size_${size}`]]}>
      <Text style={[styles.badgeText, styles[`text_${size}`]]}>
        {STATUS_LABELS[status]}
      </Text>
    </View>
  );
});
