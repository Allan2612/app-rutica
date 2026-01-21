import { memo, useState, useCallback, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store';
import { useProfile } from '@/features/user/hooks';
import { ProfileCard, ProfileEditModal } from '@/components/user';
import { Screen } from '@/components/layout';
import { BaseHeader } from '@/components/layout/Header';
import { BackButton } from '@/components/ui';
import { useThemedColors } from '@/hooks';
import styles from './styles';

export default memo(function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const { profile, isLoading, error, updateProfile } = useProfile();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const colors = useThemedColors();

  const handleOpenEdit = useCallback(() => {
    setIsEditModalVisible(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditModalVisible(false);
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

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

  if (error || !profile) {
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

  return (
    <Screen>
      <BaseHeader />
      <ScrollView
        style={[styles.scrollContainer, { backgroundColor: colors.background.secondary }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.headerWrapper}>
          <View style={styles.headerWithBack}>
            <BackButton href="/(app)/(tabs)/home" />
            <View style={styles.headerContent}>
              <Text style={[styles.title, { color: colors.text.primary }]}>
                Mi Perfil
              </Text>
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                {user?.email}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardWrapper}>
          <ProfileCard profile={profile} onEdit={handleOpenEdit} onBack={handleBack} />
        </View>

        {isEditModalVisible && (
          <ProfileEditModal
            visible={isEditModalVisible}
            profile={profile}
            onClose={handleCloseEdit}
            onSave={updateProfile}
          />
        )}
      </ScrollView>
    </Screen>
  );
});
