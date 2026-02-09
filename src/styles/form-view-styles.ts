import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

/**
 * Estilos compartidos para FormViews (EventFormView, BusinessFormView, etc.)
 * Mantiene consistencia visual en todos los formularios de gestión.
 *
 * Uso recomendado:
 * - Importar { formViewStyles } en el componente FormView
 * - Aplicar colores dinámicos con useThemedColors() y arrays de estilos
 */
export const formViewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    maxWidth: 800,
    paddingHorizontal: spacing.md + spacing.xs, // 20
    paddingTop: spacing.lg,
    paddingBottom: spacing.md + spacing.xs, // 20
    borderBottomWidth: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.sizes['3xl'] - 2, // 28
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.sm + 1, // 15
    lineHeight: typography.sizes.sm + 6, // 20
  },
  formCard: {
    width: '100%',
    maxWidth: 800,
    marginHorizontal: spacing.md,
    marginTop: spacing.md + spacing.xs, // 20
    borderRadius: spacing.md,
    borderWidth: 1,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    borderRadius: spacing.md,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    minWidth: 200,
  },
  loadingText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
});
