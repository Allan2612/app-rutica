import { QueryClient, focusManager } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';
import type { AppStateStatus } from 'react-native';

/**
 * Configurar focusManager para React Native
 * Esto permite que React Query detecte cuando la app vuelve al foreground
 * y refresque automáticamente los datos stale
 */
export function setupReactQueryFocusManager() {
  // Solo configurar para móvil, en web funciona automáticamente
  if (Platform.OS === 'web') return;

  focusManager.setEventListener((handleFocus) => {
    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      // Cuando la app vuelve al foreground
      handleFocus(state === 'active');
    });

    return () => {
      subscription.remove();
    };
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Los datos siempre se consideran stale - siempre refetch en foco
      gcTime: 10 * 60 * 1000, // 10 minutos - mantener en cache para navegación rápida
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true, // Refetch cuando la app vuelve al foco
      refetchOnMount: true, // Refetch cuando el componente se monta (si stale)
      refetchOnReconnect: true, // Refetch cuando se reconecta
    },
    mutations: {
      retry: 1,
    },
  },
});
