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

      // Tema actual
      theme,
      isDark,
    };
  }, [theme]);
}
