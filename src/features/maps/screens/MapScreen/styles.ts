import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme';
import { getShadowStyle } from '@/utils/shadowHelper';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.error,
    textAlign: 'center',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  webInfoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 8,
    ...getShadowStyle({
      color: colors.dark.background,
      offsetY: 2,
      opacity: 0.25,
      radius: 3.84,
      elevation: 5,
    }),
  },
  mobileInfoCard: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 8,
    ...getShadowStyle({
      color: colors.dark.background,
      offsetY: 2,
      opacity: 0.25,
      radius: 3.84,
      elevation: 5,
    }),
  },
  infoText: {
    fontSize: 14,
    color: colors.text.primary,
    textAlign: 'center',
  },
});
