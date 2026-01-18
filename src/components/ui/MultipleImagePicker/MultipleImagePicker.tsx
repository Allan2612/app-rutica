import { memo, useState } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface MultipleImagePickerProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages: number;
    label: string;
    helperText?: string;
}

export const MultipleImagePicker = memo(function MultipleImagePicker({
    images,
    onImagesChange,
    maxImages,
    label,
    helperText,
}: MultipleImagePickerProps) {
    const colors = useThemedColors();
    const [isLoading, setIsLoading] = useState(false);

    const handlePickImage = async () => {
        if (images.length >= maxImages) {
            Alert.alert('Límite alcanzado', `Solo puedes agregar hasta ${maxImages} imágenes`);
            return;
        }

        try {
            setIsLoading(true);
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                onImagesChange([...images, result.assets[0].uri]);
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo seleccionar la imagen');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        onImagesChange(images.filter((_, i) => i !== index));
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.text.primary }]}>{label}</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {images.map((uri, index) => (
                    <View key={`${uri}-${index}`} style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.image} resizeMode="cover" />

                        <View style={[styles.orderBadge, { backgroundColor: colors.primary[500] }]}>
                            <Text style={styles.orderText}>{index + 1}</Text>
                        </View>

                        <Pressable
                            style={[styles.removeButton, { backgroundColor: 'rgba(0,0,0,0.7)' }]}
                            onPress={() => handleRemoveImage(index)}
                        >
                            <X color="#fff" size={16} strokeWidth={2.5} />
                        </Pressable>
                    </View>
                ))}

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
        </View>
    );
});
