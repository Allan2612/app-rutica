import { RequireRole } from '@/features/auth/guards/RequireRole';
import { AdminProductsScreen } from '@/features/admin/screens';

export default function AdminProductsRoute() {
  return (
    <RequireRole allowedRoles={['admin']} redirectTo="/(app)/(tabs)/home">
      <AdminProductsScreen />
    </RequireRole>
  );
}
