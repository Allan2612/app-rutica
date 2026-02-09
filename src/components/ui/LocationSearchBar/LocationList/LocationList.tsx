import { memo } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { LocationListItem } from '../LocationListItem';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface Province {
  id: string;
  name: string;
}

export interface Canton {
  id: string;
  name: string;
  province: string;
}

export interface District {
  id: string;
  name: string;
  canton: string;
}

export interface LocationListProps {
  provinces: Province[];
  selectedProvince: string | null;
  selectedCanton: string | null;
  selectedDistrict: string | null;
  expandedProvince: string | null;
  expandedCanton: string | null;
  onSelectProvince: (name: string) => void;
  onSelectCanton: (name: string) => void;
  onSelectDistrict: (name: string) => void;
  getCantons: (provinceName: string) => Canton[];
  getDistricts: (cantonName: string) => District[];
}

export const LocationList = memo(function LocationList({
  provinces,
  selectedProvince,
  selectedCanton,
  selectedDistrict,
  expandedProvince,
  expandedCanton,
  onSelectProvince,
  onSelectCanton,
  onSelectDistrict,
  getCantons,
  getDistricts,
}: LocationListProps) {
  const colors = useThemedColors();

  if (provinces.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={[styles.emptyStateText, { color: colors.text.tertiary }]}>
          No se encontraron resultados
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} nestedScrollEnabled>
      {provinces.map((province) => {
        const isExpanded = expandedProvince === province.name;
        const cantones = getCantons(province.name);

        return (
          <View key={province.id}>
            {/* Province */}
            <LocationListItem
              name={province.name}
              isSelected={selectedProvince === province.name}
              isExpanded={isExpanded}
              level="province"
              onPress={() => onSelectProvince(province.name)}
            />

            {/* Cantons */}
            {isExpanded &&
              cantones.map((canton) => {
                const isCantonExpanded = expandedCanton === canton.name;
                const distritos = getDistricts(canton.name);

                return (
                  <View key={canton.id}>
                    {/* Canton */}
                    <LocationListItem
                      name={canton.name}
                      isSelected={selectedCanton === canton.name}
                      isExpanded={isCantonExpanded}
                      level="canton"
                      onPress={() => onSelectCanton(canton.name)}
                    />

                    {/* Districts */}
                    {isCantonExpanded &&
                      distritos.map((district) => (
                        <LocationListItem
                          key={district.id}
                          name={district.name}
                          isSelected={selectedDistrict === district.name}
                          isExpanded={false}
                          level="district"
                          onPress={() => onSelectDistrict(district.name)}
                        />
                      ))}
                  </View>
                );
              })}
          </View>
        );
      })}
    </ScrollView>
  );
});
