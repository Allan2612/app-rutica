import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme';
import sharedStyles from '@/features/user/shared-styles';

export default StyleSheet.create({
  ...sharedStyles,
  title: {
    ...sharedStyles.title,
    color: colors.error,
  },
});
