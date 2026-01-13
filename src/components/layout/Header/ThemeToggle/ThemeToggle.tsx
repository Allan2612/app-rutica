import { memo, useRef } from 'react';
import { Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '@/store';
import { useThemedColors } from '@/hooks';

/**
 * Botón para cambiar entre modo claro y oscuro
 * Con animación suave de rotación
 */
export const ThemeToggle = memo(function ThemeToggle() {
  const { mode, effectiveTheme, setMode } = useThemeStore();
  const colors = useThemedColors();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleToggle = () => {
    // Animación de rotación
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });

    // Ciclo: light -> dark -> light
    if (effectiveTheme === 'light') {
      setMode('dark');
    } else {
      setMode('light');
    }
  };

  // Icono según el tema efectivo
  const iconName = effectiveTheme === 'dark' ? 'moon' : 'sunny';

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Pressable
      onPress={handleToggle}
      style={({ pressed }) => [
        {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.background.tertiary,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      accessibilityLabel={`Cambiar a modo ${effectiveTheme === 'light' ? 'oscuro' : 'claro'}`}
      accessibilityRole="button"
    >
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <Ionicons 
          name={iconName} 
          size={22} 
          color={colors.text.primary}
        />
      </Animated.View>
    </Pressable>
  );
});
