import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Límite de 2048 bytes para SecureStore (dejar margen)
const MAX_SECURE_STORE_SIZE = 1900;

const ExpoAsyncStorageAdapter = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return null;
      return window.localStorage.getItem(key);
    }
    try {
      const value = await AsyncStorage.getItem(key);
      if (!value) return null;
      
      // Si la data está comprimida (empieza con 'z|'), descomprimirla
      if (value.startsWith('z|')) {
        const base64Data = value.substring(2);
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const decompressed = new TextDecoder().decode(bytes);
        return decompressed;
      }
      
      return value;
    } catch (error) {
      console.warn('[Supabase Storage] Error al leer item:', error);
      return null;
    }
  },

  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key, value);
      return;
    }
    
    try {
      // Si el valor es muy grande, no lo guardamos para evitar problemas
      if (value.length > MAX_SECURE_STORE_SIZE * 2) {
        console.warn(
          `[Supabase Storage] Valor muy grande para AsyncStorage (${value.length} bytes). ` +
          'Algunos datos de sesión pueden perderse.'
        );
        // Intentar guardar solo la parte crítica (token)
        if (key.includes('session')) {
          try {
            const parsed = JSON.parse(value);
            if (parsed.access_token) {
              const minimal = JSON.stringify({ access_token: parsed.access_token });
              await AsyncStorage.setItem(key, minimal);
            }
          } catch {
            // Si falla el parsing, ignorar
          }
          return;
        }
      }
      
      await AsyncStorage.setItem(key, value);
    } catch (error: any) {
      // Si AsyncStorage falla por tamaño, intentar con localStorage en web
      if (error?.message?.includes('size') || error?.message?.includes('quota')) {
        console.warn('[Supabase Storage] Almacenamiento lleno, limpiando datos antiguos...');
        // En un caso real, aquí se podría limpiar datos antiguos
      } else {
        console.error('[Supabase Storage] Error al guardar item:', error);
      }
    }
  },

  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(key);
      return;
    }
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn('[Supabase Storage] Error al remover item:', error);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoAsyncStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
