import { memo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useAuthStore } from '@/store';
import { useProfile } from '@/features/user/hooks';
import { ProfileEditModal, PremiumModal } from '@/components/user';
import { Screen } from '@/components/layout';
import { BaseHeader } from '@/components/layout/Header';
import { useThemedColors, useRefreshOnFocus } from '@/hooks';
import { ProfileLoading } from './ProfileLoading';
import { ProfileContent } from './ProfileContent';
import { ProfileToastConfig } from './ProfileToastConfig';
import { useProfileHandlers } from './useProfileHandlers';
import styles from './styles';

export default memo(function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const { profile, isLoading, error, updateProfile, refreshProfile } = useProfile();
  const [premiumRefreshKey, setPremiumRefreshKey] = useState(0);
  const colors = useThemedColors();

  // Refrescar perfil cuando la pantalla recibe foco
  useRefreshOnFocus(refreshProfile);

  const {
    isEditModalVisible,
    isPremiumModalVisible,
    handleOpenEdit,
    handleCloseEdit,
    handleOpenPremiumModal,
    handleClosePremiumModal,
    handlePremiumSuccess,
    handlePremiumInfo,
    handleBack,
  } = useProfileHandlers(setPremiumRefreshKey);

  if (isLoading || error || !profile) {
    return <ProfileLoading isLoading={isLoading} error={error} />;
  }

  return (
    <Screen>
      <BaseHeader />
      <ScrollView
        style={[styles.scrollContainer, { backgroundColor: colors.background.secondary }]}
        contentContainerStyle={styles.contentContainer}
      >
        <ProfileContent
          profile={profile}
          userEmail={user?.email}
          premiumRefreshKey={premiumRefreshKey}
          onEdit={handleOpenEdit}
          onBack={handleBack}
          onSubscribePress={handleOpenPremiumModal}
          onRoleUpdate={refreshProfile}
        />

        {isEditModalVisible && (
          <ProfileEditModal
            visible={isEditModalVisible}
            profile={profile}
            onClose={handleCloseEdit}
            onSave={updateProfile}
          />
        )}

        <PremiumModal
          visible={isPremiumModalVisible}
          onClose={handleClosePremiumModal}
          onSuccess={handlePremiumSuccess}
          onInfo={handlePremiumInfo}
          userRole={profile?.role_prf || null}
        />
      </ScrollView>

      <ProfileToastConfig />
    </Screen>
  );
});
