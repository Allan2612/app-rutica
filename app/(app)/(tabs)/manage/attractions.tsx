import { Landmark } from 'lucide-react-native';
import { RequireRole } from '@/features/auth/guards/RequireRole';
import { ManagePlaceholderScreen } from '@/features/manage/screens';
import { useThemedColors } from '@/hooks';

export default function ManageAttractionsRoute() {
  const colors = useThemedColors();

  return (
    <RequireRole allowedRoles={['buyer', 'seller', 'admin']} redirectTo="/(app)/(tabs)/home">
      <ManagePlaceholderScreen
        title="Gestionar Atracciones"
        description="Administra atracciones, contenido y detalles visibles en la app."
        icon={<Landmark color={colors.primary[500]} size={32} strokeWidth={2} />}
      />
    </RequireRole>
  );
}
