import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllSubscriptionPlans } from '@/features/user/services/subscription.service';
import { SUBSCRIPTION_PLANS, type Subscription, type SubscriptionPlanInfo } from '@/types/entities';

const formatColones = (value: number, monthly: boolean) =>
  `₡${Math.round(value).toLocaleString('es-CR')}${monthly ? '/mes' : ''}`;

/**
 * Combina el catálogo que edita el admin (tabla `subscription`) con la info estática de
 * presentación. **El precio, nombre, descripción, features y si es mensual salen de la BD**:
 * el precio anunciado debe ser el que el admin configuró (Ley 7472). Los planes desactivados
 * en la BD no se muestran. Si la consulta falla se usa el catálogo estático como respaldo.
 */
export function mergePlanCatalog(dbPlans: Subscription[] | undefined): SubscriptionPlanInfo[] {
  if (!dbPlans) return SUBSCRIPTION_PLANS;
  return dbPlans.map((db) => {
    const local = SUBSCRIPTION_PLANS.find((p) => p.type === db.type_sub);
    const monthly = db.is_recurring_sub;
    return {
      ...(local ?? { type: db.type_sub }),
      type: db.type_sub,
      name: db.name_sub,
      description: db.description_sub,
      features: db.features_sub?.length ? db.features_sub : (local?.features ?? []),
      price: formatColones(Number(db.price_sub), monthly),
      priceValue: Number(db.price_sub),
      isMonthly: monthly,
    };
  });
}

export function usePlanCatalog() {
  const query = useQuery({
    queryKey: ['subscription-plans', 'active'],
    queryFn: getAllSubscriptionPlans,
    staleTime: 10 * 60 * 1000,
  });
  const plans = useMemo(() => mergePlanCatalog(query.isError ? undefined : query.data), [query.data, query.isError]);
  return { plans, isLoading: query.isLoading };
}
