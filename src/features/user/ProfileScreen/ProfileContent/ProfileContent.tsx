import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';
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

      {/* Cerrar sesión vive aquí (en PC el panel lateral ya no lo muestra) */}
      <View style={styles.cardWrapper}>
        <Pressable
          onPress={() => router.push('/(app)/logout')}
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#ef4444',
            backgroundColor: pressed ? '#ef44441f' : 'transparent',
          })}
        >
          <LogOut color="#ef4444" size={18} />
          <Text style={{ color: '#ef4444', fontWeight: '600', fontSize: 15 }}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </>
  );
});
