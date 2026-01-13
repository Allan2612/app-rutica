import { memo } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
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
  const colors = useThemedColors();
  
  return (
    <View style={[styles.container, { borderBottomColor: colors.border.medium }]}>
      <Text style={[styles.title, { color: colors.text.primary }]}>Seleccionar ubicación</Text>
      
      <TouchableOpacity 
        onPress={onClose} 
        style={styles.closeButton}
        activeOpacity={0.7}
      >
        <X size={24} color={colors.text.primary} />
      </TouchableOpacity>

      <TextInput
        style={[styles.searchInput, { 
          backgroundColor: colors.background.tertiary,
          color: colors.text.primary,
        }]}
        placeholder="Buscar provincia, cantón o distrito..."
        placeholderTextColor={colors.text.tertiary}
        value={searchText}
        onChangeText={onSearchChange}
        autoFocus={false}
      />
    </View>
  );
});
