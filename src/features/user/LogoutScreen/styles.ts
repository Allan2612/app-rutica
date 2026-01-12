import { StyleSheet } from 'react-native';
import sharedStyles from '@/features/user/shared-styles';

export default StyleSheet.create({
  ...sharedStyles,
  title: {
    ...sharedStyles.title,
    color: '#ef4444',
  },
});
