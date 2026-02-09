import { RequireRole } from '@/features/auth/guards/RequireRole';
import { ManageBusinessesScreen } from '@/features/manage/screens';

export default function ManageBusinessesRoute() {
  return (
    <RequireRole allowedRoles={['seller', 'admin']} redirectTo="/(app)/(tabs)/home">
      <ManageBusinessesScreen />
    </RequireRole>
  );
}
