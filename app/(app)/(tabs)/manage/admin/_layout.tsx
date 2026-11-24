import { Stack } from 'expo-router';
import { RequireRole } from '@/features/auth/guards/RequireRole';

/**
 * Todas las pantallas de admin quedan detrás del guard (la protección real es RLS;
 * esto evita mostrar UI de admin a quien no lo es).
 */
export default function AdminLayout() {
  return (
    <RequireRole allowedRoles={['admin']} redirectTo="/(app)/(tabs)/home">
      <Stack screenOptions={{ headerShown: false }} />
    </RequireRole>
  );
}
