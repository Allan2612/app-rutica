import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { getShadowStyle } from '@/utils/shadowHelper';

export const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    position: 'relative',
    zIndex: 1000,
  },

  // Dropdown
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: spacing.xs,
    backgroundColor: colors.background.primary,
    borderRadius: spacing.md,
    maxHeight: 500,
    borderWidth: 1,
    borderColor: colors.border.medium,
    ...getShadowStyle({
      color: '#000',
      offsetY: 4,
      opacity: 0.15,
      radius: 24,
      elevation: 8,
    }),
  },
});
