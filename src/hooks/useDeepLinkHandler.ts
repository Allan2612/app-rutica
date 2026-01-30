import { useEffect } from 'react';
import { Linking, Platform } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/store';

/**
 * Hook para manejar deep links de recuperación de contraseña
 */
export function useDeepLinkHandler() {
  useEffect(() => {

    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;

      // Verificar si es un link de reset password
      if (url.includes('/reset-password') || url.includes('type=recovery')) {
        try {
          // Extraer el token de acceso del URL
          const hashParams = new URL(url).hash.substring(1);
          const params = new URLSearchParams(hashParams);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            // IMPORTANTE: Activar modo recovery ANTES de establecer la sesión
            // Esto evita que el authStore cargue datos del usuario
            useAuthStore.getState().setRecoveryMode(true);
            
            // Establecer la sesión con el token
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            // Redirigir a la pantalla de reset password
            router.replace('/(auth)/reset-password');
          }
        } catch (error) {
          // Error processing deep link - limpiar modo recovery
          useAuthStore.getState().setRecoveryMode(false);
        }
      }
    };

    // En web, verificar si la URL actual tiene tokens de recovery
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      if (currentUrl.includes('/reset-password') || currentUrl.includes('type=recovery')) {
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
          handleDeepLink({ url: currentUrl });
          // Limpiar el hash de la URL para que no se procese de nuevo
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    }

    // Escuchar cambios de URL (para móvil)
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Verificar si la app se abrió con un deep link (para móvil)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {

      subscription.remove();
    };
  }, []);
}
