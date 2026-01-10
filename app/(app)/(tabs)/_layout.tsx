import { Tabs } from 'expo-router';
import { Home, Landmark, Map, Store, Wrench } from 'lucide-react-native';
import { HeaderWithSearch } from '../../../src/components/layout';

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: true,
        header: () => <HeaderWithSearch />,
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0.5,
          borderTopColor: '#e5e5e5',
        },
      }}
    >
      {/* Tab 1: Negocios (con subtabs de negocios y promociones) */}
      <Tabs.Screen
        name="businesses"
        options={{
          title: 'Negocios',
          tabBarIcon: ({ color, size }) => <Store color={color} size={size} />,
        }}
      />

      {/* Tab 2: Atracciones (tendrá subtabs de atracciones y eventos) */}
      <Tabs.Screen
        name="attractions"
        options={{
          title: 'Atracciones',
          tabBarIcon: ({ color, size }) => <Landmark color={color} size={size} />,
        }}
      />

      {/* Tab 3: Home (Central) */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      {/* Tab 4: Mapa */}
      <Tabs.Screen
        name="maps"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
        }}
      />

      {/* Tab 5: Gestionar (Siempre visible) */}
      <Tabs.Screen
        name="manage"
        options={{
          title: 'Gestionar',
          tabBarIcon: ({ color, size }) => <Wrench color={color} size={size} />,
        }}
      />

      {/* Hidden screens/stacks */}
      <Tabs.Screen name="promotions" options={{ href: null }} />
    </Tabs>
  );
}
