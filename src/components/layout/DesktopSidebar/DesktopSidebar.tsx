/**
 * DesktopSidebar — navegación de la web en PC (solo web y pantallas anchas; ver useIsDesktopWeb).
 * Arriba el botón para plegarlo (plegado, se abre solo al pasar el mouse, por encima del
 * contenido), luego las secciones y abajo una sola fila de cuenta que abre su
 * menú (perfil, favoritos, configuración, soporte, cerrar sesión). Plegado se recuerda en este
 * navegador.
 */

import { useRef, useState, type ReactNode } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  ChevronsUpDown,
  Download,
  Heart,
  HelpCircle,
  LogIn,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  User,
  UserCircle,
  UserPlus,
} from 'lucide-react-native';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/store';
import { useProfilePhoto, useThemedColors } from '@/hooks';
import { hasDownloadAvailable, triggerDownload } from '@/utils/appDownload';
import { typography } from '@/styles/theme';

const WIDTH_OPEN = 248;
const WIDTH_CLOSED = 64;
/** Igual que el alto del encabezado, para que el botón quede alineado con el logo */
const TOP_ROW = 60;
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

type PressState = { pressed: boolean; hovered?: boolean };

export function DesktopSidebar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colors = useThemedColors();
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [menuOpen, setMenuOpen] = useState(false);
  // Plegado + mouse encima: se abre por encima del contenido sin moverlo
  const [peek, setPeek] = useState(false);
  const peekTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const narrow = collapsed && !peek;
  const onHoverIn = () => {
    if (!collapsed) return;
    peekTimer.current = setTimeout(() => setPeek(true), 120);
  };
  const onHoverOut = () => {
    if (peekTimer.current) clearTimeout(peekTimer.current);
    setPeek(false);
  };
  const { user, isAuthenticated, profileName } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      isAuthenticated: s.isAuthenticated,
      profileName: s.profileName,
    })),
  );
  const photo = useProfilePhoto(user?.id);
  const hover = (p: PressState) =>
    p.pressed || p.hovered ? colors.background.tertiary : 'transparent';

  const toggle = () => {
    setPeek(false);
    setCollapsed((v) => {
      saveCollapsed(!v);
      return !v;
    });
  };

  // Las secciones son las rutas que declaran ícono; las ocultas (href: null) no tienen
  const tabs = state.routes
    .map((route, index) => ({ route, index, options: descriptors[route.key].options }))
    .filter(({ options }) => options.tabBarIcon);

  const name = isAuthenticated ? profileName || 'Usuario' : 'Invitado';
  const avatar = photo ? (
    <Image
      source={{ uri: photo }}
      style={{ width: 32, height: 32, borderRadius: 16 }}
      contentFit="cover"
    />
  ) : (
    <View
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isAuthenticated ? colors.primary[500] : colors.background.tertiary,
      }}
    >
      <User color={isAuthenticated ? '#fff' : colors.text.secondary} size={16} />
    </View>
  );

  const go = (path: string) => () => {
    setMenuOpen(false);
    router.push(path as never);
  };

  const menuItem = (
    label: string,
    icon: (color: string) => ReactNode,
    onPress: () => void,
    color = colors.text.primary,
  ) => (
    <Pressable
      key={label}
      onPress={onPress}
      accessibilityRole="menuitem"
      style={(p: PressState) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        height: 36,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: hover(p),
      })}
    >
      {icon(color === colors.text.primary ? colors.text.secondary : color)}
      <Text style={{ fontSize: typography.sizes.sm, color }}>{label}</Text>
    </Pressable>
  );

  const divider = (key: string) => (
    <View
      key={key}
      style={{ height: 1, marginVertical: 4, backgroundColor: colors.border.light }}
    />
  );

  return (
    <View style={{ width: collapsed ? WIDTH_CLOSED : WIDTH_OPEN, height: '100%', zIndex: 20 }}>
      <Pressable
        accessible={false}
        onHoverIn={onHoverIn}
        onHoverOut={onHoverOut}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: narrow ? WIDTH_CLOSED : WIDTH_OPEN,
          paddingHorizontal: 10,
          paddingBottom: 10,
          backgroundColor: colors.background.secondary,
          borderRightWidth: 1,
          borderRightColor: colors.border.light,
          boxShadow: peek ? '8px 0px 24px rgba(0, 0, 0, 0.18)' : undefined,
          cursor: 'auto',
        }}
      >
        <View style={{ height: TOP_ROW, flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            onPress={toggle}
            accessibilityRole="button"
            accessibilityLabel={collapsed ? 'Mostrar menú' : 'Ocultar menú'}
            style={(p: PressState) => ({
              width: 44,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              backgroundColor: hover(p),
            })}
          >
            {collapsed ? (
              <PanelLeftOpen color={colors.text.secondary} size={18} />
            ) : (
              <PanelLeftClose color={colors.text.secondary} size={18} />
            )}
          </Pressable>
        </View>

        <View style={{ gap: 2 }}>
          {tabs.map(({ route, index, options }) => {
            const focused = state.index === index;
            const label = typeof options.title === 'string' ? options.title : route.name;
            const tint = focused ? colors.primary[500] : colors.text.secondary;
            return (
              <Pressable
                key={route.key}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                  }
                }}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={label}
                style={(p: PressState) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  height: 36,
                  paddingHorizontal: 13,
                  borderRadius: 8,
                  backgroundColor: focused ? colors.primary[500] + '1f' : hover(p),
                })}
              >
                {options.tabBarIcon?.({ focused, color: tint, size: 18 })}
                {!narrow && (
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: typography.sizes.sm,
                      fontWeight: focused ? '600' : '400',
                      color: focused ? colors.primary[500] : colors.text.primary,
                    }}
                  >
                    {label}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={{ flex: 1 }} />

        <Pressable
          onPress={() => setMenuOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={`Cuenta: ${name}`}
          accessibilityState={{ expanded: menuOpen }}
          style={(p: PressState) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingVertical: 6,
            paddingHorizontal: narrow ? 0 : 6,
            justifyContent: narrow ? 'center' : 'flex-start',
            borderRadius: 10,
            backgroundColor: hover(p),
          })}
        >
          {avatar}
          {!narrow && (
            <>
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: typography.sizes.sm,
                    fontWeight: '600',
                    color: colors.text.primary,
                  }}
                >
                  {name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ fontSize: typography.sizes.xs, color: colors.text.secondary }}
                >
                  {isAuthenticated ? 'Mi cuenta' : 'Iniciar sesión o registrarse'}
                </Text>
              </View>
              <ChevronsUpDown color={colors.text.tertiary} size={16} />
            </>
          )}
        </Pressable>
      </Pressable>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setMenuOpen(false)}
          accessibilityLabel="Cerrar menú de cuenta"
        >
          <View
            accessibilityRole="menu"
            onStartShouldSetResponder={() => true}
            style={{
              position: 'absolute',
              left: 10,
              bottom: 64,
              width: 240,
              padding: 6,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border.light,
              backgroundColor: colors.background.primary,
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.18)',
            }}
          >
            {isAuthenticated
              ? [
                  <Text
                    key="email"
                    numberOfLines={1}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      fontSize: typography.sizes.xs,
                      color: colors.text.secondary,
                    }}
                  >
                    {user?.email ?? name}
                  </Text>,
                  menuItem(
                    'Mi perfil',
                    (c) => <UserCircle color={c} size={18} />,
                    go('/(app)/profile'),
                  ),
                  menuItem(
                    'Mis favoritos',
                    (c) => <Heart color={c} size={18} />,
                    go('/(app)/favorites'),
                  ),
                ]
              : [
                  menuItem(
                    'Iniciar sesión',
                    (c) => <LogIn color={c} size={18} />,
                    go('/(auth)/login'),
                    colors.primary[500],
                  ),
                  menuItem(
                    'Registrarse',
                    (c) => <UserPlus color={c} size={18} />,
                    go('/(auth)/register'),
                  ),
                ]}
            {divider('d1')}
            {menuItem(
              'Configuración',
              (c) => (
                <Settings color={c} size={18} />
              ),
              go('/(app)/settings'),
            )}
            {menuItem(
              'Soporte',
              (c) => (
                <HelpCircle color={c} size={18} />
              ),
              go('/(app)/support'),
            )}
            {hasDownloadAvailable() &&
              menuItem(
                'Descargar app',
                (c) => <Download color={c} size={18} />,
                () => {
                  setMenuOpen(false);
                  triggerDownload();
                },
              )}
            {isAuthenticated && [
              divider('d2'),
              menuItem(
                'Cerrar sesión',
                (c) => <LogOut color={c} size={18} />,
                go('/(app)/logout'),
                '#ef4444',
              ),
            ]}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
