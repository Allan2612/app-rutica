import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { Profile } from '@/types/entities';
import { getFullName } from '@/types/entities';
import { useThemedColors } from '@/hooks';
import styles from './styles';

interface ProfileCardProps {
  profile: Profile;
  onEdit: () => void;
  onBack: () => void;
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
}: ProfileCardProps) {
  const colors = useThemedColors();
  const translatedRole = profile.role_prf ? (roleTranslations[profile.role_prf] || profile.role_prf) : 'Sin rol';

  return (
    <View style={[styles.container, { 
      backgroundColor: colors.background.primary,
      borderColor: colors.border.light,
    }]}>
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
    </View>
  );
});
