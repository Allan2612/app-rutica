/**
 * Estilos para EditPromotionWizardScreen
 * Extiende los estilos del wizard de creación con estilos adicionales para estados loading/error
 */

import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';
export { styles as wizardStyles } from '../CreatePromotionWizardScreen/styles';

// Estilos adicionales específicos para Edit (estados de carga y error)
export const editStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.base,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    marginTop: spacing.md,
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
  },
  errorSubtitle: {
    marginTop: spacing.sm,
    fontSize: typography.sizes.base,
    textAlign: 'center',
  },
});

// Re-exportar styles base para compatibilidad
export { styles } from '../CreatePromotionWizardScreen/styles';
