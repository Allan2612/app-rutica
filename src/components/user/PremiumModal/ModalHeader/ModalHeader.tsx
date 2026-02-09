import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { X, Crown } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface ModalHeaderProps {
  step: 'plans' | 'business' | 'entity' | 'payment';
  onClose: () => void;
}

export const ModalHeader = memo(function ModalHeader({ step, onClose }: ModalHeaderProps) {
  const colors = useThemedColors();

  const getTitle = () => {
    switch (step) {
      case 'plans':
        return 'Planes Premium';
      case 'business':
        return 'Seleccionar Negocio';
      case 'entity':
        return 'Seleccionar Publicación';
      case 'payment':
        return 'Confirmar Pago';
      default:
        return 'Premium';
    }
  };

  return (
    <View
      style={[
        styles.header,
        {
          borderBottomColor: colors.border.light,
          backgroundColor: colors.isDark ? colors.background.primary : colors.background.secondary,
        },
      ]}
    >
      <View style={styles.headerTitleRow}>
        <Crown size={26} color={colors.warning} strokeWidth={2} />
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>{getTitle()}</Text>
      </View>
      <Pressable
        style={[
          styles.closeButton,
          {
            backgroundColor: colors.isDark ? colors.background.tertiary : colors.background.primary,
          },
        ]}
        onPress={onClose}
      >
        <X size={20} color={colors.text.secondary} />
      </Pressable>
    </View>
  );
});
