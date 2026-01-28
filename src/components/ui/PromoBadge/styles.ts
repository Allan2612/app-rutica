import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';
import { colors } from '@/styles/theme/colors';
import { BADGE_FONT_SIZES, PROMO_UI } from '@/styles/theme';

export const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.promo.badge,
    borderRadius: PROMO_UI.borderRadius.medium,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: PROMO_UI.borderRadius.small,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  large: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: PROMO_UI.borderRadius.medium,
  },
  text: {
    color: colors.promo.badgeText,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 0.3,
  },
  text_small: {
    fontSize: BADGE_FONT_SIZES.small,
  },
  text_medium: {
    fontSize: BADGE_FONT_SIZES.medium,
  },
  text_large: {
    fontSize: BADGE_FONT_SIZES.large,
  },
});
