import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';
import { spacing } from '../../../styles/theme';

export const styles = StyleSheet.create({
  searchRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
});
