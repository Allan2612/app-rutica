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
 * Selectores derivados.
 *
 * No se usan getters dentro del store: Zustand mezcla el estado con Object.assign, que
 * evalúa los getters con el estado ANTERIOR y los deja congelados como valores fijos.
 * Usar: useLocationStore(selectHasLocation)
 */
type LocationStoreState = { location: LocationState | null };

export const selectHasLocation = (s: LocationStoreState) =>
  Boolean(s.location?.province || s.location?.canton || s.location?.district || s.location?.coordinates);

export const selectHasCoordinates = (s: LocationStoreState) =>
  Boolean(s.location?.coordinates?.latitude && s.location?.coordinates?.longitude);

export const selectHasAdministrativeLocation = (s: LocationStoreState) =>
  Boolean(s.location?.province || s.location?.canton || s.location?.district);

type LocationStore = {
  location: LocationState | null;
} & LocationActions;

/**
 * Store global de ubicación usando Zustand
 *
 * @example
 * ```tsx
 * import { useLocationStore } from '@/store';
 *
 * function MyComponent() {
 *   const location = useLocationStore((s) => s.location);
 *   const hasLocation = useLocationStore(selectHasLocation);
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
 *     // Usar location?.province
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
