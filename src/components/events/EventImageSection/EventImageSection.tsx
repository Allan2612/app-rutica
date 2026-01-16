import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { SingleImagePicker, MultipleImagePicker } from '@/components/ui';
import { styles } from './styles';

interface EventImageSectionProps {
    coverUri: string | null;
    galleryUris: string[];
    onCoverChange: (uri: string | null) => void;
    onGalleryChange: (uris: string[]) => void;
}

export const EventImageSection = memo(function EventImageSection({
    coverUri,
    galleryUris,
    onCoverChange,
    onGalleryChange,
}: EventImageSectionProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Imágenes del Evento
            </Text>

            <View style={styles.imageGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>
                    Imagen de Portada
                </Text>
                <Text style={[styles.hint, { color: colors.text.secondary }]}>
                    Esta imagen se mostrará como principal del evento
                </Text>
                <SingleImagePicker
                    imageUri={coverUri}
                    onImageChange={onCoverChange}
                    label="Seleccionar portada"
                />
            </View>

            <View style={styles.imageGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>
                    Galería (Opcional)
                </Text>
                <Text style={[styles.hint, { color: colors.text.secondary }]}>
                    Agrega hasta 3 imágenes adicionales del evento
                </Text>
                <MultipleImagePicker
                    images={galleryUris}
                    onImagesChange={onGalleryChange}
                    maxImages={3}
                    label="Agregar imágenes"
                    helperText="Hasta 3 imágenes"
                />
            </View>
        </View>
    );
});
