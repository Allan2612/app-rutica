import { useEffect } from 'react';
import { Linking } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase/client';

/**
 * Hook para manejar deep links de recuperación de contraseña
 */
export function useDeepLinkHandler() {
  useEffect(() => {
    console.log('[DEEP LINK HANDLER] Inicializado');

    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      console.log('[DEEP LINK] URL recibida:', url);

      // Verificar si es un link de reset password
      if (url.includes('/reset-password') || url.includes('type=recovery')) {
        try {
          // Extraer el token de acceso del URL
          const hashParams = new URL(url).hash.substring(1);
          const params = new URLSearchParams(hashParams);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            console.log('[DEEP LINK] Tokens encontrados, estableciendo sesión');
            
            // Establecer la sesión con el token
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            // Redirigir a la pantalla de reset password
            router.replace('/(auth)/reset-password');
          }
        } catch (error) {
          console.error('[DEEP LINK] Error procesando URL:', error);
        }
      }
    };

    // Escuchar cambios de URL
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Verificar si la app se abrió con un deep link
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
