import { memo, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store';
import { useProfile } from '@/features/user/hooks';
import { ProfileCard, ProfileEditModal } from '@/components/user';
import { Screen } from '@/components/layout';
import { BaseHeader } from '@/components/layout/Header';
import styles from './styles';
import { colors } from '@/styles/theme/colors';

export default memo(function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const { profile, isLoading, error, updateProfile } = useProfile();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

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
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </Screen>
    );
  }

  if (error || !profile) {
    return (
      <Screen>
        <BaseHeader />
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>
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
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Mi Perfil</Text>
          <Text style={styles.subtitle}>{user?.email}</Text>
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
