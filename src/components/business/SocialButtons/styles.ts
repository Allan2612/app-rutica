import { StyleSheet } from 'react-native';
import { spacing, colors } from '@/styles/theme';

export const styles = StyleSheet.create({
  socialLinksContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  socialLinksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  socialButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
});
