import { useCallback } from 'react';
import { useLocationStore, LocationState } from '@/store';

/**
 * Hook para gestionar la ubicación del usuario con sincronización
 * Combina el store global con lógica adicional
 * 
 * @example
 * ```tsx
 * const { location, updateLocation, saveToDatabase } = useLocation();
 * 
 * // Actualizar ubicación en el store
 * updateLocation({
 *   province: 'San José',
 *   canton: 'San José',
 *   district: 'Carmen'
 * });
 * 
 * // Guardar en base de datos
 * await saveToDatabase();
 * ```
 */
export function useLocation() {
  const { location, setLocation, clearLocation, hasLocation } = useLocationStore();

  /**
   * Actualiza la ubicación en el store global
   */
  const updateLocation = useCallback(
    (newLocation: LocationState) => {
      setLocation(newLocation);
    },
    [setLocation]
  );

  /**
   * Guarda la ubicación actual en la base de datos
   * TODO: Implementar integración con Supabase
   */
  const saveToDatabase = useCallback(async () => {
    if (!location) {
      return { success: false, error: 'No hay ubicación' };
    }

    try {
      // TODO: Implementar llamada a Supabase
      // const { data, error } = await supabase
      //   .from('user_locations')
      //   .upsert({
      //     user_id: userId,
      //     province: location.province,
      //     canton: location.canton,
      //     district: location.district,
      //     latitude: location.coordinates?.latitude,
      //     longitude: location.coordinates?.longitude,
      //     address: location.address,
      //     updated_at: new Date().toISOString(),
      //   });
      
      // if (error) throw error;
      
      return { success: true, data: location };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [location]);

  /**
   * Obtiene la ubicación desde la base de datos
   * TODO: Implementar integración con Supabase
   */
  const loadFromDatabase = useCallback(async () => {
    try {
      // TODO: Implementar llamada a Supabase
      // const { data, error } = await supabase
      //   .from('user_locations')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .single();
      
      // if (error) throw error;
      // if (data) {
      //   setLocation({
      //     province: data.province,
      //     canton: data.canton,
      //     district: data.district,
      //     coordinates: data.latitude && data.longitude ? {
      //       latitude: data.latitude,
      //       longitude: data.longitude,
      //     } : undefined,
      //     address: data.address,
      //   });
      // }
      
      return { success: true, data: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [setLocation]);

  /**
   * Formatea la ubicación como texto
   */
  const getLocationText = useCallback((): string => {
    if (!location) return 'Sin ubicación';
    
    const parts: string[] = [];
    if (location.district) parts.push(location.district);
    if (location.canton) parts.push(location.canton);
    if (location.province) parts.push(location.province);
    
    return parts.length > 0 ? parts.join(', ') : 'Sin ubicación';
  }, [location]);

  return {
    // Estado
    location,
    hasLocation,
    
    // Acciones
    updateLocation,
    clearLocation,
    
    // Base de datos
    saveToDatabase,
    loadFromDatabase,
    
    // Utilidades
    getLocationText,
  };
}
