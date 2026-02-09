import { memo, useMemo } from 'react';
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

  // Separar planes en paquetes y mensualidades
  const { packages, monthly } = useMemo(() => {
    const packages = SUBSCRIPTION_PLANS.filter((plan) => !plan.isMonthly);
    const monthly = SUBSCRIPTION_PLANS.filter((plan) => plan.isMonthly);
    return { packages, monthly };
  }, []);

  return (
    <View style={styles.plansContainer}>
      {!isBuyer && (
        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
          Elige uno o más planes que se adapten a tus necesidades
        </Text>
      )}

      {/* Sección de Paquetes */}
      <Text style={[styles.categoryTitle, { color: colors.text.primary }]}>Paquetes</Text>
      <Text style={[styles.categorySubtitle, { color: colors.text.tertiary }]}>Pago único</Text>
      {packages.map((plan) => (
        <PlanCard
          key={plan.type}
          plan={plan}
          isSelected={selectedPlans.includes(plan.type)}
          onSelect={() => onSelectPlan(plan.type)}
        />
      ))}

      {/* Sección de Mensualidades */}
      <Text style={[styles.categoryTitle, { color: colors.text.primary, marginTop: 20 }]}>
        Mensualidades
      </Text>
      <Text style={[styles.categorySubtitle, { color: colors.text.tertiary }]}>
        Pago mensual recurrente
      </Text>
      {monthly.map((plan) => (
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
