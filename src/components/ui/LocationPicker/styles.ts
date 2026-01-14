import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';
import { getShadowStyle } from '@/utils/shadowHelper';

export const styles = StyleSheet.create({
  container: {
    borderRadius: spacing.sm + 4,
    overflow: 'hidden',
    borderWidth: 1,
    // Borde dinámico se aplicará con useThemedColors en el componente
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm + 4,
    // backgroundColor se aplicará dinámicamente en el componente
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
    // color se aplicará dinámicamente en el componente
    flex: 1,
  },
  button: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: 6,
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor se aplicará dinámicamente en el componente
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingAddressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    // backgroundColor y borderBottomColor se aplicarán dinámicamente en el componente
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  loadingAddressText: {
    fontSize: typography.sizes.xs,
    // color se aplicará dinámicamente en el componente
  },
  coordinatesWeb: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    backgroundColor: 'white',
    padding: spacing.sm,
    borderRadius: 6,
    zIndex: 1000,
    ...getShadowStyle({
      color: colors.dark.background,
      offsetY: 2,
      opacity: 0.2,
      radius: 4,
      elevation: 3,
    }),
  },
  coordText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
  hint: {
    padding: spacing.sm,
    // backgroundColor y color se aplicarán dinámicamente en el componente
    fontSize: typography.sizes.xs,
    textAlign: 'center',
  },
});
