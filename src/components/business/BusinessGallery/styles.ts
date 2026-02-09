import { StyleSheet, Platform } from 'react-native';
import { spacing, typography } from '@/styles/theme';

const isWeb = Platform.OS === 'web';

export const styles = StyleSheet.create({
  gallerySection: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.lg,
    textAlign: 'center',
    letterSpacing: -0.3,
    paddingHorizontal: spacing.lg,
  },
});
