import { memo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { ClipboardCheck, ChevronRight, MessageSquare, Package, Crown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemedColors, useRefreshOnFocus } from '@/hooks';
import { BackButton } from '@/components/ui';
import { useVerificationStats } from '../../hooks/useAdminVerification';
import { useAdminSubscriptionStats } from '../../hooks/useAdminSubscriptions';
import { styles } from './styles';

type AdminAction = {
  key: string;
  title: string;
  description: string;
  href: string;
  icon: typeof ClipboardCheck;
  iconColor: string;
  iconBg: string;
  showBadge?: boolean;
  badgeCount?: number;
};

export const AdminHubScreen = memo(function AdminHubScreen() {
  const colors = useThemedColors();
  const router = useRouter();
  const { data: verificationStats, refetch: refetchVerification } = useVerificationStats();
  const { data: subscriptionStats, refetch: refetchSubscription } = useAdminSubscriptionStats();

  // Refrescar estadísticas cuando la pantalla recibe foco
  useRefreshOnFocus(refetchVerification);
  useRefreshOnFocus(refetchSubscription);

  const actions: AdminAction[] = [
    {
      key: 'verification',
      title: 'Verificación de Contenido',
      description: 'Revisa y aprueba solicitudes pendientes',
      href: '/(app)/(tabs)/manage/admin/verification',
      icon: ClipboardCheck,
      iconColor: '#3b82f6',
      iconBg: '#dbeafe',
      showBadge: true,
      badgeCount: verificationStats?.totalPending || 0,
    },
    {
      key: 'subscriptions',
      title: 'Gestión de Suscripciones',
      description: 'Administra planes premium y pagos',
      href: '/(app)/(tabs)/manage/admin/subscriptions',
      icon: Crown,
      iconColor: '#eab308',
      iconBg: '#fef9c3',
      showBadge: true,
      badgeCount: subscriptionStats?.pending || 0,
    },
    {
      key: 'reviews',
      title: 'Gestión de Reseñas',
      description: 'Administra y modera todas las reseñas',
      href: '/(app)/(tabs)/manage/admin/reviews',
      icon: MessageSquare,
      iconColor: '#10b981',
      iconBg: '#d1fae5',
      showBadge: false,
    },
    {
      key: 'products',
      title: 'Gestión de Productos',
      description: 'Administra productos de todos los negocios',
      href: '/(app)/(tabs)/manage/admin/products',
      icon: Package,
      iconColor: '#8b5cf6',
      iconBg: '#ede9fe',
      showBadge: false,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
          <View style={styles.headerRow}>
            <BackButton href="/(app)/(tabs)/manage" />
            <View style={styles.headerContent}>
              <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                Panel de Administración
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                Herramientas avanzadas para gestionar la plataforma.
              </Text>
            </View>
          </View>
        </View>

        {/* Admin Options Grid */}
        <View style={styles.grid}>
          {actions.map((action) => {
            const Icon = action.icon;
            const pendingCount = action.showBadge ? action.badgeCount || 0 : 0;

            return (
              <Pressable
                key={action.key}
                style={({ pressed }) => [
                  styles.adminCard,
                  {
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.medium,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={() => router.push(action.href as any)}
              >
                <View style={[styles.iconContainer, { backgroundColor: action.iconBg }]}>
                  <Icon color={action.iconColor} size={24} strokeWidth={2} />
                </View>

                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                    {action.title}
                  </Text>
                  <Text style={[styles.cardDescription, { color: colors.text.secondary }]}>
                    {action.description}
                  </Text>
                </View>

                {action.showBadge && pendingCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.warning }]}>
                    <Text style={[styles.badgeText, { color: '#fff' }]}>{pendingCount}</Text>
                  </View>
                )}

                <ChevronRight
                  color={colors.text.tertiary}
                  size={20}
                  strokeWidth={2}
                  style={styles.chevron}
                />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
});
