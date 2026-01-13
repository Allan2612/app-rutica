import { StyleSheet } from 'react-native';

/**
 * Estilos compartidos para todas las pantallas de autenticación
 * NOTA: Los colores se aplican dinámicamente usando useThemedColors en cada componente
 */
export const sharedStyles = StyleSheet.create({
  // Links y textos
  link: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  linkSmall: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  linkText: {
    fontSize: 14,
    textAlign: 'center',
  },
  
  // Separadores
  separator: {
    height: 1,
    marginVertical: 20,
  },
  
  // Footer
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerTextSmall: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  footerLink: {
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
    fontWeight: '500',
    textAlign: 'center',
  },
});
