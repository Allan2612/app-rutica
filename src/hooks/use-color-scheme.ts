import { useColorScheme as useRNColorScheme } from 'react-native';
import { useEffect } from 'react';
import { useThemeStore } from '@/store';

/**
 * Hook que devuelve el tema actual considerando:
 * 1. La preferencia del usuario (store)
 * 2. El tema del sistema (si está en modo 'auto')
 *
 * Carga automáticamente el tema guardado en AsyncStorage
 */
export function useColorScheme(): 'light' | 'dark' {
  const systemColorScheme = useRNColorScheme();
  const { mode, effectiveTheme, updateEffectiveTheme, loadTheme, isLoaded } = useThemeStore();

  // Cargar el tema guardado al iniciar la app
  useEffect(() => {
    if (!isLoaded) {
      loadTheme();
    }
  }, [isLoaded, loadTheme]);

  // Actualizar el tema efectivo cuando cambia el tema del sistema
  useEffect(() => {
    if (systemColorScheme && isLoaded) {
      updateEffectiveTheme(systemColorScheme);
    }
  }, [systemColorScheme, updateEffectiveTheme, isLoaded]);

  // Retornar el tema efectivo del store
  return effectiveTheme;
}
