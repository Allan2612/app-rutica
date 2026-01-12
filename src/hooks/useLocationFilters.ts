import { useMemo, useCallback } from 'react';
import { useLocationDataStore } from '@/store/locationDataStore';

/**
 * Hook para manejar el filtrado y búsqueda de ubicaciones
 * Filtra provincias, cantones y distritos basándose en el texto de búsqueda
 * Usa datos desde el store global (Supabase)
 */
export function useLocationFilters(searchText: string) {
  // Obtener datos del store global
  const provinces = useLocationDataStore((state) => state.provinces);
  const cantons = useLocationDataStore((state) => state.cantons);
  const districts = useLocationDataStore((state) => state.districts);
  const isLoading = useLocationDataStore((state) => state.isLoading);
  const hasError = useLocationDataStore((state) => state.hasError);
  
  const hasData = provinces.length > 0 || cantons.length > 0 || districts.length > 0;

  // Filtrar provincias por búsqueda
  const filteredProvinces = useMemo(() => {
    if (!hasData) return [];
    if (!searchText.trim()) return provinces;
    
    const search = searchText.toLowerCase();
    
    const matchingProvinces = provinces.filter((p) => 
      p.name.toLowerCase().includes(search)
    );

    const matchingCantons = cantons.filter((c) => 
      c.name.toLowerCase().includes(search)
    );
    const provincesFromCantons = matchingCantons.map((c) => c.province);

    const matchingDistricts = districts.filter((d) => 
      d.name.toLowerCase().includes(search)
    );
    const cantonsFromDistricts = matchingDistricts.map((d) => d.canton);
    const provincesFromDistricts = cantons
      .filter((c) => cantonsFromDistricts.includes(c.name))
      .map((c) => c.province);

    const allProvinceNames = [
      ...matchingProvinces.map((p) => p.name),
      ...provincesFromCantons,
      ...provincesFromDistricts,
    ];
    const uniqueProvinceNames = [...new Set(allProvinceNames)];

    return provinces.filter((p) => uniqueProvinceNames.includes(p.name));
  }, [searchText, provinces, cantons, districts, hasData]);

  // Obtener cantones filtrados
  const getCantons = useCallback((provinceName: string) => {
    if (!hasData) return [];
    const provinceCant = cantons.filter((c) => c.province === provinceName);
    
    if (!searchText.trim()) return provinceCant;
    
    const search = searchText.toLowerCase();
    
    const matchingCantons = provinceCant.filter((c) => 
      c.name.toLowerCase().includes(search)
    );

    const matchingDistricts = districts.filter((d) => 
      d.name.toLowerCase().includes(search)
    );
    const cantonsFromDistricts = matchingDistricts.map((d) => d.canton);
    const matchingCantonsFromDistricts = provinceCant.filter((c) => 
      cantonsFromDistricts.includes(c.name)
    );

    const allCantonIds = [
      ...matchingCantons.map((c) => c.id),
      ...matchingCantonsFromDistricts.map((c) => c.id),
    ];
    const uniqueCantonIds = [...new Set(allCantonIds)];

    return provinceCant.filter((c) => uniqueCantonIds.includes(c.id));
  }, [searchText, cantons, districts, hasData]);

  // Obtener distritos filtrados
  const getDistricts = useCallback((cantonName: string) => {
    if (!hasData) return [];
    const cantonDist = districts.filter((d) => d.canton === cantonName);
    
    if (!searchText.trim()) return cantonDist;
    
    const search = searchText.toLowerCase();
    return cantonDist.filter((d) => d.name.toLowerCase().includes(search));
  }, [searchText, districts, hasData]);

  return {
    filteredProvinces,
    getCantons,
    getDistricts,
    isLoading,
    hasError,
    hasData,
  };
}
