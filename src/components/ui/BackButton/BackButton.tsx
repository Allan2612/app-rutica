import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useThemedColors } from '@/hooks';

interface BackButtonProps {
  /** Ruta personalizada a la que navegar. Si no se proporciona, usa router.back() */
  href?: string;
  /** Color personalizado para el ícono */
  color?: string;
  /** Tamaño del ícono */
  size?: number;
}

/**
 * Botón de retroceso que navega a la ruta anterior
 * 
 * @example
 * // Navegación automática (usa historial del navegador)
 * <BackButton />
 * 
 * @example
 * // Navegación personalizada
 * <BackButton href="/(app)/(tabs)/manage/businesses" />
 */
export const BackButton = memo(function BackButton({
  href,
  color,
  size = 24,
}: BackButtonProps) {
  const colors = useThemedColors();

  const handlePress = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        { 
          backgroundColor: pressed 
            ? colors.primary[500] 
            : colors.background.tertiary,
        },
      ]}
      hitSlop={8}
    >
      {({ pressed }) => (
        <ChevronLeft
          size={size}
          color={color || (pressed ? '#FFFFFF' : colors.text.primary)}
          strokeWidth={2.5}
        />
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
