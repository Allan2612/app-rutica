import { memo } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { X } from 'lucide-react-native';
import { styles } from './styles';

export interface DropdownHeaderProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  onClose: () => void;
}

export const DropdownHeader = memo(function DropdownHeader({ 
  searchText, 
  onSearchChange, 
  onClose 
}: DropdownHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccionar ubicación</Text>
      
      <TouchableOpacity 
        onPress={onClose} 
        style={styles.closeButton}
        activeOpacity={0.7}
      >
        <X size={24} color={styles.closeIcon.color} />
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar provincia, cantón o distrito..."
        placeholderTextColor={styles.placeholder.color}
        value={searchText}
        onChangeText={onSearchChange}
        autoFocus={false}
      />
    </View>
  );
});
