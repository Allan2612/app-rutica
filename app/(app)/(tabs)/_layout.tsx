import { Tabs, usePathname, useRouter } from 'expo-router';
import { Platform, useWindowDimensions } from 'react-native';
import { Home, Landmark, Map, Store, Wrench } from 'lucide-react-native';
import { HeaderWithSearch } from '@/components/layout';
import { useThemedColors } from '@/hooks';

export default function TabsLayout() {
  const colors = useThemedColors();
  const pathname = usePathname();
  const router = useRouter();

  // Ocultar tabs en formularios de creación/edición
  const shouldHideTabs =
    pathname.includes('/create') || pathname.includes('/edit') || pathname.includes('/wizard');

  // En pantallas anchas la barra va a la izquierda (como un menú lateral); abajo es de teléfono
  const { width } = useWindowDimensions();
  const isWide = width >= 1024;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <HeaderWithSearch />,
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarPosition: isWide ? 'left' : 'bottom',
        tabBarVariant: isWide ? 'material' : 'uikit',
        tabBarLabelPosition: isWide ? 'beside-icon' : 'below-icon',
        tabBarActiveBackgroundColor: isWide ? colors.primary[500] + '18' : undefined,
        tabBarItemStyle: isWide
          ? { borderRadius: 10, marginHorizontal: 8, marginVertical: 2 }
          : undefined,
        tabBarStyle: shouldHideTabs
          ? { display: 'none' }
          : isWide
            ? {
                width: 220,
                minWidth: 220, // la librería pone ~360 px por defecto
                paddingTop: 12,
                backgroundColor: colors.background.primary,
                borderRightWidth: 1,
                borderRightColor: colors.border.light,
              }
            : {
                backgroundColor: colors.background.primary,
                borderTopWidth: 0,
                ...Platform.select({
                  web: { boxShadow: '0px -2px 3px rgba(0, 0, 0, 0.05)' } as any,
                  default: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 3,
                    elevation: 8,
                  },
                }),
              },
      }}
    >
      {/* Tab 1: Negocios (con subtabs de negocios y promociones) */}
      <Tabs.Screen
        name="businesses"
        options={{
          title: 'Negocios',
          tabBarIcon: ({ color, size }) => <Store color={color} size={size} />,
          href: '/businesses',
        }}
      />

      {/* Tab 2: Atracciones (tendrá subtabs de atracciones y eventos) */}
      <Tabs.Screen
        name="attractions"
        options={{
          title: 'Atracciones',
          tabBarIcon: ({ color, size }) => <Landmark color={color} size={size} />,
          href: '/attractions',
        }}
      />

      {/* Tab 3: Home (Central) */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          href: '/home',
        }}
      />

      {/* Tab 4: Mapa */}
      <Tabs.Screen
        name="maps"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
          href: '/maps',
        }}
      />

      {/* Tab 5: Gestionar (Siempre visible) */}
      <Tabs.Screen
        name="manage"
        options={{
          title: 'Gestionar',
          tabBarIcon: ({ color, size }) => <Wrench color={color} size={size} />,
          href: '/manage',
        }}
      />

      {/* Hidden screens/stacks */}
      <Tabs.Screen name="promotions" options={{ href: null }} />
      <Tabs.Screen name="events" options={{ href: null }} />
    </Tabs>
  );
}
