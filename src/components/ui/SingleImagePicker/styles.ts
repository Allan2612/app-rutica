import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: 320,
    height: 160,
    alignSelf: 'flex-start',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: '100%',
    maxWidth: 320,
    height: 160,
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  addText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  helperText: {
    fontSize: typography.sizes.xs,
    lineHeight: 16,
  },
});
