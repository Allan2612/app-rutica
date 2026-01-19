import { memo } from 'react';
import { View, Image } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface ProductImageProps {
    imageUrl?: string | null;
}

export const ProductImage = memo(function ProductImage({ imageUrl }: ProductImageProps) {
    const colors = useThemedColors();

    return (
        <View style={[styles.imageContainer, { backgroundColor: colors.background.tertiary }]}>
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <ShoppingBag color={colors.text.tertiary} size={32} strokeWidth={1.5} />
                </View>
            )}
        </View>
    );
});
