import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

/**
 * Estilos compartidos para pantallas placeholder (en desarrollo)
 * Usado por: Home, Business, Events, Attractions, Promotions
 */
export const placeholderScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.md + 4,
  },
  title: {
    fontSize: typography.sizes['3xl'] - 2,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
  },
});
