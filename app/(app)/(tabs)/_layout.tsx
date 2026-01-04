import { Tabs } from 'expo-router';
import { BadgePercent, Landmark, Map, Store, Wrench } from 'lucide-react-native';
import { Header } from '../../../src/components/layout';
import { useAuthUser } from '../../../src/hooks';

export default function TabsLayout() {
  const { role } = useAuthUser();
  const showManage = role === 'seller';

  return (
    <Tabs
      initialRouteName="businesses"
      screenOptions={{
        headerShown: true,
        header: () => <Header />,
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
        name="promotions"
        options={{
          title: 'Promociones',
          tabBarIcon: ({ color, size }) => <BadgePercent color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="maps"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
        }}
      />

      <Tabs.Screen name="products" options={{ href: null }} />

      <Tabs.Screen
        name="manage"
        options={{
          href: showManage ? undefined : null,
          title: 'Gestionar',
          tabBarIcon: ({ color, size }) => <Wrench color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
