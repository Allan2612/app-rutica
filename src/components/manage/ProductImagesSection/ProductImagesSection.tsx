import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { MultipleImagePicker } from '@/components/ui';
import { styles } from './styles';

export interface ProductImagesSectionProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
}

export const ProductImagesSection = memo(function ProductImagesSection({
    images,
    onImagesChange,
}: ProductImagesSectionProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Imágenes del Producto
            </Text>
            <Text style={[styles.helperText, { color: colors.text.secondary }]}>
                Opcional. Máximo 2 imágenes.
            </Text>

            <MultipleImagePicker
                images={images}
                onImagesChange={onImagesChange}
                maxImages={2}
                label=""
                helperText="Sube fotos que muestren tu producto"
            />
        </View>
    );
});
