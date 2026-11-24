import { useCallback, useRef } from 'react';
import { useFocusEffect } from 'expo-router';

/**
 * Hook para refrescar datos cuando una pantalla recibe foco
 * Útil para asegurar que los datos estén actualizados al navegar entre pantallas
 *
 * @param refetch - Función de refetch de React Query
 * @param enabled - Si el refetch está habilitado (default: true)
 *
 * @example
 * const { refetch } = useQuery({ queryKey: ['myData'], queryFn: fetchData });
 * useRefreshOnFocus(refetch);
 */
export function useRefreshOnFocus<T>(
  refetch: () => Promise<T> | void,
  enabled: boolean = true,
  /** No refrescar si ya se refrescó hace menos de esto (evita ráfagas al cambiar de tab) */
  minIntervalMs: number = 30 * 1000,
) {
  const isFirstMount = useRef(true);
  // Se fija en el primer foco, no durante el render (Date.now() en render no es puro)
  const lastRefreshAt = useRef(0);
  // Usar ref para almacenar la función refetch y evitar que sea dependencia del callback
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;

  useFocusEffect(
    useCallback(() => {
      // No refrescar en el primer mount (React Query ya lo hace)
      if (isFirstMount.current) {
        isFirstMount.current = false;
        lastRefreshAt.current = Date.now();
        return;
      }

      // Solo refrescar si está habilitado y pasó el intervalo mínimo
      if (enabled && Date.now() - lastRefreshAt.current >= minIntervalMs) {
        lastRefreshAt.current = Date.now();
        refetchRef.current();
      }
    }, [enabled, minIntervalMs]),
  );
}

/**
 * Hook para invalidar queries específicas cuando una pantalla recibe foco
 * Más granular que useRefreshOnFocus, permite invalidar múltiples queries
 *
 * @param queryClient - Instancia del QueryClient
 * @param queryKeys - Array de query keys a invalidar
 * @param enabled - Si la invalidación está habilitada (default: true)
 *
 * @example
 * import { queryClient } from '@/lib/react-query/client';
 * useInvalidateOnFocus(queryClient, [['promotions'], ['business']]);
 */
export function useInvalidateOnFocus(
  queryClient: { invalidateQueries: (options: { queryKey: unknown[] }) => Promise<void> },
  queryKeys: unknown[][],
  enabled: boolean = true,
) {
  const isFirstMount = useRef(true);
  // Usar refs para evitar dependencias inestables
  const queryClientRef = useRef(queryClient);
  const queryKeysRef = useRef(queryKeys);
  queryClientRef.current = queryClient;
  queryKeysRef.current = queryKeys;

  useFocusEffect(
    useCallback(() => {
      if (isFirstMount.current) {
        isFirstMount.current = false;
        return;
      }

      if (enabled) {
        queryKeysRef.current.forEach((key) => {
          queryClientRef.current.invalidateQueries({ queryKey: key });
        });
      }
    }, [enabled]),
  );
}
