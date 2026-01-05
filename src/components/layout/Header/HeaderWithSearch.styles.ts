import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';
import { spacing } from '../../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  
  // Fila superior (logo + user)
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  
  logoImage: {
    width: 28,
    height: 28,
  },
  
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary[600],
    letterSpacing: -0.5,
  },
  
  userButton: {
    padding: 4,
  },
  
  userIconAuthenticated: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  userIconGuest: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Fila inferior (buscador)
  searchRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: 12,
  },
});
