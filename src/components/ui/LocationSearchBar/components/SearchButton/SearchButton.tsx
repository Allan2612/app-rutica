import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import { MapPin, ChevronDown } from 'lucide-react-native';
import { styles } from './styles';

export interface SearchButtonProps {
  text: string;
  placeholder: string;
  isOpen: boolean;
  hasSelection: boolean;
  onPress: () => void;
}

export const SearchButton = memo(function SearchButton({
  text,
  placeholder,
  isOpen,
  hasSelection,
  onPress,
}: SearchButtonProps) {
  const displayText = text || placeholder;
  const isPlaceholder = !hasSelection && !text;

  return (
    <Pressable style={styles.searchButton} onPress={onPress}>
      <MapPin color="#10b981" size={20} />
      <Text
        style={[styles.searchButtonText, isPlaceholder && styles.placeholderText]}
        numberOfLines={1}
      >
        {displayText}
      </Text>
      <ChevronDown
        color="#666"
        size={20}
        style={{
          transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
        }}
      />
    </Pressable>
  );
});
