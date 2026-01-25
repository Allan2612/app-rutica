import { Tabs, usePathname, useRouter } from 'expo-router';
import { Home, Landmark, Map, Store, Wrench } from 'lucide-react-native';
import { HeaderWithSearch } from '@/components/layout';
import { useThemedColors } from '@/hooks';

export default function TabsLayout() {
  const colors = useThemedColors();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <HeaderWithSearch />,
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 8,
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
          title: 'Home',
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
    </Tabs>
  );
}
