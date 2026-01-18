import { useRef, useState, useCallback } from 'react';
import {
    View,
    Image,
    Pressable,
    FlatList,
    Dimensions,
    Modal,
} from 'react-native';
import { ChevronLeft, ChevronRight, X, ImageIcon } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ImageCarouselProps {
    images: string[];
    imageWidth?: number;
    aspectRatio?: number;
    showNavButtons?: boolean;
    onImagePress?: (imageUrl: string, index: number) => void;
}

export function ImageCarousel({
    images,
    imageWidth = SCREEN_WIDTH,
    aspectRatio = 16 / 9,
    showNavButtons = true,
    onImagePress,
}: ImageCarouselProps) {
    const colors = useThemedColors();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    const handleImagePress = useCallback((uri: string, index: number) => {
        if (onImagePress) {
            onImagePress(uri, index);
        } else {
            setExpandedImage(uri);
        }
    }, [onImagePress]);

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

    if (!images || images.length === 0) {
        return (
            <View style={[styles.placeholder, { backgroundColor: colors.background.tertiary }]}>
                <ImageIcon size={48} color={colors.text.tertiary} />
            </View>
        );
    }

    const renderItem = ({ item, index }: { item: string; index: number }) => (
        <Pressable onPress={() => handleImagePress(item, index)}>
            <Image
                source={{ uri: item }}
                style={[styles.image, { width: imageWidth, aspectRatio }]}
                resizeMode="cover"
            />
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={images}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item}-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={imageWidth}
                snapToAlignment="center"
                decelerationRate="fast"
                disableIntervalMomentum
                onMomentumScrollEnd={(event) => {
                    const newIndex = Math.round(
                        event.nativeEvent.contentOffset.x / imageWidth
                    );
                    setCurrentIndex(newIndex);
                }}
                getItemLayout={(_, index) => ({
                    length: imageWidth,
                    offset: imageWidth * index,
                    index,
                })}
            />

            {/* Botones de navegación */}
            {showNavButtons && images.length > 1 && (
                <>
                    <Pressable onPress={goToPrevious} style={[styles.navButton, styles.navButtonLeft]}>
                        <ChevronLeft size={24} color="#FFFFFF" />
                    </Pressable>
                    <Pressable onPress={goToNext} style={[styles.navButton, styles.navButtonRight]}>
                        <ChevronRight size={24} color="#FFFFFF" />
                    </Pressable>
                </>
            )}

            {/* Indicadores */}
            {images.length > 1 && (
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
            )}

            {/* Modal para imagen expandida */}
            <Modal
                visible={expandedImage !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setExpandedImage(null)}
            >
                <Pressable
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => setExpandedImage(null)}
                >
                    <Pressable
                        style={{ position: 'absolute', top: 50, right: 20, zIndex: 10 }}
                        onPress={() => setExpandedImage(null)}
                    >
                        <X size={32} color="#FFFFFF" />
                    </Pressable>
                    {expandedImage && (
                        <Image
                            source={{ uri: expandedImage }}
                            style={{ width: '95%', height: '80%' }}
                            resizeMode="contain"
                        />
                    )}
                </Pressable>
            </Modal>
        </View>
    );
}
