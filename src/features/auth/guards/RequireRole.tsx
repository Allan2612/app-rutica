import { memo, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { router, usePathname } from 'expo-router';
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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);

  const hasAuth = !requireAuth || (isAuthenticated && !!user);
  const isAllowed = hasAuth && !!role && allowedRoles.includes(role);

  useEffect(() => {
    if (!isAllowed && pathname !== redirectTo) {
      router.replace(redirectTo);
    }
  }, [isAllowed, pathname, redirectTo]);

  if (!isAllowed) {
    return null;
  }

  return children;
});
