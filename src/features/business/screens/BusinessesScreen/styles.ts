import { StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '@/styles/theme/colors';

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
      paddingHorizontal: 24,
    },
    placeholderTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: 6,
    },
    placeholderSubtitle: {
      fontSize: 13,
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
