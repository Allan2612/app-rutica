import { useLocalSearchParams } from 'expo-router';
import { RequireRole } from '@/features/auth/guards/RequireRole';
import { EditPromotionWizardScreen } from '@/features/promotions/screens';

export default function EditPromotionRoute() {
  const { promotionId } = useLocalSearchParams<{ promotionId: string }>();

  if (!promotionId) {
    return null;
  }

  return (
    <RequireRole allowedRoles={['seller', 'admin']} redirectTo="/(app)/(tabs)/home">
      <EditPromotionWizardScreen promotionId={promotionId} />
    </RequireRole>
  );
}
