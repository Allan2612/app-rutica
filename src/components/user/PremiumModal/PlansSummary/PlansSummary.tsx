import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { SUBSCRIPTION_PLANS } from '@/types/entities';
import type { SubscriptionType } from '@/types/enums';
import { styles } from './styles';

interface PlansSummaryProps {
  selectedPlans: SubscriptionType[];
}

export const PlansSummary = memo(function PlansSummary({
  selectedPlans,
}: PlansSummaryProps) {
  const colors = useThemedColors();

  const selectedPlansInfo = SUBSCRIPTION_PLANS.filter(p =>
    selectedPlans.includes(p.type)
  );

  const totalPrice = selectedPlansInfo.reduce((sum, plan) => {
    const priceNum = parseInt(plan.price.replace(/[^\d]/g, ''));
    return sum + priceNum;
  }, 0);

  // Verificar si solo tiene full_premium o si tiene algún plan no recurrente
  const hasOnlyFullPremium = selectedPlans.length === 1 && selectedPlans[0] === 'full_premium';
  const showPerMonth = hasOnlyFullPremium;

  return (
    <View
      style={[
        styles.selectedPlanSummary,
        { backgroundColor: colors.background.tertiary },
      ]}
    >
      <Text style={[styles.summaryLabel, { color: colors.text.tertiary }]}>
        {selectedPlans.length === 1 ? 'Plan seleccionado' : 'Planes seleccionados'}
      </Text>
      {selectedPlansInfo.map((plan, index) => (
        <View key={plan.type} style={{ marginBottom: index < selectedPlansInfo.length - 1 ? 12 : 0 }}>
          <Text style={[styles.summaryValue, { color: colors.text.primary, fontSize: 15, fontWeight: '700' }]}>
            • {plan.name}
          </Text>
          <Text style={{ color: colors.text.secondary, fontSize: 13, marginLeft: 12, marginTop: 4 }}>
            {plan.description}
          </Text>
        </View>
      ))}
      <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border.light }}>
        <Text style={[styles.summaryPrice, { color: colors.primary[500] }]}>
          Total: ₡{totalPrice.toLocaleString('es-CR')}{showPerMonth ? '/mes' : ''}
        </Text>
      </View>
    </View>
  );
});
