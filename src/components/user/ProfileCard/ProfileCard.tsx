import { memo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { User, Store } from 'lucide-react-native';
import type { Profile } from '@/types/entities';
import { getFullName } from '@/types/entities';
import { useThemedColors, useProfilePhoto } from '@/hooks';
import { useAuthStore } from '@/store';
import { upgradeToSeller } from '@/features/user/services/profile.service';
import { ConfirmUpgradeToSellerDialog } from '@/components/user';
import Toast from 'react-native-toast-message';
import styles from './styles';

interface ProfileCardProps {
  profile: Profile;
  onEdit: () => void;
  onBack: () => void;
  onRoleUpdate?: () => void;
}

const roleTranslations: Record<string, string> = {
  seller: 'Vendedor',
  buyer: 'Comprador',
  admin: 'Administrador',
};

export const ProfileCard = memo(function ProfileCard({
  profile,
  onEdit,
  onBack,
  onRoleUpdate,
}: ProfileCardProps) {
  const colors = useThemedColors();
  const profilePhotoUrl = useProfilePhoto(profile.id_prf);
  const translatedRole = profile.role_prf ? (roleTranslations[profile.role_prf] || profile.role_prf) : 'Sin rol';
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const loadUserData = useAuthStore((state) => state.loadUserData);

  const isBuyer = profile.role_prf === 'buyer' || profile.role_prf === 'user';

  const handleOpenUpgradeDialog = () => {
    setShowConfirmDialog(true);
  };

  const handleCloseUpgradeDialog = () => {
    setShowConfirmDialog(false);
  };

  const handleConfirmUpgrade = async () => {
    try {
      setIsUpgrading(true);
      await upgradeToSeller(profile.id_prf);
      
      // Actualizar el authStore con el nuevo rol
      await loadUserData();
      
      setShowConfirmDialog(false);
      
      Toast.show({
        type: 'success',
        text1: '¡Bienvenido vendedor!',
        text2: 'Ahora puedes gestionar negocios y promociones',
        position: 'top',
      });
      
      // Refrescar el perfil para actualizar UI
      onRoleUpdate?.();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'No se pudo actualizar el rol',
        position: 'top',
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: colors.background.primary,
      borderColor: colors.border.light,
    }]}>
      {/* Foto de perfil */}
      <View style={styles.photoContainer}>
        {profilePhotoUrl ? (
          <Image
            source={{ uri: profilePhotoUrl }}
            style={styles.profilePhoto}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[styles.profilePhoto, { 
            backgroundColor: colors.isDark ? colors.primary[900] : colors.primary[50] 
          }]}>
            <User color={colors.primary[500]} size={48} />
          </View>
        )}
      </View>

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Información Personal
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          Tus datos personales
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text.tertiary }]}>Nombre Completo</Text>
          <Text style={[styles.value, { color: colors.text.primary }]}>
            {getFullName(profile) || 'Sin nombre'}
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text.tertiary }]}>Número de Teléfono</Text>
          <Text style={[styles.value, { color: colors.text.primary }]}>
            {profile.phone_number_prf || 'Sin teléfono'}
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text.tertiary }]}>Rol</Text>
          <Text style={[styles.value, { color: colors.text.primary }]}>{translatedRole}</Text>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text.tertiary }]}>Estado</Text>
          <Text style={[styles.value, { 
            color: profile.is_active_prf ? colors.primary[500] : colors.text.secondary 
          }]}>
            {profile.is_active_prf ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>

      {isBuyer && (
        <Pressable
          style={({ pressed }) => [
            styles.sellerUpgradeButton,
            {
              backgroundColor: colors.primary[500],
              opacity: pressed || isUpgrading ? 0.7 : 1,
            },
          ]}
          onPress={handleOpenUpgradeDialog}
          disabled={isUpgrading}
        >
          <Store color="#fff" size={20} />
          <Text style={styles.sellerUpgradeButtonText}>
            {isUpgrading ? 'Actualizando...' : 'Convertirse en Vendedor'}
          </Text>
        </Pressable>
      )}

      <View style={styles.buttonContainer}>
        <Pressable 
          style={[styles.backButton, { 
            backgroundColor: colors.background.tertiary,
            borderColor: colors.border.medium,
          }]} 
          onPress={onBack}
        >
          <Text style={[styles.backButtonText, { color: colors.text.primary }]}>Volver</Text>
        </Pressable>

        <Pressable 
          style={[styles.editButton, { backgroundColor: colors.primary[500] }]} 
          onPress={onEdit}
        >
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </Pressable>
      </View>

      <ConfirmUpgradeToSellerDialog
        visible={showConfirmDialog}
        onConfirm={handleConfirmUpgrade}
        onCancel={handleCloseUpgradeDialog}
        isUpgrading={isUpgrading}
      />
    </View>
  );
});
