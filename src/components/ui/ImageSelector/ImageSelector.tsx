import { memo, useState, useCallback } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator, ScrollView, Alert, Platform } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useThemedColors } from '@/hooks';
import { ImageCropModal } from '../ImageCropModal';
import { styles } from './styles';

export interface ImageSelectorProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
  /** Aspect ratio para el recorte [ancho, alto] */
  aspectRatio?: [number, number];
}

export const ImageSelector = memo(function ImageSelector({
  images,
  onImagesChange,
  maxImages = 5,
  label,
  helperText,
  aspectRatio = [16, 9],
}: ImageSelectorProps) {
  const colors = useThemedColors();
  const [isLoading, setIsLoading] = useState(false);
  // Estado para el modal de crop en web
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageUri, setTempImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Límite alcanzado', `Solo puedes agregar hasta ${maxImages} imágenes`);
      return;
    }

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
          onImagesChange([...images, selectedUri]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCropComplete = useCallback(
    (croppedUri: string) => {
      onImagesChange([...images, croppedUri]);
      setShowCropModal(false);
      setTempImageUri(null);
    },
    [images, onImagesChange],
  );

  const handleCropCancel = useCallback(() => {
    setShowCropModal(false);
    setTempImageUri(null);
  }, []);

  const handleRemoveImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  // Calcular el aspect ratio como número para el modal
  const aspectRatioValue = aspectRatio[0] / aspectRatio[1];

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text.primary }]}>{label}</Text>}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Imágenes existentes */}
        {images.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} resizeMode="cover" />

            {/* Badge de orden */}
            <View style={[styles.orderBadge, { backgroundColor: colors.primary[500] }]}>
              <Text style={styles.orderText}>{index + 1}</Text>
            </View>

            {/* Botón eliminar */}
            <Pressable
              style={[styles.removeButton, { backgroundColor: 'rgba(0,0,0,0.7)' }]}
              onPress={() => handleRemoveImage(index)}
            >
              <X color="#fff" size={16} strokeWidth={2.5} />
            </Pressable>

            {index === 0 && (
              <View style={[styles.primaryBadge, { backgroundColor: colors.success }]}>
                <Text style={styles.primaryText}>Principal</Text>
              </View>
            )}
          </View>
        ))}

        {/* Botón agregar */}
        {images.length < maxImages && (
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
                <Plus color={colors.text.tertiary} size={32} strokeWidth={1.5} />
                <Text style={[styles.addText, { color: colors.text.tertiary }]}>Agregar</Text>
              </>
            )}
          </Pressable>
        )}
      </ScrollView>

      {helperText && (
        <Text style={[styles.helperText, { color: colors.text.tertiary }]}>{helperText}</Text>
      )}

      {/* Modal de cropping para web */}
      <ImageCropModal
        visible={showCropModal}
        imageUri={tempImageUri}
        aspectRatio={aspectRatioValue}
        cropShape="rect"
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
        title="Recortar imagen"
      />
    </View>
  );
});
