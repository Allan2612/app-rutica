import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

/**
 * Estilos compartidos para pantallas placeholder (en desarrollo)
 * Usado por: Home, Business, Events, Attractions, Promotions
 * NOTA: backgroundColor y colores de texto se aplican dinámicamente usando useThemedColors
 */
export const placeholderScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md + 4,
  },
  title: {
    fontSize: typography.sizes['3xl'] - 2,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.base,
  },
});
