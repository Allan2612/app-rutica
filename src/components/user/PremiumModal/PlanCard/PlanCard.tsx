import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { SubscriptionPlanInfo } from '@/types/entities';
import { styles } from './styles';

interface PlanCardProps {
  plan: SubscriptionPlanInfo;
  isSelected: boolean;
  onSelect: () => void;
}

export const PlanCard = memo(function PlanCard({
  plan,
  isSelected,
  onSelect,
}: PlanCardProps) {
  const colors = useThemedColors();
  const isRecommended = plan.type === 'full_premium';

  return (
    <Pressable
      style={[
        styles.planCard,
        isRecommended && styles.planCardWithBadge,
        isSelected && styles.planCardSelected,
        {
          backgroundColor: isSelected
            ? colors.isDark
              ? colors.primary[900] + '20'
              : colors.primary[50]
            : colors.background.primary,
          borderColor: isSelected
            ? colors.primary[500]
            : colors.border.light,
        },
      ]}
      onPress={onSelect}
    >
      {/* Badge recomendado */}
      {isRecommended && (
        <View
          style={[
            styles.recommendedBadge,
            { backgroundColor: colors.warning },
          ]}
        >
          <Text style={styles.recommendedText}>RECOMENDADO</Text>
        </View>
      )}

      <View style={styles.planHeader}>
        <View style={styles.planHeaderLeft}>
          <Text
            style={[
              styles.planName,
              { color: colors.text.primary },
            ]}
          >
            {plan.name}
          </Text>
        </View>
        <Text
          style={[
            styles.planPrice,
            { color: colors.primary[500] },
          ]}
        >
          {plan.price}
        </Text>
      </View>

      <Text
        style={[styles.planDescription, { color: colors.text.secondary }]}
      >
        {plan.description}
      </Text>

      <View
        style={[
          styles.planFeatures,
          { borderTopColor: colors.border.light },
        ]}
      >
        {plan.features.map((feature: string, index: number) => (
          <View key={index} style={styles.planFeatureItem}>
            <Check size={16} color={colors.success} strokeWidth={2.5} />
            <Text
              style={[
                styles.planFeatureText,
                { color: colors.text.secondary },
              ]}
            >
              {feature}
            </Text>
          </View>
        ))}
      </View>

      {/* Indicador de selección */}
      {isSelected && (
        <View
          style={[
            styles.selectionIndicator,
            { backgroundColor: colors.primary[500] },
          ]}
        >
          <Check size={20} color="#ffffff" strokeWidth={3} />
        </View>
      )}
    </Pressable>
  );
});
