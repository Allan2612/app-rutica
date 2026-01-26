import { RequireRole } from '@/features/auth/guards/RequireRole';
import { CreatePromotionWizardScreen } from '@/features/promotions/screens';

export default function CreatePromotionRoute() {
  return (
    <RequireRole allowedRoles={['seller', 'admin']} redirectTo="/(app)/(tabs)/home">
      <CreatePromotionWizardScreen />
    </RequireRole>
  );
}
