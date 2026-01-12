import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme/colors';

/**
 * Estilos compartidos para todas las pantallas de autenticación
 */
export const sharedStyles = StyleSheet.create({
  // Links y textos
  link: {
    color: colors.primary[500],
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  linkSmall: {
    fontSize: 12,
    color: colors.primary[500],
    textDecorationLine: 'underline',
  },
  linkText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  
  // Separadores
  separator: {
    height: 1,
    backgroundColor: colors.border.medium,
    marginVertical: 20,
  },
  
  // Footer
  footerText: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerTextSmall: {
    fontSize: 11,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
  footerLink: {
    color: colors.primary[500],
    textDecorationLine: 'underline',
  },
  
  // Contenedores
  section: {
    marginTop: 20,
    alignItems: 'center',
  },
  
  // Botones
  buttonSpacing: {
    marginTop: 16,
  },
  
  // Links de navegación
  backLink: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 10,
  },
  backLinkText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
    textAlign: 'center',
  },
});
