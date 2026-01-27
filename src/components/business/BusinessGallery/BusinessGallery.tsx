import { memo } from 'react';
import { View, Text, Image } from 'react-native';
import { useThemedColors } from '@/hooks';
import { GenericCarousel } from '@/components/ui';
import { styles } from './styles';

interface BusinessGalleryProps {
    images: string[];
    onImagePress: (imageUrl: string) => void;
}

export const BusinessGallery = memo(({ images, onImagePress }: BusinessGalleryProps) => {
    const colors = useThemedColors();

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <View style={styles.gallerySection}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Galería
            </Text>
            <GenericCarousel
                items={images}
                renderItem={(image) => (
                    <Image
                        source={{ uri: image }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}
                showNavigation={true}
                showIndicators={true}
                enableImageModal={true}
            />
        </View>
    );
});

BusinessGallery.displayName = 'BusinessGallery';
