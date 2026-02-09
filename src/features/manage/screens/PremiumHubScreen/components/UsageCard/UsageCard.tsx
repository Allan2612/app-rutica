import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import type { SubscriptionUsageDetail } from '@/services/userSubscriptions.service';
import { RESOURCE_TYPE_LABELS } from '../../constants';
import { ProgressBar } from '../ProgressBar';
import { styles } from './styles';

interface UsageCardProps {
  usage: SubscriptionUsageDetail;
  subscriptionColor: string;
}

export const UsageCard = memo(function UsageCard({ usage, subscriptionColor }: UsageCardProps) {
  const colors = useThemedColors();
  const usageLabel = RESOURCE_TYPE_LABELS[usage.resourceType] || usage.resourceType;
  const percentage = usage.maxQuota > 0 ? Math.round((usage.usedCount / usage.maxQuota) * 100) : 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.background.tertiary }]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.text.secondary }]}>{usageLabel}</Text>
        <Text style={[styles.count, { color: colors.text.primary }]}>
          {usage.usedCount}/{usage.maxQuota}
        </Text>
      </View>
      <ProgressBar
        used={usage.usedCount}
        max={usage.maxQuota}
        color={subscriptionColor}
        bgColor={colors.border.light}
      />
      <Text style={[styles.percentage, { color: colors.text.tertiary }]}>
        {percentage}% utilizado
      </Text>
    </View>
  );
});
