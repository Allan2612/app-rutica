import { Store } from 'lucide-react-native';
import { RequireRole } from '@/features/auth/guards/RequireRole';
import { ManagePlaceholderScreen } from '@/features/manage/screens';
import { useThemedColors } from '@/hooks';

export default function ManageBusinessesRoute() {
  const colors = useThemedColors();

  return (
    <RequireRole allowedRoles={['seller', 'admin']} redirectTo="/(app)/(tabs)/home">
      <ManagePlaceholderScreen
        title="Gestionar Negocios"
        description="Publica, edita y organiza tus negocios y su información."
        icon={<Store color={colors.primary[500]} size={32} strokeWidth={2} />}
      />
    </RequireRole>
  );
}
