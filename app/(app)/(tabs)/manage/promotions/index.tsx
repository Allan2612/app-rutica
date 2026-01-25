import { RequireRole } from '@/features/auth/guards/RequireRole';
import { ManagePromotionsScreen } from '@/features/promotions/screens';

export default function ManagePromotionsRoute() {
  return (
    <RequireRole allowedRoles={['seller', 'admin']} redirectTo="/(app)/(tabs)/home">
      <ManagePromotionsScreen />
    </RequireRole>
  );
}
