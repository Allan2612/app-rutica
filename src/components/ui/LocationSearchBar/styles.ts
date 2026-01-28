import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';
import { getShadowStyle } from '@/utils/shadowHelper';

export const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    position: 'relative',
    zIndex: 1000,
    width: '100%',
  },

  // Dropdown
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: spacing.xs,
    borderRadius: spacing.md,
    maxHeight: 500,
    borderWidth: 1,
    ...getShadowStyle({
      color: colors.shadow,
      offsetY: 4,
      opacity: 0.15,
      radius: 24,
      elevation: 8,
    }),
  },

  // Dropdown estático (sin botón)
  dropdownStatic: {
    width: '100%',
    borderRadius: spacing.md,
    maxHeight: 500,
    borderWidth: 1,
    ...getShadowStyle({
      color: colors.shadow,
      offsetY: 4,
      opacity: 0.15,
      radius: 24,
      elevation: 8,
    }),
  },

  // Contenedor de mensajes (loading, error)
  messageContainer: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  messageText: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
