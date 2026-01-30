import { memo, useState, useCallback } from 'react';
import { View, Text, Modal, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, User, X } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { AuthInput } from '@/components/auth';
import type { Profile, ProfileUpdate } from '@/types/entities';
import { useThemedColors, useProfilePhoto } from '@/hooks';
import { supabase } from '@/lib/supabase';
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
  const profilePhotoUrl = useProfilePhoto(profile.id_prf);
  const [firstName, setFirstName] = useState(profile.first_name_prf || '');
  const [lastName1, setLastName1] = useState(profile.last_name1_prf || '');
  const [lastName2, setLastName2] = useState(profile.last_name2_prf || '');
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number_prf || '');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos requeridos', 'Se necesita permiso para acceder a tus fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  }, []);

  const removePhoto = useCallback(() => {
    setProfilePhoto(null);
  }, []);

  const uploadProfilePhoto = useCallback(async (uri: string) => {
    try {
      // Si existe una foto anterior, eliminarla del bucket
      if (profile.profile_photo_path_prf) {
        const { error: deleteError } = await supabase.storage
          .from('profiles-images')
          .remove([profile.profile_photo_path_prf]);
        
        if (deleteError) {
          console.warn('Error al eliminar foto anterior:', deleteError);
        }
      }

      const fileName = `${profile.id_prf}-${Date.now()}.jpg`;
      const filePath = `${profile.id_prf}/${fileName}`;

      // Obtener el archivo como blob para web
      const response = await fetch(uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('profiles-images')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo_path_prf: filePath } as never)
        .eq('id_prf', profile.id_prf);

      if (updateError) throw updateError;

      return filePath;
    } catch (error: any) {
      throw new Error(error.message || 'Error al subir la foto');
    }
  }, [profile.id_prf, profile.profile_photo_path_prf]);

  const handleSave = useCallback(async () => {
    if (!firstName.trim() || !lastName1.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campos obligatorios',
        text2: 'El nombre y primer apellido son obligatorios',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      setLoading(true);

      // Subir foto de perfil si se seleccionó una nueva
      if (profilePhoto) {
        await uploadProfilePhoto(profilePhoto);
      }

      await onSave({
        first_name_prf: firstName.trim(),
        last_name1_prf: lastName1.trim(),
        last_name2_prf: lastName2.trim() || null,
        phone_number_prf: phoneNumber.trim() || null,
      });
      Toast.show({
        type: 'success',
        text1: '¡Perfil actualizado!',
        text2: 'Tus datos se guardaron correctamente',
        position: 'top',
        visibilityTime: 3000,
      });
      onClose();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar',
        text2: error.message || 'No se pudo actualizar el perfil',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  }, [firstName, lastName1, lastName2, phoneNumber, profilePhoto, uploadProfilePhoto, onSave, onClose]);

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

          {/* Foto de perfil */}
          <View style={styles.photoSection}>
            <View style={styles.photoContainer}>
              {profilePhoto ? (
                <>
                  <Image
                    source={{ uri: profilePhoto }}
                    style={styles.photo}
                    contentFit="cover"
                    transition={200}
                  />
                  <Pressable
                    style={[styles.removeButton, { backgroundColor: colors.error || '#ef4444' }]}
                    onPress={removePhoto}
                  >
                    <X color="#fff" size={16} />
                  </Pressable>
                </>
              ) : profilePhotoUrl ? (
                <Image
                  source={{ uri: profilePhotoUrl }}
                  style={styles.photo}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View style={[styles.photo, { 
                  backgroundColor: colors.isDark ? colors.primary[900] : colors.primary[50] 
                }]}>
                  <User color={colors.primary[500]} size={48} />
                </View>
              )}
              <Pressable
                style={[styles.cameraButton, { backgroundColor: colors.primary[500] }]}
                onPress={pickImage}
                disabled={loading}
              >
                <Camera color="#fff" size={20} />
              </Pressable>
            </View>
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
