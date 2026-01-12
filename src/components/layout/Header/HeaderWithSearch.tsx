import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { useLocation, LocationSelection } from '@/hooks';
import { LocationSearchBar } from '@/components/ui';
import { BaseHeader } from './BaseHeader';
import { styles } from './styles';

/**
 * @example
 * // En tu _layout.tsx principal:
 * import { HeaderWithSearch } from '@/components/layout/Header/HeaderWithSearch';
 * 
 * <HeaderWithSearch />
 */
export const HeaderWithSearch = memo(function HeaderWithSearch() {
  const { updateLocation } = useLocation();

  const handleLocationChange = useCallback(async (selection: LocationSelection) => {
    updateLocation({
      province: selection.province,
      canton: selection.canton,
      district: selection.district,
      coordinates: selection.coordinates,
      address: selection.address,
      searchText: selection.searchText,
    });
  }, [updateLocation]);

  return (
    <>
      <BaseHeader showBorder={false} />
      <View style={styles.searchRow}>
        <LocationSearchBar 
          onLocationChange={handleLocationChange}
          placeholder="Buscar por ubicación..."
        />
      </View>
    </>
  );
});
