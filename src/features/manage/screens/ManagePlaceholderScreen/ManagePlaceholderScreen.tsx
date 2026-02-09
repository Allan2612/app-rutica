import { memo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { AuthButton } from '@/components/auth';
import { useThemedColors } from '@/hooks';
import styles from './styles';

export interface ManagePlaceholderScreenProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export const ManagePlaceholderScreen = memo(function ManagePlaceholderScreen({
  title,
  description,
  icon,
}: ManagePlaceholderScreenProps) {
  const colors = useThemedColors();

  const goToManageHub = useCallback(() => {
    router.replace('/(app)/(tabs)/manage');
  }, []);

  const goHome = useCallback(() => {
    router.replace('/(app)/(tabs)/home');
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.light,
          },
        ]}
      >
        {icon ? (
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.background.tertiary,
                borderColor: colors.border.medium,
              },
            ]}
          >
            {icon}
          </View>
        ) : null}

        <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
        <Text style={[styles.description, { color: colors.text.secondary }]}>{description}</Text>

        <View style={styles.actions}>
          <AuthButton
            title="Volver"
            variant="secondary"
            onPress={goToManageHub}
            style={styles.button}
          />
          <AuthButton title="Ir a Home" onPress={goHome} style={styles.button} />
        </View>

        <Text
          style={[
            styles.comingSoon,
            {
              color: colors.isDark ? colors.primary[300] : colors.primary[700],
              backgroundColor: colors.isDark ? colors.primary[900] : colors.primary[100],
            },
          ]}
        >
          Próximamente
        </Text>
      </View>
    </View>
  );
});
