import { memo, useState, useRef } from 'react';
import { View, Image, FlatList, Pressable, LayoutChangeEvent } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface ProductImageCarouselProps {
    images: string[];
    cardWidth: number;
    onLayout: (event: LayoutChangeEvent) => void;
    onImagePress?: (imageUrl: string) => void;
}

export const ProductImageCarousel = memo(function ProductImageCarousel({
    images,
    cardWidth,
    onLayout,
    onImagePress,
}: ProductImageCarouselProps) {
    const colors = useThemedColors();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const hasMultipleImages = images.length > 1;

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index || 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const handlePrevImage = () => {
        const width = cardWidth || 300; // Fallback width
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            flatListRef.current?.scrollToIndex({
                index: newIndex,
                animated: true,
                viewPosition: 0
            });
        }
    };

    const handleNextImage = () => {
        const width = cardWidth || 300; // Fallback width
        if (currentIndex < images.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            flatListRef.current?.scrollToIndex({
                index: newIndex,
                animated: true,
                viewPosition: 0
            });
        }
    };

    const onScrollToIndexFailed = (info: any) => {
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
            flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
                viewPosition: 0
            });
        });
    };

    const renderImage = ({ item }: { item: string }) => (
        <Pressable
            style={[styles.imageContainer, { width: cardWidth > 0 ? cardWidth : 300 }]}
            onPress={() => onImagePress?.(item)}
        >
            <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
        </Pressable>
    );

    if (images.length === 0) {
        return (
            <View style={[styles.imageContainer, styles.imagePlaceholder, { backgroundColor: colors.background.tertiary }]} />
        );
    }

    return (
        <View style={styles.carouselContainer} onLayout={onLayout}>
            <FlatList
                ref={flatListRef}
                data={images}
                renderItem={renderImage}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `image-${index}`}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                snapToInterval={cardWidth > 0 ? cardWidth : 300}
                decelerationRate="fast"
                getItemLayout={(data, index) => {
                    const width = cardWidth > 0 ? cardWidth : 300;
                    return {
                        length: width,
                        offset: width * index,
                        index,
                    };
                }}
                onScrollToIndexFailed={onScrollToIndexFailed}
            />

            {hasMultipleImages && (
                <>
                    {currentIndex > 0 && (
                        <Pressable
                            style={({ pressed }) => [
                                styles.navButton,
                                styles.navButtonLeft,
                                { backgroundColor: colors.background.primary, opacity: pressed ? 0.7 : 0.9 },
                            ]}
                            onPress={handlePrevImage}
                        >
                            <ChevronLeft size={16} color={colors.text.primary} strokeWidth={3} />
                        </Pressable>
                    )}

                    {currentIndex < images.length - 1 && (
                        <Pressable
                            style={({ pressed }) => [
                                styles.navButton,
                                styles.navButtonRight,
                                { backgroundColor: colors.background.primary, opacity: pressed ? 0.7 : 0.9 },
                            ]}
                            onPress={handleNextImage}
                        >
                            <ChevronRight size={16} color={colors.text.primary} strokeWidth={3} />
                        </Pressable>
                    )}

                    <View style={styles.dotsContainer}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    { backgroundColor: index === currentIndex ? colors.primary[500] : colors.border.medium },
                                ]}
                            />
                        ))}
                    </View>
                </>
            )}
        </View>
    );
});
