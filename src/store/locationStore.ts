import { create } from 'zustand';

/**
 * Estado de ubicación del usuario
 */
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

/**
 * Acciones del store de ubicación
 */
interface LocationActions {
  setLocation: (location: LocationState | null) => void;
  clearLocation: () => void;
  updatePartialLocation: (partial: Partial<LocationState>) => void;
}

/**
 * Selectores computados
 */
interface LocationSelectors {
  hasLocation: boolean;
  hasCoordinates: boolean;
  hasAdministrativeLocation: boolean;
}

type LocationStore = {
  location: LocationState | null;
} & LocationActions &
  LocationSelectors;

/**
 * Store global de ubicación usando Zustand
 * 
 * @example
 * ```tsx
 * import { useLocationStore } from '@/store';
 * 
 * function MyComponent() {
 *   const { location, hasLocation } = useLocationStore();
 *   const { setLocation, clearLocation } = useLocationStore();
 *   
 *   // Establecer ubicación completa
 *   setLocation({
 *     province: 'San José',
 *     canton: 'Pérez Zeledón',
 *     district: 'Pejibaye',
 *     coordinates: { latitude: 9.5, longitude: -83.7 }
 *   });
 *   
 *   // Actualizar parcialmente
 *   updatePartialLocation({ province: 'Cartago' });
 *   
 *   // Verificar si hay ubicación
 *   if (hasLocation) {
 *     console.log(location?.province);
 *   }
 *   
 *   // Limpiar ubicación
 *   clearLocation();
 * }
 * ```
 */
export const useLocationStore = create<LocationStore>((set, get) => ({
  // Estado inicial
  location: null,

  // Selectores computados (se recalculan automáticamente)
  get hasLocation() {
    const { location } = get();
    return Boolean(
      location?.province ||
        location?.canton ||
        location?.district ||
        location?.coordinates
    );
  },

  get hasCoordinates() {
    const { location } = get();
    return Boolean(
      location?.coordinates?.latitude && location?.coordinates?.longitude
    );
  },

  get hasAdministrativeLocation() {
    const { location } = get();
    return Boolean(location?.province || location?.canton || location?.district);
  },

  // Acciones
  /**
   * Establece una nueva ubicación completa
   */
  setLocation: (newLocation) => {
    set({ location: newLocation });
  },

  /**
   * Limpia toda la ubicación
   */
  clearLocation: () => {
    set({ location: null });
  },

  /**
   * Actualiza parcialmente la ubicación sin borrar otros campos
   */
  updatePartialLocation: (partial) => {
    const { location } = get();
    const updated = { ...location, ...partial } as LocationState;
    set({ location: updated });
  },
}));
