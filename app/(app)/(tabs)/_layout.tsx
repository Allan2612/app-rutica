import { Tabs } from 'expo-router';
import { Home, Store, Landmark, Map, Wrench } from 'lucide-react-native';
import { HeaderWithSearch } from '../../../src/components/layout';
import { useAuthUser } from '../../../src/hooks';

export default function TabsLayout() {
  const { role } = useAuthUser();

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
      <Tabs.Screen
        name="businesses"
        options={{
          title: 'Comercios',
          tabBarIcon: ({ color, size }) => <Store color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="attractions"
        options={{
          title: 'Atracciones',
          tabBarIcon: ({ color, size }) => <Landmark color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="maps"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="promotions"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="products"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen name="manage" options={{
        title: 'Gestionar',
        tabBarIcon: ({ color, size }) => <Wrench color={color} size={size} />,
      }} />
    </Tabs>
  );
}
