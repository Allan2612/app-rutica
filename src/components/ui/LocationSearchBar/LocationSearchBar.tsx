import { memo, useState, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import * as Location from 'expo-location';
import { SearchButton } from './components/SearchButton';
import { DropdownHeader } from './components/DropdownHeader';
import { LocationList } from './components/LocationList';
import { provinces, cantons, districts } from '@/data/costaRica';
import { styles } from './styles';

export interface LocationSelection {
  province: string | null;
  canton: string | null;
  district: string | null;
  searchText: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface LocationSearchBarProps {
  onLocationChange?: (selection: LocationSelection) => void;
  placeholder?: string;
}

export const LocationSearchBar = memo(function LocationSearchBar({
  onLocationChange,
  placeholder = 'Buscar ubicación o provincia...',
}: LocationSearchBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCanton, setSelectedCanton] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [expandedProvince, setExpandedProvince] = useState<string | null>(null);
  const [expandedCanton, setExpandedCanton] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Filtrar provincias por búsqueda
  const filteredProvinces = useMemo(() => {
    if (!searchText.trim()) return provinces;
    const search = searchText.toLowerCase();
    return provinces.filter((p) => p.name.toLowerCase().includes(search));
  }, [searchText]);

  // Obtener cantones de una provincia
  const getCantons = useCallback((provinceName: string) => {
    return cantons.filter((c) => c.province === provinceName);
  }, []);

  // Obtener distritos de un cantón
  const getDistricts = useCallback((cantonName: string) => {
    return districts.filter((d) => d.canton === cantonName);
  }, []);

  // Texto del botón principal
  const buttonText = useMemo(() => {
    if (searchText) return searchText;
    if (selectedDistrict && selectedCanton && selectedProvince) {
      return `${selectedDistrict}, ${selectedCanton}`;
    }
    return placeholder;
  }, [searchText, selectedDistrict, selectedCanton, selectedProvince, placeholder]);

  // Manejar obtención de ubicación GPS
  const handleGetCurrentLocation = useCallback(async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Se necesita permiso de ubicación');
        setLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newSelection: LocationSelection = {
        province: null,
        canton: null,
        district: null,
        searchText: 'Mi ubicación actual',
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      };

      setSearchText('Mi ubicación actual');
      setSelectedProvince(null);
      setSelectedCanton(null);
      setSelectedDistrict(null);
      onLocationChange?.(newSelection);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('[LOCATION]', error);
      alert('No se pudo obtener tu ubicación');
    } finally {
      setLoadingLocation(false);
    }
  }, [onLocationChange]);

  // Manejar limpiar filtros
  const handleClearFilters = useCallback(() => {
    setSearchText('');
    setSelectedProvince(null);
    setSelectedCanton(null);
    setSelectedDistrict(null);
    setExpandedProvince(null);
    setExpandedCanton(null);
    onLocationChange?.({
      province: null,
      canton: null,
      district: null,
      searchText: '',
    });
  }, [onLocationChange]);

  // Manejar selección de provincia
  const handleSelectProvince = useCallback((name: string) => {
    setSelectedProvince(name);
    setSelectedCanton(null);
    setSelectedDistrict(null);
    setExpandedProvince((prev) => (prev === name ? null : name));
  }, []);

  // Manejar selección de cantón
  const handleSelectCanton = useCallback((name: string) => {
    setSelectedCanton(name);
    setSelectedDistrict(null);
    setExpandedCanton((prev) => (prev === name ? null : name));
  }, []);

  // Manejar selección de distrito (completa la selección)
  const handleSelectDistrict = useCallback(
    (districtName: string) => {
      setSelectedDistrict(districtName);
      
      const newSelection: LocationSelection = {
        province: selectedProvince,
        canton: selectedCanton,
        district: districtName,
        searchText: `${districtName}, ${selectedCanton}, ${selectedProvince}`,
      };
      
      setSearchText(newSelection.searchText);
      onLocationChange?.(newSelection);
      setIsDropdownOpen(false);
      setExpandedProvince(null);
      setExpandedCanton(null);
    },
    [selectedProvince, selectedCanton, onLocationChange]
  );

  const hasSelection = Boolean(selectedProvince);

  return (
    <View style={styles.container}>
      {/* Search Button */}
      <SearchButton
        text={buttonText}
        placeholder={placeholder}
        isOpen={isDropdownOpen}
        hasSelection={hasSelection}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      />

      {/* Dropdown */}
      {isDropdownOpen && (
        <View style={styles.dropdown}>
          <DropdownHeader
            searchText={searchText}
            hasSelection={hasSelection}
            loadingLocation={loadingLocation}
            onSearchChange={setSearchText}
            onClearFilters={handleClearFilters}
            onGetLocation={handleGetCurrentLocation}
          />

          <LocationList
            provinces={filteredProvinces}
            selectedProvince={selectedProvince}
            selectedCanton={selectedCanton}
            selectedDistrict={selectedDistrict}
            expandedProvince={expandedProvince}
            expandedCanton={expandedCanton}
            onSelectProvince={handleSelectProvince}
            onSelectCanton={handleSelectCanton}
            onSelectDistrict={handleSelectDistrict}
            getCantons={getCantons}
            getDistricts={getDistricts}
          />
        </View>
      )}
    </View>
  );
});
