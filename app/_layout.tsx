import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { Platform, StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import { queryClient } from '@/lib/react-query/client';
import { useDeepLinkHandler } from '@/hooks/useDeepLinkHandler';
import { useAuthStore } from '@/store';
import { useLocationDataStore } from '@/store/locationDataStore';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
        <Toast />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
