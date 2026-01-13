import { memo } from 'react';
import { View, Pressable, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
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
  const colors = useThemedColors();
  const showChevron = level !== 'district';
  
  const itemStyle = [
    styles.listItem,
    { borderBottomColor: colors.border.light },
    level === 'canton' && [styles.listItemNested, { backgroundColor: colors.background.secondary }],
    level === 'district' && [styles.listItemNestedDeep, { backgroundColor: colors.background.tertiary }],
    isSelected && { backgroundColor: colors.isDark ? colors.primary[900] : colors.primary[50] },
  ];

  const textStyle = [
    styles.listItemText,
    { color: colors.text.primary },
    level === 'canton' && styles.listItemTextNested,
    level === 'district' && [styles.listItemTextNestedDeep, { color: colors.text.secondary }],
    isSelected && { 
      color: colors.isDark ? colors.primary[400] : colors.primary[700],
      fontWeight: '600' as const
    },
  ];

  return (
    <Pressable style={itemStyle} onPress={onPress}>
      {showChevron ? (
        <View style={styles.listItemContent}>
          <ChevronRight
            color={colors.text.tertiary}
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
