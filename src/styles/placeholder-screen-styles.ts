import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme/colors';

/**
 * Estilos compartidos para pantallas placeholder (en desarrollo)
 * Usado por: Home, Business, Events, Attractions, Promotions
 */
export const placeholderScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
});
