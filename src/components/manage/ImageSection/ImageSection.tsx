import { memo } from 'react';
import { View } from 'react-native';
import { SingleImagePicker, MultipleImagePicker } from '@/components/ui';
import { styles } from './styles';

interface ImageSectionProps {
    logoUri: string | null;
    coverUri: string | null;
    galleryUris: string[];
    onLogoChange: (uri: string | null) => void;
    onCoverChange: (uri: string | null) => void;
    onGalleryChange: (uris: string[]) => void;
}

export const ImageSection = memo(function ImageSection({
    logoUri,
    coverUri,
    galleryUris,
    onLogoChange,
    onCoverChange,
    onGalleryChange,
}: ImageSectionProps) {
    return (
        <View style={styles.section}>
            <SingleImagePicker
                imageUri={logoUri}
                onImageChange={onLogoChange}
                label="Logo"
                helperText="Imagen cuadrada que representa tu negocio"
                aspectRatio={[1, 1]}
            />

            <SingleImagePicker
                imageUri={coverUri}
                onImageChange={onCoverChange}
                label="Imagen de Portada"
                helperText="Imagen principal que se mostrará en la cabecera"
                aspectRatio={[16, 9]}
            />

            <MultipleImagePicker
                images={galleryUris}
                onImagesChange={onGalleryChange}
                maxImages={3}
                label="Galería (Opcional)"
                helperText="Hasta 3 imágenes adicionales del lugar o comercio"
            />
        </View>
    );
});
