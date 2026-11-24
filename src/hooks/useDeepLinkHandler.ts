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
          // Flujo nuevo (S-14): el correo trae ?token_hash=...&type=recovery y se canjea con
          // verifyOtp. Los tokens nunca viajan en el fragmento de la URL.
          const query = new URL(url).searchParams;
          const tokenHash = query.get('token_hash');
          if (tokenHash && query.get('type') === 'recovery') {
            useAuthStore.getState().setRecoveryMode(true);
            const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' });
            if (error) throw error;
            router.replace('/(auth)/reset-password');
            return;
          }

          // Flujo anterior (enlaces ya enviados): tokens en el fragmento
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
        } catch {
          // Enlace inválido o vencido: salir del modo recovery y volver a pedirlo
          useAuthStore.getState().setRecoveryMode(false);
          router.replace('/(auth)/recover');
        }
      }
    };

    // En web, verificar si la URL actual tiene tokens de recovery
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      if (currentUrl.includes('/reset-password') || currentUrl.includes('type=recovery')) {
        const hash = window.location.hash;
        const hasTokenHash = window.location.search.includes('token_hash=');
        if (hasTokenHash || (hash && hash.includes('access_token'))) {
          handleDeepLink({ url: currentUrl });
          // Limpiar tokens de la URL para que no queden en el historial ni se procesen de nuevo
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
