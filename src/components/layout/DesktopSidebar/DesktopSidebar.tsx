/**
 * DesktopSidebar — navegación de la web en PC (solo web y pantallas anchas; ver useIsDesktopWeb).
 * Arriba el botón para plegarlo (plegado, se abre solo al pasar el mouse, por encima del
 * contenido). Grupos: Explorar (secciones), Más (favoritos, configuración, soporte, descarga) y
 * abajo la cuenta (perfil, donde está cerrar sesión, o iniciar sesión). Plegado se recuerda en
 * este navegador.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  Download,
  Heart,
  HelpCircle,
  LogIn,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  User,
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

  // Plegado + mouse encima (en cualquier parte del panel, íconos incluidos): se abre por encima
  // del contenido sin moverlo. mouseenter/leave del DOM: no dependen de en qué hijo entra.
  const [peek, setPeek] = useState(false);
  const panelRef = useRef<View>(null);
  const collapsedRef = useRef(collapsed);
  useEffect(() => {
    collapsedRef.current = collapsed;
  }, [collapsed]);
  useEffect(() => {
    const el = panelRef.current as unknown as HTMLElement | null;
    if (!el?.addEventListener) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const enter = () => {
      if (collapsedRef.current) timer = setTimeout(() => setPeek(true), 120);
    };
    const leave = () => {
      clearTimeout(timer);
      setPeek(false);
    };
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => {
      clearTimeout(timer);
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
    };
  }, []);
  const narrow = collapsed && !peek;

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
    router.push(path as never);
  };

  // Fila del panel: secciones y opciones de cuenta comparten el mismo aspecto
  const row = (
    key: string,
    label: string,
    icon: (color: string) => ReactNode,
    onPress: () => void,
    opts: { active?: boolean; color?: string; role?: 'tab' | 'button' } = {},
  ) => {
    const tint = opts.color ?? (opts.active ? colors.primary[500] : colors.text.secondary);
    return (
      <Pressable
        key={key}
        onPress={onPress}
        accessibilityRole={opts.role ?? 'button'}
        accessibilityState={opts.role === 'tab' ? { selected: !!opts.active } : undefined}
        accessibilityLabel={label}
        style={(p: PressState) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          height: 36,
          paddingHorizontal: 13,
          borderRadius: 8,
          backgroundColor: opts.active ? colors.primary[500] + '1f' : hover(p),
        })}
      >
        {icon(tint)}
        {!narrow && (
          <Text
            numberOfLines={1}
            style={{
              fontSize: typography.sizes.sm,
              fontWeight: opts.active ? '600' : '400',
              color: opts.color ?? (opts.active ? colors.primary[500] : colors.text.primary),
            }}
          >
            {label}
          </Text>
        )}
      </Pressable>
    );
  };

  const icon = (Icon: typeof User) =>
    function renderIcon(c: string) {
      return <Icon color={c} size={18} />;
    };

  // Título de grupo; plegado deja el mismo alto para que los íconos no salten al abrirse
  const sectionLabel = (text: string) => (
    <View style={{ height: 28, justifyContent: 'center', paddingHorizontal: 13 }}>
      {!narrow && (
        <Text
          style={{
            fontSize: typography.sizes.xs,
            fontWeight: '600',
            letterSpacing: 0.4,
            color: colors.text.tertiary,
          }}
        >
          {text.toUpperCase()}
        </Text>
      )}
    </View>
  );

  return (
    <View style={{ width: collapsed ? WIDTH_CLOSED : WIDTH_OPEN, height: '100%', zIndex: 20 }}>
      <View
        ref={panelRef}
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

        {sectionLabel('Explorar')}
        <View style={{ gap: 2 }}>
          {tabs.map(({ route, index, options }) => {
            const focused = state.index === index;
            const label = typeof options.title === 'string' ? options.title : route.name;
            return row(
              route.key,
              label,
              (color) => options.tabBarIcon?.({ focused, color, size: 18 }),
              () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              },
              { active: focused, role: 'tab' },
            );
          })}
        </View>

        <View style={{ flex: 1 }} />

        {sectionLabel('Más')}
        <View style={{ gap: 2 }}>
          {isAuthenticated && row('fav', 'Mis favoritos', icon(Heart), go('/(app)/favorites'))}
          {row('settings', 'Configuración', icon(Settings), go('/(app)/settings'))}
          {row('support', 'Soporte', icon(HelpCircle), go('/(app)/support'))}
          {hasDownloadAvailable() &&
            row('download', 'Descargar app', icon(Download), triggerDownload)}
        </View>

        <View style={{ height: 1, marginVertical: 10, backgroundColor: colors.border.light }} />

        {isAuthenticated ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Pressable
              onPress={go('/(app)/profile')}
              accessibilityRole="button"
              accessibilityLabel={`Mi perfil: ${name}`}
              style={(p: PressState) => ({
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: narrow ? 'center' : 'flex-start',
                gap: 10,
                paddingVertical: 6,
                paddingHorizontal: narrow ? 0 : 6,
                borderRadius: 10,
                backgroundColor: hover(p),
              })}
            >
              {avatar}
              {!narrow && (
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
                    Ver perfil
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        ) : (
          <View style={{ gap: 6 }}>
            <Pressable
              onPress={go('/(auth)/login')}
              accessibilityRole="button"
              accessibilityLabel="Iniciar sesión"
              style={(p: PressState) => ({
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                height: 40,
                borderRadius: 10,
                backgroundColor: colors.primary[500],
                opacity: p.pressed ? 0.85 : 1,
              })}
            >
              <LogIn color="#fff" size={18} />
              {!narrow && (
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: typography.sizes.sm }}>
                  Iniciar sesión
                </Text>
              )}
            </Pressable>
            {!narrow && (
              <Pressable
                onPress={go('/(auth)/register')}
                accessibilityRole="link"
                style={{ alignItems: 'center', paddingVertical: 4 }}
              >
                <Text style={{ fontSize: typography.sizes.xs, color: colors.text.secondary }}>
                  ¿No tienes cuenta?{' '}
                  <Text style={{ color: colors.primary[500], fontWeight: '600' }}>Regístrate</Text>
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
