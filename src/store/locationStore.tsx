import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface LocationState {
  province: string | null;
  canton: string | null;
  district: string | null;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  searchText?: string;
}

interface LocationContextValue {
  location: LocationState | null;
  setLocation: (location: LocationState | null) => void;
  clearLocation: () => void;
  hasLocation: boolean;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

/**
 * Provider para gestionar el estado global de la ubicación del usuario
 * 
 * @example
 * ```tsx
 * <LocationProvider>
 *   <App />
 * </LocationProvider>
 * ```
 */
export function LocationProvider({ children }: LocationProviderProps) {
  const [location, setLocationState] = useState<LocationState | null>(null);

  const setLocation = useCallback((newLocation: LocationState | null) => {
    setLocationState(newLocation);
    console.log('[LOCATION_STORE] Ubicación actualizada:', newLocation);
  }, []);

  const clearLocation = useCallback(() => {
    setLocationState(null);
    console.log('[LOCATION_STORE] Ubicación limpiada');
  }, []);

  const hasLocation = Boolean(
    location?.province || location?.canton || location?.district || location?.coordinates
  );

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        clearLocation,
        hasLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

/**
 * Hook para acceder al estado global de ubicación
 * 
 * @throws Error si se usa fuera del LocationProvider
 * 
 * @example
 * ```tsx
 * const { location, setLocation, clearLocation, hasLocation } = useLocationStore();
 * 
 * // Establecer ubicación
 * setLocation({
 *   province: 'San José',
 *   canton: 'Pérez Zeledón',
 *   district: 'Pejibaye',
 *   coordinates: { latitude: 9.5, longitude: -83.7 }
 * });
 * 
 * // Acceder a la ubicación actual
 * console.log(location?.province); // 'San José'
 * 
 * // Verificar si hay ubicación
 * if (hasLocation) {
 *   // Hacer algo con la ubicación
 * }
 * 
 * // Limpiar ubicación
 * clearLocation();
 * ```
 */
export function useLocationStore(): LocationContextValue {
  const context = useContext(LocationContext);
  
  if (context === undefined) {
    throw new Error('useLocationStore debe usarse dentro de un LocationProvider');
  }
  
  return context;
}
