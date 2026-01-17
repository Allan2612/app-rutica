import { memo, useRef, useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
    FlatList,
    Dimensions,
    Platform,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { styles } from './styles';

interface BusinessGalleryProps {
    images: string[];
    onImagePress: (imageUrl: string) => void;
}

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const MAX_WIDTH = isWeb ? 600 : width - 48;
const CAROUSEL_WIDTH = Math.min(width - 48, MAX_WIDTH);
const IMAGE_WIDTH = CAROUSEL_WIDTH - 48;
const SNAP_INTERVAL = IMAGE_WIDTH + 48;
const AUTO_SCROLL_INTERVAL = 3000;

export const BusinessGallery = memo(({ images, onImagePress }: BusinessGalleryProps) => {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!images || images.length <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % images.length;

                flatListRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });

                return nextIndex;
            });
        }, AUTO_SCROLL_INTERVAL);

        return () => clearInterval(interval);
    }, [images]);

    if (!images || images.length === 0) {
        return null;
    }

    const goToPrevious = useCallback(() => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
        setCurrentIndex(newIndex);
    }, [currentIndex, images.length]);

    const goToNext = useCallback(() => {
        const newIndex = (currentIndex + 1) % images.length;
        flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
        setCurrentIndex(newIndex);
    }, [currentIndex, images.length]);

    const renderItem = ({ item }: { item: string }) => (
        <Pressable onPress={() => onImagePress(item)} style={styles.imageContainer}>
            <Image
                source={{ uri: item }}
                style={styles.carouselImage}
                resizeMode="cover"
            />
        </Pressable>
    );

    return (
        <View style={styles.gallerySection}>
            <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>
                Galería
            </Text>
            <View style={styles.carouselWrapper}>
                <FlatList
                    ref={flatListRef}
                    data={images}
                    renderItem={renderItem}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={SNAP_INTERVAL}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(
                            event.nativeEvent.contentOffset.x / SNAP_INTERVAL
                        );
                        setCurrentIndex(newIndex);
                    }}
                    getItemLayout={(_, index) => ({
                        length: SNAP_INTERVAL,
                        offset: SNAP_INTERVAL * index,
                        index,
                    })}
                    contentContainerStyle={styles.carouselContainer}
                />
                {images.length > 1 && (
                    <>
                        <Pressable onPress={goToPrevious} style={[styles.navButton, styles.navButtonLeft]}>
                            <ChevronLeft size={24} color="#FFFFFF" />
                        </Pressable>
                        <Pressable onPress={goToNext} style={[styles.navButton, styles.navButtonRight]}>
                            <ChevronRight size={24} color="#FFFFFF" />
                        </Pressable>
                    </>
                )}
            </View>
            <View style={styles.indicatorContainer}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.indicator,
                            index === currentIndex && styles.activeIndicator,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
});

BusinessGallery.displayName = 'BusinessGallery';
