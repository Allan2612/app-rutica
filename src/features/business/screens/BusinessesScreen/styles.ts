import { StyleSheet, useWindowDimensions } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

const createStyles = (width: number) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    content: {
      flex: 1,
      backgroundColor: colors.background.secondary,
    },
    loader: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    placeholderTitle: {
      fontSize: typography.sizes.sm,
      fontWeight: typography.fontWeights.bold,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.xs + 2,
    },
    placeholderSubtitle: {
      fontSize: typography.sizes.xs,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 18,
    },
  });
};

export const useBusinessesStyles = () => {
  const { width } = useWindowDimensions();
  return createStyles(width);
};
