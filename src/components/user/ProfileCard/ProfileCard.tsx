import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { Profile } from '../../../types/entities';
import { styles } from './styles';

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
  const translatedRole = roleTranslations[profile.role_PRF] || profile.role_PRF;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Información Personal</Text>
        <Text style={styles.subtitle}>Tus datos personales</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>Nombre Completo</Text>
          <Text style={styles.value}>{profile.full_name_PRF || 'Sin nombre'}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Número de Teléfono</Text>
          <Text style={styles.value}>
            {profile.phone_number_PRF || 'Sin teléfono'}
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Rol</Text>
          <Text style={styles.value}>{translatedRole}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Estado</Text>
          <Text style={styles.value}>
            {profile.is_active_PRF ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>

        <Pressable style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </Pressable>
      </View>
    </View>
  );
});
