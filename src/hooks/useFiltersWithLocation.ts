import { useMemo } from 'react';
import { useLocationStore } from '@/store';

/**
 * Hook para combinar filtros locales con la ubicación del store global
 * Útil para screens que usan SearchFilterModal
 */
export function useFiltersWithLocation<T extends { searchText?: string; categoryIds?: string[] }>(
  localFilters: T,
) {
  const { location } = useLocationStore();

  return useMemo(
    () => ({
      ...localFilters,
      province: location?.province || undefined,
      canton: location?.canton || undefined,
      district: location?.district || undefined,
    }),
    [localFilters, location?.province, location?.canton, location?.district],
  );
}
