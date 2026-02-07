import type { LocationState } from '@/store';

/**
 * ============================================
 * SEARCH FILTERS
 * ============================================
 */

/**
 * Tabs disponibles en el modal de filtros
 */
export type FilterTab = 'text' | 'categories' | 'location';

/**
 * Filtros de búsqueda aplicados
 * NOTA: location aquí es un filtro EXPLÍCITO seleccionado por el usuario,
 * NO la ubicación del store global
 */
export interface SearchFilters {
  searchText: string;
  categoryIds: string[];
  location?: {
    province?: string | null;
    canton?: string | null;
    district?: string | null;
  } | null;
}
