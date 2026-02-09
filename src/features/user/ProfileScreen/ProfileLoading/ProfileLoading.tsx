import { memo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Screen } from '@/components/layout';
import { BaseHeader } from '@/components/layout/Header';
import { useThemedColors } from '@/hooks';
import styles from '../styles';

interface ProfileLoadingProps {
  isLoading?: boolean;
  error?: string | null;
}

export const ProfileLoading = memo(function ProfileLoading({
  isLoading,
  error,
}: ProfileLoadingProps) {
  const colors = useThemedColors();

  if (isLoading) {
    return (
      <Screen>
        <BaseHeader />
        <View style={[styles.centerContainer, { backgroundColor: colors.background.secondary }]}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Cargando perfil...
          </Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <BaseHeader />
        <View style={[styles.centerContainer, { backgroundColor: colors.background.secondary }]}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={[styles.errorText, { color: colors.text.secondary }]}>
            {error || 'No se pudo cargar el perfil'}
          </Text>
        </View>
      </Screen>
    );
  }

  return null;
});
