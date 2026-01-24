import { Tag } from 'lucide-react-native';
import { RequireRole } from '@/features/auth/guards/RequireRole';
import { ManagePlaceholderScreen } from '@/features/manage/screens';
import { useThemedColors } from '@/hooks';

export default function ManagePromotionsRoute() {
  const colors = useThemedColors();

  return (
    <RequireRole allowedRoles={['seller', 'admin']} redirectTo="/(app)/(tabs)/home">
      <ManagePlaceholderScreen
        title="Gestionar Promociones"
        description="Crea promociones, define vigencia y destaca ofertas."
        icon={<Tag color={colors.primary[500]} size={32} strokeWidth={2} />}
      />
    </RequireRole>
  );
}
