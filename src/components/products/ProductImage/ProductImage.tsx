import { memo } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
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
        <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <ShoppingBag color={colors.text.tertiary} size={32} strokeWidth={1.5} />
        </View>
      )}
    </View>
  );
});
