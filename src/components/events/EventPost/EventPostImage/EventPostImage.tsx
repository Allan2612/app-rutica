import { memo } from 'react';
import { View, Dimensions, Platform } from 'react-native';
import { PartyPopper } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { GenericCarousel } from '@/components/ui';
import { Image } from 'expo-image';
import { styles } from '../styles';

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
                <GenericCarousel
                    items={imageUrls}
                    renderItem={(image) => (
                        <Image
                            source={{ uri: image }}
                            style={{ width: carouselWidth, aspectRatio: 16 / 9 }}
                            contentFit="cover"
                        />
                    )}
                    showNavigation={true}
                    showIndicators={true}
                    enableImageModal={true}
                    autoScroll={false}
                />
            ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: colors.background.tertiary }]}>
                    <PartyPopper size={48} color={colors.text.tertiary} />
                </View>
            )}
        </View>
    );
});
