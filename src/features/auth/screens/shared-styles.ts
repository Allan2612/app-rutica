import { StyleSheet } from 'react-native';

/**
 * Estilos compartidos para todas las pantallas de autenticación
 */
export const sharedStyles = StyleSheet.create({
  // Links y textos
  link: {
    color: '#10b981',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  linkSmall: {
    fontSize: 12,
    color: '#10b981',
    textDecorationLine: 'underline',
  },
  linkText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  
  // Separadores
  separator: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: 20,
  },
  
  // Footer
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerTextSmall: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
  footerLink: {
    color: '#10b981',
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
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
});
