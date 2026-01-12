import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme';
import { getShadowStyle } from '@/utils/shadowHelper';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.tertiary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  button: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: 12,
    fontWeight: '600',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingAddressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: colors.primary[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    gap: 8,
  },
  loadingAddressText: {
    fontSize: 12,
    color: colors.info,
  },
  coordinatesWeb: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 6,
    zIndex: 1000,
    ...getShadowStyle({
      color: colors.dark.background,
      offsetY: 2,
      opacity: 0.2,
      radius: 4,
      elevation: 3,
    }),
  },
  coordText: {
    fontSize: 12,
    fontWeight: '500',
  },
  hint: {
    padding: 8,
    backgroundColor: colors.primary[50],
    color: colors.info,
    fontSize: 12,
    textAlign: 'center',
  },
});
