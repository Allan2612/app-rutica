import { memo, useState, useCallback } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator, Platform } from 'react-native';
import { X, ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useThemedColors } from '@/hooks';
import { ImageCropModal } from '../ImageCropModal';
import { styles } from './styles';
import { compressImage, IMAGE_MAX_SIZE } from '@/utils/imageCompression';
import Toast from 'react-native-toast-message';

export interface SingleImagePickerProps {
  imageUri: string | null;
  onImageChange: (uri: string | null) => void;
  label: string;
  helperText?: string;
  aspectRatio?: [number, number];
  /** Forma del recorte: 'rect' para rectángulo (portadas), 'round' para círculo (logos) */
  cropShape?: 'rect' | 'round';
}

export const SingleImagePicker = memo(function SingleImagePicker({
  imageUri,
  onImageChange,
  label,
  helperText,
  aspectRatio = [16, 9],
  cropShape = 'rect',
}: SingleImagePickerProps) {
  const colors = useThemedColors();
  const [isLoading, setIsLoading] = useState(false);
  // Estado para el modal de crop en web
  const [showCropModal, setShowCropModal] = useState(false);
  // Los recortes redondos son logos: se ven chicos
  const maxSize = cropShape === 'round' ? IMAGE_MAX_SIZE.avatar : IMAGE_MAX_SIZE.content;
  const [tempImageUri, setTempImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    try {
      setIsLoading(true);

      // En web, NO usamos allowsEditing porque no funciona
      // En móvil, SÍ usamos allowsEditing para el editor nativo
      const isWeb = Platform.OS === 'web';

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: !isWeb, // Solo en móvil
        aspect: aspectRatio,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedUri = result.assets[0].uri;

        if (isWeb) {
          // En web, guardamos la imagen temporal y abrimos el modal de crop
          setTempImageUri(selectedUri);
          setShowCropModal(true);
        } else {
          // En móvil, el cropping ya se hizo con el editor nativo
          onImageChange(await compressImage(selectedUri, maxSize));
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo seleccionar la imagen',
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCropComplete = useCallback(
    async (croppedUri: string) => {
      onImageChange(await compressImage(croppedUri, maxSize));
      setShowCropModal(false);
      setTempImageUri(null);
    },
    [onImageChange, maxSize],
  );

  const handleCropCancel = useCallback(() => {
    setShowCropModal(false);
    setTempImageUri(null);
  }, []);

  const handleRemoveImage = () => {
    onImageChange(null);
  };

  // Calcular el aspect ratio como número para el modal
  const aspectRatioValue = aspectRatio[0] / aspectRatio[1];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text.primary }]}>{label}</Text>

      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar"
            style={[styles.removeButton, { backgroundColor: 'rgba(0,0,0,0.7)' }]}
            onPress={handleRemoveImage}
          >
            <X color="#fff" size={18} strokeWidth={2.5} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            {
              backgroundColor: colors.background.tertiary,
              borderColor: colors.border.medium,
              opacity: pressed || isLoading ? 0.5 : 1,
            },
          ]}
          onPress={handlePickImage}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary[500]} />
          ) : (
            <>
              <ImageIcon color={colors.text.tertiary} size={32} strokeWidth={1.5} />
              <Text style={[styles.addText, { color: colors.text.tertiary }]}>
                Seleccionar imagen
              </Text>
            </>
          )}
        </Pressable>
      )}

      {helperText && (
        <Text style={[styles.helperText, { color: colors.text.tertiary }]}>{helperText}</Text>
      )}

      {/* Modal de cropping para web */}
      <ImageCropModal
        visible={showCropModal}
        imageUri={tempImageUri}
        aspectRatio={aspectRatioValue}
        cropShape={cropShape}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
        title={`Recortar ${label.toLowerCase()}`}
      />
    </View>
  );
});
