import { memo } from 'react';
import { View, Pressable, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { styles } from './styles';

export interface LocationListItemProps {
  name: string;
  isSelected: boolean;
  isExpanded: boolean;
  level: 'province' | 'canton' | 'district';
  onPress: () => void;
}

export const LocationListItem = memo(function LocationListItem({
  name,
  isSelected,
  isExpanded,
  level,
  onPress,
}: LocationListItemProps) {
  const showChevron = level !== 'district';
  
  const itemStyle = [
    styles.listItem,
    level === 'canton' && styles.listItemNested,
    level === 'district' && styles.listItemNestedDeep,
    isSelected && styles.listItemSelected,
  ];

  const textStyle = [
    styles.listItemText,
    level === 'canton' && styles.listItemTextNested,
    level === 'district' && styles.listItemTextNestedDeep,
    isSelected && styles.listItemTextSelected,
  ];

  return (
    <Pressable style={itemStyle} onPress={onPress}>
      {showChevron ? (
        <View style={styles.listItemContent}>
          <ChevronRight
            color="#666"
            size={level === 'province' ? 16 : 14}
            style={{
              transform: [{ rotate: isExpanded ? '90deg' : '0deg' }],
            }}
          />
          <Text style={textStyle}>{name}</Text>
        </View>
      ) : (
        <Text style={textStyle}>{name}</Text>
      )}
    </Pressable>
  );
});
