import { RequireRole } from '@/features/auth/guards/RequireRole';
import { ManageAttractionsScreen } from '@/features/attractions/screens';

export default function ManageAttractionsRoute() {
    return (
        <RequireRole allowedRoles={['seller', 'admin']} redirectTo="/(app)/(tabs)/home">
            <ManageAttractionsScreen />
        </RequireRole>
    );
}
