import { memo, useState, useCallback } from 'react';
import { View } from 'react-native';
import { SearchButton } from './SearchButton';
import { DropdownHeader } from './DropdownHeader';
import { LocationList } from './LocationList';
import { useLocationDetection, useLocationFilters, type LocationSelection } from '@/hooks';
import { styles } from './styles';

export interface LocationSearchBarProps {
  onLocationChange?: (selection: LocationSelection) => void;
  placeholder?: string;
  autoDetectLocation?: boolean;
}

export const LocationSearchBar = memo(function LocationSearchBar({
  onLocationChange,
  placeholder = 'Buscar ubicación o provincia...',
  autoDetectLocation = true,
}: LocationSearchBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [expandedProvince, setExpandedProvince] = useState<string | null>(null);
  const [expandedCanton, setExpandedCanton] = useState<string | null>(null);

  // Hook para detección GPS
  const {
    loadingLocation,
    selectedProvince,
    selectedCanton,
    selectedDistrict,
    getCurrentLocation,
    setSelectedProvince,
    setSelectedCanton,
    setSelectedDistrict,
  } = useLocationDetection(autoDetectLocation, onLocationChange);

  // Hook para filtrado de ubicaciones
  const { filteredProvinces, getCantons, getDistricts } = useLocationFilters(searchText);

  // Manejar clic en botón de ubicación
  const handleGetCurrentLocation = useCallback(async () => {
    const result = await getCurrentLocation();
    if (result) {
      setIsDropdownOpen(false);
      setExpandedProvince(null);
      setExpandedCanton(null);
    }
  }, [getCurrentLocation]);

  // Manejar selección de provincia
  const handleSelectProvince = useCallback((name: string) => {
    if (expandedProvince === name) {
      setExpandedProvince(null);
    } else {
      setSelectedProvince(name);
      setSelectedCanton(null);
      setSelectedDistrict(null);
      setExpandedProvince(name);
      setExpandedCanton(null);
    }
  }, [expandedProvince, setSelectedProvince, setSelectedCanton, setSelectedDistrict]);

  // Manejar selección de cantón
  const handleSelectCanton = useCallback((name: string) => {
    if (expandedCanton === name) {
      setExpandedCanton(null);
    } else {
      setSelectedCanton(name);
      setSelectedDistrict(null);
      setExpandedCanton(name);
    }
  }, [expandedCanton, setSelectedCanton, setSelectedDistrict]);

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
      
      setSearchText('');
      onLocationChange?.(newSelection);
      setIsDropdownOpen(false);
      setExpandedProvince(null);
      setExpandedCanton(null);
    },
    [selectedProvince, selectedCanton, onLocationChange, setSelectedDistrict]
  );

  // Manejar cierre del dropdown
  const handleClose = useCallback(() => {
    setIsDropdownOpen(false);
    setSearchText('');
  }, []);

  return (
    <View style={styles.container}>
      {/* Botón de búsqueda */}
      <SearchButton
        selectedDistrict={selectedDistrict}
        selectedCanton={selectedCanton}
        selectedProvince={selectedProvince}
        loadingLocation={loadingLocation}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        onLocationPress={handleGetCurrentLocation}
      />

      {/* Dropdown de selección */}
      {isDropdownOpen && (
        <View style={styles.dropdown}>
          <DropdownHeader
            searchText={searchText}
            onSearchChange={setSearchText}
            onClose={handleClose}
          />

          {/* Lista de ubicaciones con jerarquía */}
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
