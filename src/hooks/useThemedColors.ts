import { useMemo } from 'react';
import { useColorScheme } from './use-color-scheme';
import { colors } from '@/styles/theme/colors';

/**
 * Hook que devuelve los colores según el tema actual (light/dark)
 * Retorna colores adaptados dinámicamente
 */
export function useThemedColors() {
  const theme = useColorScheme();

  return useMemo(() => {
    const isDark = theme === 'dark';

    return {
      // Colores de fondo (GitHub dark inspired)
      background: {
        primary: isDark ? '#0d1117' : colors.background.primary,      // Muy oscuro
        secondary: isDark ? '#161b22' : colors.background.secondary,  // Oscuro medio
        tertiary: isDark ? '#21262d' : colors.background.tertiary,    // Oscuro claro
      },

      // Colores de texto (alta legibilidad)
      text: {
        primary: isDark ? '#e6edf3' : colors.text.primary,      // Blanco suave
        secondary: isDark ? '#8b949e' : colors.text.secondary,  // Gris medio
        tertiary: isDark ? '#6e7681' : colors.text.tertiary,    // Gris suave
        inverse: isDark ? '#0d1117' : colors.text.inverse,      // Inverso
      },

      // Colores de bordes (visibles pero sutiles)
      border: {
        light: isDark ? '#30363d' : colors.border.light,     // Borde sutil
        medium: isDark ? '#3d444d' : colors.border.medium,   // Borde medio
        dark: isDark ? '#484f58' : colors.border.dark,       // Borde visible
      },

      // Colores de marca (permanecen iguales)
      primary: colors.primary,
      
      // Colores semánticos
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      info: colors.info,

      // Colores de estado
      status: colors.status,

      // Overlay colors
      overlay: colors.overlay,

      // Social media brand colors
      social: colors.social,

      // Promo colors (combo badges, etc.)
      promo: {
        badge: colors.promo.badge,
        badgeText: colors.promo.badgeText,
        combo: isDark ? colors.promo.combo.dark : colors.promo.combo.light,
      },

      // Colores de tipos de entidad (para admin/verification)
      entityTypes: {
        business: isDark ? colors.entityTypes.business.dark : colors.entityTypes.business.light,
        event: isDark ? colors.entityTypes.event.dark : colors.entityTypes.event.light,
        attraction: isDark ? colors.entityTypes.attraction.dark : colors.entityTypes.attraction.light,
        promotion: isDark ? colors.entityTypes.promotion.dark : colors.entityTypes.promotion.light,
      },

      // Tema actual
      theme,
      isDark,
    };
  }, [theme]);
}
