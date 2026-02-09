import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import type { ThemedColors } from '@/types/entities/premium';
import { styles } from './styles';

interface LoadMoreButtonProps {
  onPress: () => void;
  colors: ThemedColors;
}

export const LoadMoreButton = memo(function LoadMoreButton({
  onPress,
  colors,
}: LoadMoreButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: colors.background.primary,
          borderColor: colors.border.light,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: colors.text.primary }]}>Ver más suscripciones</Text>
      <ChevronDown size={16} color={colors.text.secondary} />
    </Pressable>
  );
});
