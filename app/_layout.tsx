import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { queryClient } from '../src/lib/react-query/client';
import { useDeepLinkHandler } from '../src/hooks/useDeepLinkHandler';
import { useAuthStore } from '../src/store';
import { useLocationDataStore } from '../src/store/locationDataStore';

export default function RootLayout() {
  useDeepLinkHandler();

  // Inicializar el store de autenticación y ubicaciones
  useEffect(() => {
    // Inicializar auth store
    const { initialize, cleanup } = useAuthStore.getState();
    initialize();

    // Cargar ubicaciones desde Supabase
    const { loadLocations } = useLocationDataStore.getState();
    loadLocations();
    
    // Timeout de seguridad
    const safetyTimeout = setTimeout(() => {
      const state = useAuthStore.getState();
      if (state.isLoading) {
        console.warn('[APP] Timeout: forzando isLoading = false');
        useAuthStore.setState({ isLoading: false });
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
      cleanup();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
      <Toast />
    </QueryClientProvider>
  );
}
