import { memo } from 'react';
import { View, Text } from 'react-native';
import { ProfileCard, PremiumSection } from '@/components/user';
import { useThemedColors } from '@/hooks';
import { Profile } from '@/types/entities';
import styles from '../styles';

interface ProfileContentProps {
  profile: Profile;
  userEmail?: string;
  premiumRefreshKey: number;
  onEdit: () => void;
  onBack: () => void;
  onSubscribePress: () => void;
  onRoleUpdate?: () => void;
}

export const ProfileContent = memo(function ProfileContent({
  profile,
  userEmail,
  premiumRefreshKey,
  onEdit,
  onBack,
  onSubscribePress,
  onRoleUpdate,
}: ProfileContentProps) {
  const colors = useThemedColors();

  return (
    <>
      <View style={styles.headerWrapper}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Mi Perfil</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>{userEmail}</Text>
        </View>
      </View>

      <View style={styles.cardWrapper}>
        <ProfileCard
          profile={profile}
          onEdit={onEdit}
          onBack={onBack}
          onRoleUpdate={onRoleUpdate}
        />
      </View>

      <View style={styles.cardWrapper}>
        <PremiumSection key={premiumRefreshKey} onSubscribePress={onSubscribePress} />
      </View>
    </>
  );
});
