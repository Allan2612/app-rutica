import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme/colors';

export const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.border.medium,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
  },
  roleButtonActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  roleIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  roleTextActive: {
    color: colors.primary[700],
  },
  roleSubtitle: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
