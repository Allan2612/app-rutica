import { memo, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import type { PropsWithChildren } from 'react';
import { router, usePathname, useRootNavigationState } from 'expo-router';
import type { UserRole } from '@/types/enums';
import { useAuthStore } from '@/store';

export interface RequireRoleProps extends PropsWithChildren {
  allowedRoles: readonly UserRole[];
  /**
   * A dónde redirigir si no cumple el rol.
   * Por defecto vuelve a Home.
   */
  redirectTo?: string;
  /**
   * Si es true, también requiere sesión (user != null).
   */
  requireAuth?: boolean;
}

/**
 * Guard de rol para rutas sensibles (ej. Admin).
 * Seguridad: evita que se acceda por navegación manual si el rol no corresponde.
 */
export const RequireRole = memo(function RequireRole({
  allowedRoles,
  redirectTo = '/(app)/(tabs)/home',
  requireAuth = true,
  children,
}: RequireRoleProps) {
  const pathname = usePathname();
  const rootNavigationState = useRootNavigationState();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  // Mientras se restaura la sesión el rol todavía es null: no redirigir en ese momento
  // (si no, recargar o abrir por deep link una ruta protegida expulsa al home).
  const isLoading = useAuthStore((s) => s.isLoading || s._isLoadingData);

  const hasAuth = !requireAuth || (isAuthenticated && !!user);
  const isAllowed = hasAuth && !!role && allowedRoles.includes(role);

  useEffect(() => {
    // Esperar a que el navegador esté listo antes de intentar navegar
    if (!rootNavigationState?.key || isLoading) return;

    // Delay para asegurar que el Root Layout esté montado
    const timer = setTimeout(() => {
      if (!isAllowed && pathname !== redirectTo) {
        router.replace(redirectTo);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isAllowed, isLoading, pathname, redirectTo, rootNavigationState?.key]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return children;
});
