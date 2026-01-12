import { memo, useState, useCallback } from 'react';
import { View, Text, Modal, Pressable, Alert } from 'react-native';
import { AuthInput } from '../../auth';
import type { Profile, ProfileUpdate } from '../../../types/entities';
import { styles } from './styles';

interface ProfileEditModalProps {
  visible: boolean;
  profile: Profile;
  onClose: () => void;
  onSave: (updates: ProfileUpdate) => Promise<void>;
}

export const ProfileEditModal = memo(function ProfileEditModal({
  visible,
  profile,
  onClose,
  onSave,
}: ProfileEditModalProps) {
  const [fullName, setFullName] = useState(profile.full_name_PRF || '');
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number_PRF || '');
  const [loading, setLoading] = useState(false);

  const handleSave = useCallback(async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    try {
      setLoading(true);
      await onSave({
        full_name_PRF: fullName.trim(),
        phone_number_PRF: phoneNumber.trim() || null,
      });
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  }, [fullName, phoneNumber, onSave, onClose]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar Perfil</Text>
            <Text style={styles.subtitle}>Actualiza tu información personal</Text>
          </View>

          <View style={styles.form}>
            <AuthInput
              label="Nombre Completo"
              placeholder="Tu nombre completo"
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
            />

            <AuthInput
              label="Número de Teléfono"
              placeholder="1234-5678"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={!loading}
            />
          </View>

          <View style={styles.buttons}>
            <Pressable
              style={[styles.button, styles.buttonSecondary]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.buttonTextSecondary}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Guardando...' : 'Guardar'}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
});
