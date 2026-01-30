import { RequireRole } from '@/features/auth/guards/RequireRole';
import { AdminHubScreen } from '@/features/admin/screens';

export default function AdminPanelRoute() {
  return (
    <RequireRole allowedRoles={['admin']} redirectTo="/(app)/(tabs)/home">
      <AdminHubScreen />
    </RequireRole>
  );
}
