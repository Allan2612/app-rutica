/**
 * Configuración de Reanimated y supresión de warnings conocidos
 *
 * Los warnings que se suprimen son:
 * 1. "Reading from value during component render" - Falsos positivos cuando se usa
 *    correctamente dentro de useAnimatedProps/useAnimatedStyle
 * 2. Los warnings de gesture-handler que vienen de react-native-reanimated-carousel
 * 3. "Accessing element.ref was removed in React 19" - Error de compatibilidad con librerías
 *    que aún no han actualizado para React 19
 * 4. "Blocked aria-hidden" - Warning de accesibilidad de React Native Web cuando hay
 *    modales con elementos focusables
 * 5. "shadow* style props are deprecated" - React Native Web deprecó las props individuales
 *    de shadow en favor de boxShadow (viene de librerías y código legacy)
 * 6. "props.pointerEvents is deprecated" - Debe usarse style.pointerEvents (viene de librerías)
 * 7. "textShadow* style props are deprecated" - Similar a shadow, usar textShadow
 */
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { LogBox, Platform } from 'react-native';

export function setupReanimatedConfig() {
  // Configurar el logger de Reanimated para modo de desarrollo
  // Esto desactiva el modo estricto que genera warnings innecesarios
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Desactivar modo estricto para evitar falsos positivos
  });

  // Suprimir warnings conocidos de React Native que vienen de librerías externas
  // Estos son problemas de compatibilidad con React 19 que están pendientes de arreglar
  // en las librerías react-native-reanimated y react-native-gesture-handler
  if (Platform.OS !== 'web') {
    LogBox.ignoreLogs([
      // Warning de React 19 que viene de react-native-reanimated internamente
      'Accessing element.ref was removed in React 19',
      // Warnings de gesture handler que vienen del carousel
      '[react-native-gesture-handler] None of the callbacks in the gesture are worklets',
    ]);
  }

  // Suprimir warnings de consola para web
  if (Platform.OS === 'web' && typeof console !== 'undefined') {
    const originalError = console.error;
    const originalWarn = console.warn;

    const suppressedPatterns = [
      // React 19 / Reanimated / Gesture Handler
      'Accessing element.ref was removed in React 19',
      '[react-native-gesture-handler] None of the callbacks in the gesture are worklets',
      'Reading from `value` during component render',
      // Accesibilidad de modales
      'Blocked aria-hidden on an element because its descendant retained focus',
      // React Native Web - Estilos deprecados (vienen de librerías y código que aún usa el API antiguo)
      '"shadow*" style props are deprecated',
      '"textShadow*" style props are deprecated',
      'props.pointerEvents is deprecated',
    ];

    console.error = (...args: unknown[]) => {
      const message = args[0];
      if (
        typeof message === 'string' &&
        suppressedPatterns.some((pattern) => message.includes(pattern))
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    console.warn = (...args: unknown[]) => {
      const message = args[0];
      if (
        typeof message === 'string' &&
        suppressedPatterns.some((pattern) => message.includes(pattern))
      ) {
        return;
      }
      originalWarn.apply(console, args);
    };
  }
}
