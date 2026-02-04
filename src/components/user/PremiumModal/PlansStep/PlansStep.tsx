import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { SUBSCRIPTION_PLANS } from '@/types/entities';
import type { SubscriptionType } from '@/types/enums';
import { PlanCard } from '../PlanCard';
import { styles } from './styles';

interface PlansStepProps {
  selectedPlans: SubscriptionType[];
  onSelectPlan: (planType: SubscriptionType) => void;
  isBuyer?: boolean;
}

export const PlansStep = memo(function PlansStep({
  selectedPlans,
  onSelectPlan,
  isBuyer = false,
}: PlansStepProps) {
  const colors = useThemedColors();

  return (
    <View style={styles.plansContainer}>
      {!isBuyer && (
        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
          Elige uno o más planes que se adapten a tus necesidades
        </Text>
      )}
      {SUBSCRIPTION_PLANS.map((plan) => (
        <PlanCard
          key={plan.type}
          plan={plan}
          isSelected={selectedPlans.includes(plan.type)}
          onSelect={() => onSelectPlan(plan.type)}
        />
      ))}
    </View>
  );
});
