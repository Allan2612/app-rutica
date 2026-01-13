import { CalendarDays } from 'lucide-react-native';
import { RequireRole } from '@/features/auth/guards/RequireRole';
import { ManagePlaceholderScreen } from '@/features/manage/screens';
import { useThemedColors } from '@/hooks';

export default function ManageEventsRoute() {
  const colors = useThemedColors();

  return (
    <RequireRole allowedRoles={['buyer', 'seller', 'admin']} redirectTo="/(app)/(tabs)/home">
      <ManagePlaceholderScreen
        title="Gestionar Eventos"
        description="Crea, edita y administra eventos desde un solo lugar."
        icon={<CalendarDays color={colors.primary[500]} size={32} strokeWidth={2} />}
      />
    </RequireRole>
  );
}
