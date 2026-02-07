import { RequireRole } from '@/features/auth/guards/RequireRole';
import { AdminSubscriptionsScreen } from '@/features/admin/screens';

export default function AdminSubscriptionsRoute() {
    return (
        <RequireRole allowedRoles={['admin']} redirectTo="/(app)/(tabs)/home">
            <AdminSubscriptionsScreen />
        </RequireRole>
    );
}
