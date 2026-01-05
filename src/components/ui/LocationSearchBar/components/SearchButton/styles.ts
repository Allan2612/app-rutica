import { StyleSheet } from 'react-native';
import { colors } from '../../../../../styles/theme/colors';
import { spacing } from '../../../../../styles/theme/spacing';
import { getShadowStyle } from '../../../../../utils/shadowHelper';

export const styles = StyleSheet.create({
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    gap: spacing.sm,
    ...getShadowStyle({
      color: '#000',
      offsetY: 2,
      opacity: 0.05,
      radius: 4,
      elevation: 2,
    }),
  },

  searchButtonText: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '500',
  },

  placeholderText: {
    color: colors.text.tertiary,
    fontWeight: '400',
  },
});
