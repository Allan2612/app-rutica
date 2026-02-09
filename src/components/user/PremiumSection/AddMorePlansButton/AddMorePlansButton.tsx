import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import { Crown } from 'lucide-react-native';
import type { ThemedColors } from '@/types/entities/premium';
import { styles } from './styles';

interface AddMorePlansButtonProps {
  onPress: () => void;
  colors: ThemedColors;
}

export const AddMorePlansButton = memo(function AddMorePlansButton({
  onPress,
  colors,
}: AddMorePlansButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: colors.background.primary,
          borderColor: colors.primary[500],
        },
      ]}
      onPress={onPress}
    >
      <Crown size={16} color={colors.primary[500]} />
      <Text style={[styles.text, { color: colors.primary[500] }]}>Adquirir Más Planes</Text>
    </Pressable>
  );
});
