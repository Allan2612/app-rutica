import { memo, useMemo } from 'react';
import type { ReactElement } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { CalendarDays, Landmark, Shield, Store, Tag } from 'lucide-react-native';
import type { UserRole } from '@/types/enums';
import { useThemedColors } from '@/hooks';
import { useAuthStore } from '@/store';
import { Screen } from '@/components/layout';
import { GuestCTA, ManageCard } from '@/components/manage';
import { spacing } from '@/styles/theme';
import { styles } from './styles';

function normalizeRole(value: unknown): UserRole | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'buyer' || normalized === 'seller' || normalized === 'admin') {
    return normalized;
  }
  return null;
}

type ManageAction = {
  key: 'businesses' | 'promotions' | 'events' | 'attractions' | 'admin';
  title: string;
  description: string;
  href: string;
  roles: readonly UserRole[];
  icon: (color: string) => ReactElement;
  variant?: 'default' | 'admin';
  badgeText?: string;
};

export const ManageScreen = memo(function ManageScreen() {
  const colors = useThemedColors();
  const { width } = useWindowDimensions();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  const normalizedRole = useMemo(() => normalizeRole(role), [role]);
  const effectiveRole: UserRole = normalizedRole ?? 'buyer';

  const columns = width >= 380 ? 2 : 1;
  const horizontalPadding = spacing.lg;
  const gap = spacing.md;
  const cardWidth = useMemo(() => {
    const maxContentWidth = 860;
    const available = Math.max(0, width - horizontalPadding * 2);
    const contentWidth = Math.min(available, maxContentWidth);
    const usableWidth = contentWidth - gap * (columns - 1);
    return Math.floor(usableWidth / columns);
  }, [columns, gap, horizontalPadding, width]);

  const actions: readonly ManageAction[] = useMemo(
    () => [
      {
        key: 'businesses',
        title: 'Gestionar Negocios',
        description: 'Crea, edita y publica tus negocios.',
        href: '/(app)/(tabs)/manage/businesses',
        roles: ['seller', 'admin'],
        icon: (color) => <Store color={color} size={26} strokeWidth={2} />,
      },
      {
        key: 'promotions',
        title: 'Gestionar Promociones',
        description: 'Promociones para atraer más clientes.',
        href: '/(app)/(tabs)/manage/promotions',
        roles: ['seller', 'admin'],
        icon: (color) => <Tag color={color} size={26} strokeWidth={2} />,
      },
      {
        key: 'events',
        title: 'Gestionar Eventos',
        description: 'Organiza y administra eventos.',
        href: '/(app)/(tabs)/manage/events',
        roles: ['buyer', 'seller', 'admin'],
        icon: (color) => <CalendarDays color={color} size={26} strokeWidth={2} />,
      },
      {
        key: 'attractions',
        title: 'Gestionar Atracciones',
        description: 'Crea y mantiene atracciones destacadas.',
        href: '/(app)/(tabs)/manage/attractions',
        roles: ['buyer', 'seller', 'admin'],
        icon: (color) => <Landmark color={color} size={26} strokeWidth={2} />,
      },
      {
        key: 'admin',
        title: 'Panel de Administración',
        description: 'Herramientas avanzadas y control total.',
        href: '/(app)/(tabs)/manage/admin',
        roles: ['admin'],
        icon: (color) => <Shield color={color} size={26} strokeWidth={2} />,
        variant: 'admin',
        badgeText: 'Admin',
      },
    ],
    []
  );

  // Si no está autenticado: CTA centrado (no pantalla vacía)
  if (!isAuthenticated || !user) {
    return (
      <GuestCTA
        onPressLogin={() => {
          router.push('/(auth)/login');
        }}
      />
    );
  }

  const visibleActions = actions.filter((action) => {
    if (action.key === 'admin') {
      return effectiveRole === 'admin';
    }
    return action.roles.includes(effectiveRole);
  });

  return (
    <Screen>
      <ScrollView
        style={{ backgroundColor: colors.background.secondary }}
        contentContainerStyle={[
          styles.scrollContent,
          { flexGrow: 1 },
        ]}
      >
        <View style={styles.content}>
          <View style={[styles.header, { borderColor: colors.border.light }]}>
            <Text style={[styles.title, { color: colors.text.primary }]}>Gestionar</Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Accesos rápidos según tu rol.
            </Text>
          </View>

          <View style={styles.grid}>
            {visibleActions.map((action, index) => {
              const isLastInRow = (index + 1) % columns === 0;
              const marginRight = columns === 1 || isLastInRow ? 0 : gap;
              const iconColor =
                action.variant === 'admin' ? colors.text.primary : colors.primary[600];

              return (
                <View
                  key={action.key}
                  style={{ width: cardWidth, marginRight, marginBottom: gap }}
                >
                  <ManageCard
                    title={action.title}
                    description={action.description}
                    icon={action.icon(iconColor)}
                    variant={action.variant ?? 'default'}
                    badgeText={action.badgeText}
                    onPress={() => router.push(action.href)}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* Extra espacio para que el scroll se sienta “premium” */}
        <View style={{ height: spacing['2xl'] }} />
      </ScrollView>
    </Screen>
  );
});
