import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md + 4,
  },
  container: {
    borderRadius: spacing.md,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
  },
  header: {
    marginBottom: spacing.md + 4,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  photoContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  form: {
    gap: spacing.md,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm + 4,
    marginTop: spacing.lg,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md + 4,
    borderRadius: spacing.sm,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.inverse,
  },
  buttonTextSecondary: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
});

export default styles;
