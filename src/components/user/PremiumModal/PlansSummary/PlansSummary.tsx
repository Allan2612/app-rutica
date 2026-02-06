import { memo, useMemo } from 'react';
import { View, Text } from 'react-native';
import { Building2, MapPin, Calendar } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useUserBusinesses } from '@/features/business/hooks';
import { useUserAttractions } from '@/features/attractions/hooks';
import { useUserEvents } from '@/features/events/hooks';
import { SUBSCRIPTION_PLANS } from '@/types/entities';
import type { SubscriptionType } from '@/types/enums';
import type { BusinessSelections, EntitySelections } from '../usePremiumModal';
import { styles } from './styles';

interface PlansSummaryProps {
  selectedPlans: SubscriptionType[];
  businessSelections?: BusinessSelections;
  entitySelections?: EntitySelections;
  preSelectedBusinessName?: string;
  preSelectedEntityName?: string;
}

export const PlansSummary = memo(function PlansSummary({
  selectedPlans,
  businessSelections = {},
  entitySelections = {},
  preSelectedBusinessName,
  preSelectedEntityName,
}: PlansSummaryProps) {
  const colors = useThemedColors();
  const { data: businesses = [] } = useUserBusinesses();
  const { data: attractions = [] } = useUserAttractions();
  const { data: events = [] } = useUserEvents();

  // Crear mapas de ID -> nombre
  const businessNames = useMemo(() => {
    const map: Record<string, string> = {};
    businesses.forEach((b: any) => {
      map[b.id_bus] = b.name_bus;
    });
    return map;
  }, [businesses]);

  const attractionNames = useMemo(() => {
    const map: Record<string, string> = {};
    attractions.forEach((a: any) => {
      map[a.id_att] = a.name_att;
    });
    return map;
  }, [attractions]);

  const eventNames = useMemo(() => {
    const map: Record<string, string> = {};
    events.forEach((e: any) => {
      map[e.id_evt] = e.name_evt;
    });
    return map;
  }, [events]);

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

  // Función para obtener el nombre del negocio/entidad asociado a un plan
  const getAssociatedEntityInfo = (planType: SubscriptionType) => {
    // Verificar si tiene negocio seleccionado
    const businessId = businessSelections[planType];
    if (businessId) {
      // Primero intentar con el nombre pre-seleccionado (si es el plan inicial)
      if (preSelectedBusinessName && selectedPlans.length === 1) {
        return { type: 'business', name: preSelectedBusinessName };
      }
      // Luego buscar en el mapa de nombres
      if (businessNames[businessId]) {
        return { type: 'business', name: businessNames[businessId] };
      }
    }

    // Verificar si tiene entidad seleccionada
    const entitySelection = entitySelections[planType];
    if (entitySelection) {
      // Primero intentar con el nombre pre-seleccionado
      if (preSelectedEntityName && selectedPlans.length === 1) {
        return { type: entitySelection.entityType, name: preSelectedEntityName };
      }
      if (entitySelection.entityType === 'attraction' && attractionNames[entitySelection.entityId]) {
        return { type: 'attraction', name: attractionNames[entitySelection.entityId] };
      }
      if (entitySelection.entityType === 'event' && eventNames[entitySelection.entityId]) {
        return { type: 'event', name: eventNames[entitySelection.entityId] };
      }
    }

    return null;
  };

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
      {selectedPlansInfo.map((plan, index) => {
        const entityInfo = getAssociatedEntityInfo(plan.type);
        return (
          <View key={plan.type} style={{ marginBottom: index < selectedPlansInfo.length - 1 ? 12 : 0 }}>
            <Text style={[styles.summaryValue, { color: colors.text.primary, fontSize: 15, fontWeight: '700' }]}>
              • {plan.name}
            </Text>
            <Text style={{ color: colors.text.secondary, fontSize: 13, marginLeft: 12, marginTop: 4 }}>
              {plan.description}
            </Text>
            {entityInfo && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12, marginTop: 6, gap: 6 }}>
                {entityInfo.type === 'business' && <Building2 size={14} color={colors.primary[500]} />}
                {entityInfo.type === 'attraction' && <MapPin size={14} color={colors.primary[500]} />}
                {entityInfo.type === 'event' && <Calendar size={14} color={colors.primary[500]} />}
                <Text style={{ color: colors.primary[500], fontSize: 13, fontWeight: '600' }}>
                  {entityInfo.name}
                </Text>
              </View>
            )}
          </View>
        );
      })}
      <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border.light }}>
        <Text style={[styles.summaryPrice, { color: colors.primary[500] }]}>
          Total: ₡{totalPrice.toLocaleString('es-CR')}{showPerMonth ? '/mes' : ''}
        </Text>
      </View>
    </View>
  );
});
