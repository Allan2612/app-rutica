import { memo, useState, useCallback } from 'react';
import { View, Text, Modal, Pressable, Alert } from 'react-native';
import { AuthInput } from '@/components/auth';
import type { Profile, ProfileUpdate } from '@/types/entities';
import { useThemedColors } from '@/hooks';
import styles from './styles';

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
  const colors = useThemedColors();
  const [firstName, setFirstName] = useState(profile.first_name_PRF || '');
  const [lastName1, setLastName1] = useState(profile.last_name1_PRF || '');
  const [lastName2, setLastName2] = useState(profile.last_name2_PRF || '');
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number_PRF || '');
  const [loading, setLoading] = useState(false);

  const handleSave = useCallback(async () => {
    if (!firstName.trim() || !lastName1.trim()) {
      Alert.alert('Error', 'El nombre y primer apellido son obligatorios');
      return;
    }

    try {
      setLoading(true);
      await onSave({
        first_name_PRF: firstName.trim(),
        last_name1_PRF: lastName1.trim(),
        last_name2_PRF: lastName2.trim() || null,
        phone_number_PRF: phoneNumber.trim() || null,
      });
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  }, [firstName, lastName1, lastName2, phoneNumber, onSave, onClose]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable 
          style={[styles.container, { 
            backgroundColor: colors.background.primary,
            borderColor: colors.border.light,
          }]} 
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Editar Perfil
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Actualiza tu información personal
            </Text>
          </View>

          <View style={styles.form}>
            <AuthInput
              label="Nombre"
              placeholder="Tu nombre"
              value={firstName}
              onChangeText={setFirstName}
              editable={!loading}
            />

            <AuthInput
              label="Primer Apellido"
              placeholder="Tu primer apellido"
              value={lastName1}
              onChangeText={setLastName1}
              editable={!loading}
            />

            <AuthInput
              label="Segundo Apellido (opcional)"
              placeholder="Tu segundo apellido"
              value={lastName2}
              onChangeText={setLastName2}
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
              style={[styles.button, { 
                backgroundColor: colors.background.tertiary,
                borderWidth: 1,
                borderColor: colors.border.medium,
              }]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={[styles.buttonTextSecondary, { color: colors.text.primary }]}>
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button, { 
                backgroundColor: colors.primary[500],
                opacity: loading ? 0.7 : 1,
              }]}
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
