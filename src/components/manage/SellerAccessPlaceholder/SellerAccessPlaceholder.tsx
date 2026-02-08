import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Store } from 'lucide-react-native';
import { router } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { shadows } from '@/styles/theme';
import styles from './styles';

interface SellerAccessPlaceholderProps {
  title: string;
  description: string;
}

export const SellerAccessPlaceholder = memo(function SellerAccessPlaceholder({
  title,
  description,
}: SellerAccessPlaceholderProps) {
  const colors = useThemedColors();

  const handleNavigateToProfile = () => {
    router.push('/(app)/profile');
  };

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.background.primary,
        borderColor: colors.isDark ? colors.border.light : colors.border.medium,
      },
      colors.isDark ? shadows.lg : shadows.xl,
    ]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.background.tertiary }]}>
        <Store size={32} color={colors.primary[500]} strokeWidth={2} />
      </View>

      <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.text.secondary }]}>
        Funcionalidad exclusiva para vendedores
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: colors.primary[500],
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={handleNavigateToProfile}
      >
        <Store size={16} color="#fff" strokeWidth={2.5} />
        <Text style={styles.buttonText}>Convertirse en Vendedor</Text>
      </Pressable>
    </View>
  );
});
