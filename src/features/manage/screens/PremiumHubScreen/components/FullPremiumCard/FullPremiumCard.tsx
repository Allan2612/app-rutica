import { memo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Sparkles, ChevronRight, ChevronDown, Store } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type {
  UserSubscriptionDetail,
  SubscriptionUsageDetail,
} from '@/services/userSubscriptions.service';
import { SUBSCRIPTION_CONFIG } from '../../constants';
import { UsageCard } from '../UsageCard';
import { styles } from './styles';

interface FullPremiumCardProps {
  subscription: UserSubscriptionDetail;
  onDashboardPress: () => void;
}

export const FullPremiumCard = memo(function FullPremiumCard({
  subscription,
  onDashboardPress,
}: FullPremiumCardProps) {
  const colors = useThemedColors();
  const [expanded, setExpanded] = useState(false);
  const config = SUBSCRIPTION_CONFIG.full_premium;

  const formattedPrice = new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
  }).format(subscription.price);

  const approvedDate = subscription.approvedAt
    ? new Date(subscription.approvedAt).toLocaleDateString('es-CR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  // Agrupar usage por entidad (negocio)
  const groupedUsage = subscription.usageDetails.reduce(
    (acc, usage) => {
      const entityKey = usage.entity?.id || 'no-entity';
      if (!acc[entityKey]) {
        acc[entityKey] = {
          entity: usage.entity,
          usages: [],
        };
      }
      acc[entityKey].usages.push(usage);
      return acc;
    },
    {} as Record<
      string,
      { entity: (typeof subscription.usageDetails)[0]['entity']; usages: SubscriptionUsageDetail[] }
    >,
  );

  const businessEntity = Object.values(groupedUsage).find((g) => g.entity?.type === 'business');

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.background.primary, borderColor: colors.border.medium },
      ]}
    >
      {/* Header - Presionable */}
      <Pressable style={styles.header} onPress={() => setExpanded(!expanded)}>
        <View style={[styles.iconContainer, { backgroundColor: config.iconBg }]}>
          <Sparkles color={config.iconColor} size={24} strokeWidth={2} />
        </View>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {subscription.subscriptionName}
          </Text>
          <View style={styles.meta}>
            <Text style={[styles.price, { color: config.iconColor }]}>{formattedPrice}</Text>
            {approvedDate && (
              <>
                <View style={[styles.metaDot, { backgroundColor: colors.text.tertiary }]} />
                <Text style={[styles.date, { color: colors.text.tertiary }]}>{approvedDate}</Text>
              </>
            )}
          </View>
        </View>
        {expanded ? (
          <ChevronDown color={colors.text.tertiary} size={20} />
        ) : (
          <ChevronRight color={colors.text.tertiary} size={20} />
        )}
      </Pressable>

      {/* Expanded Content */}
      {expanded && (
        <View style={[styles.expandedContent, { borderTopColor: colors.border.light }]}>
          {/* Negocio asociado */}
          {businessEntity?.entity && (
            <View style={styles.businessSection}>
              <View style={[styles.businessCard, { backgroundColor: colors.background.tertiary }]}>
                <Store color={config.iconColor} size={20} />
                <View style={styles.businessInfo}>
                  <Text style={[styles.businessLabel, { color: colors.text.tertiary }]}>
                    Negocio
                  </Text>
                  <Text
                    style={[styles.businessName, { color: colors.text.primary }]}
                    numberOfLines={1}
                  >
                    {businessEntity.entity.name}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Descripción */}
          <Text style={[styles.description, { color: colors.text.secondary }]}>
            {subscription.subscriptionDescription}
          </Text>

          {/* Features incluidas */}
          {subscription.features.length > 0 && (
            <View style={styles.featuresSection}>
              <Text style={[styles.featuresTitle, { color: colors.text.primary }]}>Incluye:</Text>
              <View style={styles.featuresList}>
                {subscription.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={[styles.featureBullet, { backgroundColor: config.iconColor }]} />
                    <Text style={[styles.featureText, { color: colors.text.secondary }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Usage Cards */}
          {businessEntity && businessEntity.usages.length > 0 && (
            <View style={styles.usageSection}>
              <Text style={[styles.usageTitle, { color: colors.text.primary }]}>
                Consumo de recursos
              </Text>
              <View style={styles.usageGrid}>
                {businessEntity.usages.map((usage, idx) => (
                  <UsageCard key={idx} usage={usage} subscriptionColor={config.iconColor} />
                ))}
              </View>
            </View>
          )}

          {/* Botón para ir al Dashboard */}
          <Pressable
            style={[styles.dashboardButton, { backgroundColor: config.iconColor }]}
            onPress={onDashboardPress}
          >
            <Text style={styles.dashboardButtonText}>Ver Dashboard</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
});
