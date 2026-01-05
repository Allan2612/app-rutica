import { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MapPin, ChevronDown, Locate } from 'lucide-react-native';
import { styles } from './styles';

export interface SearchButtonProps {
  selectedDistrict: string | null;
  selectedCanton: string | null;
  selectedProvince: string | null;
  loadingLocation: boolean;
  onPress: () => void;
  onLocationPress: () => void;
}

export const SearchButton = memo(function SearchButton({
  selectedDistrict,
  selectedCanton,
  selectedProvince,
  loadingLocation,
  onPress,
  onLocationPress,
}: SearchButtonProps) {
  const getButtonText = () => {
    if (selectedDistrict && selectedCanton && selectedProvince) {
      return `${selectedDistrict}, ${selectedCanton}, ${selectedProvince}`;
    }
    if (selectedCanton && selectedProvince) {
      return `${selectedCanton}, ${selectedProvince}`;
    }
    if (selectedProvince) {
      return selectedProvince;
    }
    return 'Seleccionar ubicación';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.searchButton} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <MapPin size={18} color={styles.icon.color} />
        <Text style={styles.searchButtonText} numberOfLines={1}>
          {getButtonText()}
        </Text>
        <ChevronDown size={18} color={styles.icon.color} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.locationButton}
        onPress={onLocationPress}
        disabled={loadingLocation}
        activeOpacity={0.7}
      >
        <Locate 
          size={18} 
          color={loadingLocation ? styles.locationIconDisabled.color : styles.locationIcon.color} 
        />
      </TouchableOpacity>
    </View>
  );
});
