import { RequireRole } from '@/features/auth/guards/RequireRole';
import { ManageEventsScreen } from '@/features/events/screens';

export default function ManageEventsRoute() {
    return (
        <RequireRole allowedRoles={['seller', 'admin']} redirectTo="/(app)/(tabs)/home">
            <ManageEventsScreen />
        </RequireRole>
    );
}
