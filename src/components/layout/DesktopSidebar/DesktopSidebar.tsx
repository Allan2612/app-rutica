/**
 * DesktopSidebar — navegación de la web en PC (solo web y pantallas anchas; ver useIsDesktopWeb).
 * Secciones arriba, cuenta abajo (perfil, favoritos, configuración, soporte, sesión) y un botón
 * para plegarlo a solo íconos; esa preferencia se recuerda en este navegador.
 */

import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  Download,
  Heart,
  HelpCircle,
  LogIn,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  User,
  UserPlus,
} from 'lucide-react-native';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/store';
import { useProfilePhoto, useThemedColors } from '@/hooks';
import { hasDownloadAvailable, triggerDownload } from '@/utils/appDownload';
import { typography } from '@/styles/theme';

const WIDTH_OPEN = 232;
const WIDTH_CLOSED = 72;
const STORAGE_KEY = 'rutica.sidebarCollapsed';

function readCollapsed() {
  try {
    return globalThis.localStorage?.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function saveCollapsed(value: boolean) {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, value ? '1' : '0');
  } catch {
    // Sin almacenamiento (modo privado): solo no se recuerda
  }
}

export function DesktopSidebar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colors = useThemedColors();
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const { user, isAuthenticated, profileName } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      isAuthenticated: s.isAuthenticated,
      profileName: s.profileName,
    })),
  );
  const photo = useProfilePhoto(user?.id);

  const toggle = () => {
    setCollapsed((v) => {
      saveCollapsed(!v);
      return !v;
    });
  };

  const item = (
    key: string,
    label: string,
    icon: (color: string) => ReactNode,
    onPress: () => void,
    opts: { active?: boolean; color?: string } = {},
  ) => {
    const tint = opts.color ?? (opts.active ? colors.primary[500] : colors.text.secondary);
    return (
      <Pressable
        key={key}
        onPress={onPress}
        accessibilityRole={opts.active === undefined ? 'button' : 'tab'}
        accessibilityState={opts.active === undefined ? undefined : { selected: opts.active }}
        accessibilityLabel={label}
        style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 12,
          height: 44,
          paddingHorizontal: collapsed ? 0 : 12,
          borderRadius: 10,
          backgroundColor: opts.active
            ? colors.primary[500] + '1f'
            : pressed || hovered
              ? colors.background.tertiary
              : 'transparent',
        })}
      >
        {icon(tint)}
        {!collapsed && (
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: typography.sizes.sm,
              fontWeight: opts.active ? '600' : '500',
              color: opts.color ?? (opts.active ? colors.primary[500] : colors.text.primary),
            }}
          >
            {label}
          </Text>
        )}
      </Pressable>
    );
  };

  // Las secciones son las rutas que declaran ícono; las ocultas (href: null) no tienen
  const tabs = state.routes
    .map((route, index) => ({ route, index, options: descriptors[route.key].options }))
    .filter(({ options }) => options.tabBarIcon);

  const go = (path: string) => () => router.push(path as never);

  return (
    <View
      style={{
        width: collapsed ? WIDTH_CLOSED : WIDTH_OPEN,
        height: '100%',
        backgroundColor: colors.background.primary,
        borderRightWidth: 1,
        borderRightColor: colors.border.light,
      }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 12, gap: 4 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: collapsed ? 'center' : 'flex-end',
            marginBottom: 8,
          }}
        >
          <Pressable
            onPress={toggle}
            accessibilityRole="button"
            accessibilityLabel={collapsed ? 'Mostrar menú' : 'Ocultar menú'}
            style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
              padding: 8,
              borderRadius: 8,
              backgroundColor: pressed || hovered ? colors.background.tertiary : 'transparent',
            })}
          >
            {collapsed ? (
              <PanelLeftOpen color={colors.text.secondary} size={20} />
            ) : (
              <PanelLeftClose color={colors.text.secondary} size={20} />
            )}
          </Pressable>
        </View>

        {tabs.map(({ route, index, options }) => {
          const focused = state.index === index;
          const label = typeof options.title === 'string' ? options.title : route.name;
          return item(
            route.key,
            label,
            (color) => options.tabBarIcon?.({ focused, color, size: 20 }),
            () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented)
                navigation.navigate(route.name, route.params);
            },
            { active: focused },
          );
        })}

        <View style={{ flex: 1, minHeight: 24 }} />

        <View
          style={{
            gap: 4,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border.light,
          }}
        >
          {isAuthenticated ? (
            <>
              <Pressable
                onPress={go('/(app)/profile')}
                accessibilityRole="button"
                accessibilityLabel={`Mi perfil: ${profileName || 'Usuario'}`}
                style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: 10,
                  padding: collapsed ? 4 : 8,
                  borderRadius: 10,
                  backgroundColor: pressed || hovered ? colors.background.tertiary : 'transparent',
                })}
              >
                {photo ? (
                  <Image
                    source={{ uri: photo }}
                    style={{ width: 36, height: 36, borderRadius: 18 }}
                    contentFit="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.primary[500],
                    }}
                  >
                    <User color="#fff" size={18} />
                  </View>
                )}
                {!collapsed && (
                  <View style={{ flex: 1 }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: typography.sizes.sm,
                        fontWeight: '600',
                        color: colors.text.primary,
                      }}
                    >
                      {profileName || 'Usuario'}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: typography.sizes.xs, color: colors.text.secondary }}
                    >
                      Ver perfil
                    </Text>
                  </View>
                )}
              </Pressable>
              {item(
                'fav',
                'Mis favoritos',
                (c) => (
                  <Heart color={c} size={20} />
                ),
                go('/(app)/favorites'),
              )}
            </>
          ) : (
            <>
              {item(
                'login',
                'Iniciar sesión',
                (c) => (
                  <LogIn color={c} size={20} />
                ),
                go('/(auth)/login'),
                {
                  color: colors.primary[500],
                },
              )}
              {item(
                'register',
                'Registrarse',
                (c) => (
                  <UserPlus color={c} size={20} />
                ),
                go('/(auth)/register'),
              )}
            </>
          )}
          {item(
            'settings',
            'Configuración',
            (c) => (
              <Settings color={c} size={20} />
            ),
            go('/(app)/settings'),
          )}
          {item(
            'support',
            'Soporte',
            (c) => (
              <HelpCircle color={c} size={20} />
            ),
            go('/(app)/support'),
          )}
          {hasDownloadAvailable() &&
            item(
              'download',
              'Descargar app',
              (c) => <Download color={c} size={20} />,
              triggerDownload,
            )}
          {isAuthenticated &&
            item(
              'logout',
              'Cerrar sesión',
              (c) => <LogOut color={c} size={20} />,
              go('/(app)/logout'),
              { color: '#ef4444' },
            )}
        </View>
      </ScrollView>
    </View>
  );
}
