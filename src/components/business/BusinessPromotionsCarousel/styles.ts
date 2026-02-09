import { StyleSheet, Platform } from 'react-native';
import { spacing, typography } from '@/styles/theme';

const isWeb = Platform.OS === 'web';

export const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    width: '100%',
  },
  headerRow: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  countText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
});
