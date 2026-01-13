import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useThemeStore } from '@/store';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 * Carga automáticamente el tema guardado en AsyncStorage
 */
export function useColorScheme(): 'light' | 'dark' {
  const [hasHydrated, setHasHydrated] = useState(false);
  const systemColorScheme = useRNColorScheme();
  const { mode, effectiveTheme, updateEffectiveTheme, loadTheme, isLoaded } = useThemeStore();

  // Cargar el tema guardado al iniciar
  useEffect(() => {
    if (!isLoaded) {
      loadTheme().then(() => setHasHydrated(true));
    } else {
      setHasHydrated(true);
    }
  }, [isLoaded, loadTheme]);

  // Actualizar el tema efectivo cuando cambia el tema del sistema
  useEffect(() => {
    if (hasHydrated && systemColorScheme && isLoaded) {
      updateEffectiveTheme(systemColorScheme);
    }
  }, [hasHydrated, systemColorScheme, updateEffectiveTheme, isLoaded]);

  if (hasHydrated) {
    return effectiveTheme;
  }

  return 'light';
}
