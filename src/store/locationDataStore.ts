import { create } from 'zustand';
import {
  LocationDataService,
  type Province,
  type Canton,
  type District,
} from '@/features/maps/services/locationDataService';

/**
 * Estado del store de datos de ubicaciones
 */
interface LocationDataState {
  // Datos
  provinces: Province[];
  cantons: Canton[];
  districts: District[];

  // Estados de carga
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;

  // Timestamp de última carga para caché
  lastLoadedAt: number | null;
}

/**
 * Acciones del store
 */
interface LocationDataActions {
  loadLocations: () => Promise<void>;
  refreshLocations: () => Promise<void>;
  clearData: () => void;
  getHasData: () => boolean;
  getIsAvailable: () => boolean;
}

type LocationDataStore = LocationDataState & LocationDataActions;

/**
 * Store global para datos de ubicaciones desde Supabase
 *
 * Carga datos una vez al iniciar y los mantiene en caché
 * Si falla la carga, mantiene el estado de error
 *
 * @example
 * ```tsx
 * import { useLocationDataStore } from '@/store';
 *
 * function MyComponent() {
 *   const { provinces, isLoading, hasError, hasData } = useLocationDataStore();
 *   const { loadLocations, refreshLocations } = useLocationDataStore();
 *
 *   useEffect(() => {
 *     loadLocations(); // Cargar al iniciar
 *   }, []);
 *
 *   if (isLoading) return <Loader />;
 *   if (hasError || !hasData) return <NoLocationView />;
 *
 *   return <LocationPicker provinces={provinces} />;
 * }
 * ```
 */
export const useLocationDataStore = create<LocationDataStore>((set, get) => ({
  // Estado inicial
  provinces: [],
  cantons: [],
  districts: [],
  isLoading: false,
  isLoaded: false,
  hasError: false,
  lastLoadedAt: null,

  // Métodos para computar valores
  getHasData: () => {
    const { provinces, cantons, districts } = get();
    return provinces.length > 0 || cantons.length > 0 || districts.length > 0;
  },

  getIsAvailable: () => {
    const { hasError } = get();
    const hasData = get().getHasData();
    return !hasError && hasData;
  },

  // Acciones
  /**
   * Carga ubicaciones desde Supabase
   * Si ya están cargadas, no vuelve a cargar (usa caché)
   * Sin reintentos automáticos
   */
  loadLocations: async () => {
    const { isLoading, isLoaded } = get();

    if (isLoaded || isLoading) return;

    set({ isLoading: true, hasError: false });

    try {
      const data = await LocationDataService.loadLocations();

      if (!data) {
        set({
          isLoading: false,
          isLoaded: true,
          hasError: true,
          provinces: [],
          cantons: [],
          districts: [],
        });
        return;
      }

      set({
        provinces: data.provinces,
        cantons: data.cantons,
        districts: data.districts,
        isLoading: false,
        isLoaded: true,
        hasError: false,
        lastLoadedAt: Date.now(),
      });
    } catch (error) {
      set({
        isLoading: false,
        isLoaded: true,
        hasError: true,
        provinces: [],
        cantons: [],
        districts: [],
      });
    }
  },

  /**
   * Forzar recarga de ubicaciones
   */
  refreshLocations: async () => {
    set({ isLoaded: false });
    await get().loadLocations();
  },

  /**
   * Limpiar todos los datos
   */
  clearData: () => {
    set({
      provinces: [],
      cantons: [],
      districts: [],
      isLoading: false,
      isLoaded: false,
      hasError: false,
      lastLoadedAt: null,
    });
  },
}));
