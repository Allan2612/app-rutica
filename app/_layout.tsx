import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { Platform, StatusBar, View, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { queryClient } from '@/lib/react-query/client';
import { useDeepLinkHandler } from '@/hooks/useDeepLinkHandler';
import { useAuthStore } from '@/store';
import { useLocationDataStore } from '@/store/locationDataStore';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { setupReanimatedConfig } from '@/lib/reanimated';

// Configurar Reanimated una sola vez al inicio
setupReanimatedConfig();
export default function RootLayout() {
  useDeepLinkHandler();

  // Inicializar el store de autenticación y ubicaciones
  useEffect(() => {
    // Inicializar auth store
    const { initialize, cleanup, resetLoadingFlag } = useAuthStore.getState();
    initialize();

    // Cargar ubicaciones desde Supabase
    const { loadLocations } = useLocationDataStore.getState();
    loadLocations();
    
    // Listener para cuando la página vuelve a estar visible (cambio de tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // NO resetear inmediatamente - esperar a ver si la carga se completa
        // Si después de 3 segundos sigue en _isLoadingData, ENTONCES resetear
        setTimeout(() => {
          const state = useAuthStore.getState();
          if (state._isLoadingData) {
            resetLoadingFlag();
          }
        }, 3000);
      }
    };
    
    // Solo en web
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    
    // Timeout de seguridad
    const safetyTimeout = setTimeout(() => {
      const state = useAuthStore.getState();
      if (state.isLoading) {
        console.warn('[APP] Timeout: forzando isLoading = false');
        useAuthStore.setState({ isLoading: false, _isLoadingData: false });
      }
    }, 12000);
    
    // Configurar título y meta tags para web
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.title = 'Rutica - Descubre comercios y atracciones';
      
      // Meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', 'Descubre comercios, atracciones y promociones cerca de ti');
      
      // Theme color
      let metaTheme = document.querySelector('meta[name="theme-color"]');
      if (!metaTheme) {
        metaTheme = document.createElement('meta');
        metaTheme.setAttribute('name', 'theme-color');
        document.head.appendChild(metaTheme);
      }
      metaTheme.setAttribute('content', '#10b981');
    }
    
    return () => {
      clearTimeout(safetyTimeout);
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
      cleanup();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar 
          barStyle="light-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
        </Stack>
        <Toast 
          config={{
            success: (props) => (
              <View style={{
                backgroundColor: '#1a1a1a',
                padding: 16,
                borderRadius: 12,
                borderLeftWidth: 4,
                borderLeftColor: '#10b981',
                marginHorizontal: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 5,
                minWidth: 300,
              }}>
                <Text style={{ color: '#10b981', fontWeight: '600', fontSize: 16, marginBottom: 4 }}>
                  {props.text1}
                </Text>
                {props.text2 && (
                  <Text style={{ color: '#b3b3b3', fontSize: 14 }}>
                    {props.text2}
                  </Text>
                )}
              </View>
            ),
            error: (props) => (
              <View style={{
                backgroundColor: '#1a1a1a',
                padding: 16,
                borderRadius: 12,
                borderLeftWidth: 4,
                borderLeftColor: '#ef4444',
                marginHorizontal: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 5,
                minWidth: 300,
              }}>
                <Text style={{ color: '#ef4444', fontWeight: '600', fontSize: 16, marginBottom: 4 }}>
                  {props.text1}
                </Text>
                {props.text2 && (
                  <Text style={{ color: '#b3b3b3', fontSize: 14 }}>
                    {props.text2}
                  </Text>
                )}
              </View>
            ),
            info: (props) => (
              <View style={{
                backgroundColor: '#1a1a1a',
                padding: 16,
                borderRadius: 12,
                borderLeftWidth: 4,
                borderLeftColor: '#3b82f6',
                marginHorizontal: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 5,
                minWidth: 300,
              }}>
                <Text style={{ color: '#3b82f6', fontWeight: '600', fontSize: 16, marginBottom: 4 }}>
                  {props.text1}
                </Text>
                {props.text2 && (
                  <Text style={{ color: '#b3b3b3', fontSize: 14 }}>
                    {props.text2}
                  </Text>
                )}
              </View>
            ),
          }}
        />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
