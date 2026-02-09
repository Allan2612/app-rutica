import { memo, useState } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator, Alert } from 'react-native';
import { Plus, X, ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface SingleImagePickerProps {
  imageUri: string | null;
  onImageChange: (uri: string | null) => void;
  label: string;
  helperText?: string;
  aspectRatio?: [number, number];
}

export const SingleImagePicker = memo(function SingleImagePicker({
  imageUri,
  onImageChange,
  label,
  helperText,
  aspectRatio = [16, 9],
}: SingleImagePickerProps) {
  const colors = useThemedColors();
  const [isLoading, setIsLoading] = useState(false);

  const handlePickImage = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: aspectRatio,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageChange(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text.primary }]}>{label}</Text>

      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
          <Pressable
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
    </View>
  );
});
