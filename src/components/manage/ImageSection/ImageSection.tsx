import { memo } from 'react';
import { View, Text } from 'react-native';
import { SingleImagePicker, MultipleImagePicker } from '@/components/ui';
import { useThemedColors } from '@/hooks';
import { formSectionStyles } from '@/styles/form-section-styles';
import { styles } from './styles';

interface ImageSectionProps {
    logoUri?: string | null;
    coverUri?: string | null;
    galleryUris: string[];
    onLogoChange?: (uri: string | null) => void;
    onCoverChange?: (uri: string | null) => void;
    onGalleryChange: (uris: string[]) => void;
    showLogo?: boolean;
    showCover?: boolean;
    sectionTitle?: string;
    coverLabel?: string;
    coverHelperText?: string;
    galleryLabel?: string;
    galleryHelperText?: string;
    maxGalleryImages?: number;
}

export const ImageSection = memo(function ImageSection({
    logoUri,
    coverUri,
    galleryUris,
    onLogoChange,
    onCoverChange,
    onGalleryChange,
    showLogo = true,
    showCover = true,
    sectionTitle = 'Imágenes',
    coverLabel = 'Imagen de Portada',
    coverHelperText = 'Imagen principal que se mostrará en la cabecera',
    galleryLabel = 'Galería (Opcional)',
    galleryHelperText = 'Hasta 3 imágenes adicionales del lugar o comercio',
    maxGalleryImages = 3,
}: ImageSectionProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.section}>
            {sectionTitle && (
                <Text style={[formSectionStyles.sectionTitle, { color: colors.text.primary }]}>
                    {sectionTitle}
                </Text>
            )}

            {showLogo && logoUri !== undefined && onLogoChange && (
                <SingleImagePicker
                    imageUri={logoUri}
                    onImageChange={onLogoChange}
                    label="Logo"
                    helperText="Imagen cuadrada que representa tu negocio"
                    aspectRatio={[1, 1]}
                />
            )}

            {showCover && onCoverChange && (
                <SingleImagePicker
                    imageUri={coverUri ?? null}
                    onImageChange={onCoverChange}
                    label={coverLabel}
                    helperText={coverHelperText}
                    aspectRatio={[16, 9]}
                />
            )}

            <MultipleImagePicker
                images={galleryUris}
                onImagesChange={onGalleryChange}
                maxImages={maxGalleryImages}
                label={galleryLabel}
                helperText={galleryHelperText}
            />
        </View>
    );
});
