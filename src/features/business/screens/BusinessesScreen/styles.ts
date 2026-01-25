import { StyleSheet, useWindowDimensions } from 'react-native';
import { colors, spacing } from '@/styles/theme';

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
    searchButton: {
      width: 36,
      height: 36,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export const useBusinessesStyles = () => {
  const { width } = useWindowDimensions();
  return createStyles(width);
};
