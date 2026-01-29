import { RequireRole } from '@/features/auth/guards/RequireRole';
import { AdminVerificationScreen } from '@/features/admin/screens';

export default function AdminVerificationRoute() {
  return (
    <RequireRole allowedRoles={['admin']} redirectTo="/(app)/(tabs)/home">
      <AdminVerificationScreen />
    </RequireRole>
  );
}
