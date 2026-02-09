import { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MapPin, ChevronDown, Locate } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
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
  const colors = useThemedColors();

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
        style={[
          styles.searchButton,
          {
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.medium,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <MapPin size={18} color={colors.text.secondary} />
        <Text style={[styles.searchButtonText, { color: colors.text.primary }]} numberOfLines={1}>
          {getButtonText()}
        </Text>
        <ChevronDown size={18} color={colors.text.secondary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.locationButton,
          {
            backgroundColor: loadingLocation ? colors.background.tertiary : colors.primary[500],
            borderColor: loadingLocation ? colors.border.medium : colors.primary[500],
          },
        ]}
        onPress={onLocationPress}
        disabled={loadingLocation}
        activeOpacity={0.7}
      >
        <Locate size={18} color={loadingLocation ? colors.text.tertiary : colors.text.inverse} />
      </TouchableOpacity>
    </View>
  );
});
