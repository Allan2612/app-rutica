import { memo } from 'react';
import { View, TextInput, Pressable, Text, ActivityIndicator } from 'react-native';
import { MapPin, X, Locate } from 'lucide-react-native';
import { styles } from './styles';

export interface DropdownHeaderProps {
  searchText: string;
  hasSelection: boolean;
  loadingLocation: boolean;
  onSearchChange: (text: string) => void;
  onClearFilters: () => void;
  onGetLocation: () => void;
}

export const DropdownHeader = memo(function DropdownHeader({
  searchText,
  hasSelection,
  loadingLocation,
  onSearchChange,
  onClearFilters,
  onGetLocation,
}: DropdownHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchInputContainer}>
        <MapPin color="#999" size={18} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar provincia..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={onSearchChange}
        />
        {(searchText || hasSelection) && (
          <Pressable onPress={onClearFilters}>
            <X color="#999" size={18} />
          </Pressable>
        )}
      </View>

      {/* Location Button */}
      <Pressable
        style={styles.locationButton}
        onPress={onGetLocation}
        disabled={loadingLocation}
      >
        {loadingLocation ? (
          <ActivityIndicator size="small" color="#10b981" />
        ) : (
          <Locate color="#10b981" size={18} />
        )}
        <Text style={styles.locationButtonText}>Mi ubicación</Text>
      </Pressable>
    </View>
  );
});
