import { memo } from 'react';
import { View, Dimensions, Platform } from 'react-native';
import { PartyPopper } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { ImageCarousel } from '@/components/ui';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EventPostImageProps {
    imageUrls: string[];
}

export const EventPostImage = memo(function EventPostImage({ imageUrls }: EventPostImageProps) {
    const colors = useThemedColors();
    const carouselWidth = Platform.OS === 'web' ? Math.min(SCREEN_WIDTH, 600) : SCREEN_WIDTH;

    return (
        <View style={{ width: carouselWidth, alignSelf: 'center' }}>
            {imageUrls.length > 0 ? (
                <ImageCarousel
                    images={imageUrls}
                    imageWidth={carouselWidth}
                    aspectRatio={16 / 9}
                />
            ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: colors.background.tertiary }]}>
                    <PartyPopper size={48} color={colors.text.tertiary} />
                </View>
            )}
        </View>
    );
});
