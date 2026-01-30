import { memo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Shield, ClipboardCheck, ChevronRight, Settings, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { BackButton } from '@/components/ui';
import { useVerificationStats } from '../../hooks/useAdminVerification';
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
};

export const AdminHubScreen = memo(function AdminHubScreen() {
  const colors = useThemedColors();
  const router = useRouter();
  const { data: stats } = useVerificationStats();

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
    },
    // Puedes agregar más opciones de admin aquí en el futuro:
    // {
    //   key: 'users',
    //   title: 'Gestión de Usuarios',
    //   description: 'Administra roles y permisos',
    //   href: '/(app)/(tabs)/manage/admin/users',
    //   icon: Users,
    //   iconColor: '#8b5cf6',
    //   iconBg: '#ede9fe',
    // },
    // {
    //   key: 'settings',
    //   title: 'Configuración',
    //   description: 'Ajustes del sistema',
    //   href: '/(app)/(tabs)/manage/admin/settings',
    //   icon: Settings,
    //   iconColor: '#6b7280',
    //   iconBg: '#f3f4f6',
    // },
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
            const pendingCount = action.showBadge ? stats?.totalPending || 0 : 0;

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
