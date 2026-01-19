import { Shield } from 'lucide-react-native';
import { RequireRole } from '@/features/auth/guards/RequireRole';
import { ManagePlaceholderScreen } from '@/features/manage/screens';
import { useThemedColors } from '@/hooks';

export default function AdminPanelRoute() {
  const colors = useThemedColors();

  return (
    <RequireRole allowedRoles={['admin']} redirectTo="/(app)/(tabs)/home">
      <ManagePlaceholderScreen
        title="Panel de Administración"
        description="Acceso restringido. Herramientas internas para administración."
        icon={<Shield color={colors.text.primary} size={32} strokeWidth={2} />}
      />
    </RequireRole>
  );
}
