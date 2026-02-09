import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@app-rutica/theme-mode';

/**
 * Tipos de tema disponibles
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeState {
  /** Modo de tema seleccionado por el usuario */
  mode: ThemeMode;

  /** Tema actual efectivo (resuelve 'auto' al tema del sistema) */
  effectiveTheme: 'light' | 'dark';

  /** Indica si el tema se ha cargado desde storage */
  isLoaded: boolean;

  /** Cambiar el modo de tema */
  setMode: (mode: ThemeMode) => void;

  /** Actualizar el tema efectivo basado en el sistema */
  updateEffectiveTheme: (systemTheme: 'light' | 'dark') => void;

  /** Cargar el tema guardado desde AsyncStorage */
  loadTheme: () => Promise<void>;
}

/**
 * Store para manejar el tema de la aplicación
 * Soporta: light, dark, y auto (sigue el tema del sistema)
 * Persiste la preferencia del usuario en AsyncStorage
 */
export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'light', // Por defecto inicia en light
  effectiveTheme: 'light',
  isLoaded: false,

  setMode: async (mode) => {
    set({ mode });

    // Guardar en AsyncStorage
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      // Error saving theme
    }

    // Si es auto, ya se resolverá con updateEffectiveTheme
    // Si es light o dark, establecerlo directamente
    if (mode !== 'auto') {
      set({ effectiveTheme: mode });
    }
  },

  updateEffectiveTheme: (systemTheme) => {
    const { mode } = get();
    // Solo actualizar si el modo es 'auto'
    if (mode === 'auto') {
      set({ effectiveTheme: systemTheme });
    }
  },

  loadTheme: async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedMode && (savedMode === 'light' || savedMode === 'dark' || savedMode === 'auto')) {
        set({ mode: savedMode, isLoaded: true });
        // Establecer el tema efectivo si no es auto
        if (savedMode !== 'auto') {
          set({ effectiveTheme: savedMode });
        }
      } else {
        set({ isLoaded: true });
      }
    } catch (error) {
      set({ isLoaded: true });
    }
  },
}));
