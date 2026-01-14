import { memo, useState } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator, ScrollView, StyleSheet, Alert } from 'react-native';
import { Plus, X, ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useThemedColors } from '@/hooks';
import { spacing, typography } from '@/styles/theme';

export interface ImageSelectorProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
    label?: string;
    helperText?: string;
}

export const ImageSelector = memo(function ImageSelector({
    images,
    onImagesChange,
    maxImages = 5,
    label,
    helperText,
}: ImageSelectorProps) {
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
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                onImagesChange([...images, result.assets[0].uri]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
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
            {label && (
                <Text style={[styles.label, { color: colors.text.primary }]}>{label}</Text>
            )}

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
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        gap: spacing.sm,
    },
    label: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    scrollContent: {
        gap: spacing.md,
        paddingVertical: spacing.xs,
    },
    imageWrapper: {
        position: 'relative',
        width: 120,
        height: 120,
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    orderBadge: {
        position: 'absolute',
        top: 6,
        left: 6,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: typography.fontWeights.bold,
    },
    removeButton: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBadge: {
        position: 'absolute',
        bottom: 6,
        left: 6,
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
        borderRadius: 4,
    },
    primaryText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: typography.fontWeights.bold,
    },
    addButton: {
        width: 120,
        height: 120,
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
    },
    addText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.medium,
    },
    helperText: {
        fontSize: typography.sizes.xs,
        lineHeight: 16,
    },
});
