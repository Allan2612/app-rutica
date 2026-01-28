import { memo, useState, useRef, ReactNode, useCallback } from 'react';
import { View, Pressable, Modal, Image, Dimensions, Platform } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface GenericCarouselProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    showNavigation?: boolean;
    showIndicators?: boolean;
    autoScroll?: boolean;
    autoScrollInterval?: number;
    onIndexChange?: (index: number) => void;
    onItemPress?: (item: T, index: number) => void;
    enableImageModal?: boolean;
}

export const GenericCarousel = memo(function GenericCarousel<T>({
    items,
    renderItem,
    showNavigation = true,
    showIndicators = true,
    autoScroll = true,
    autoScrollInterval = 3000,
    onIndexChange,
    onItemPress,
    enableImageModal = false,
}: GenericCarouselProps<T>) {
    const colors = useThemedColors();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const carouselRef = useRef<ICarouselInstance>(null);
    const progressValue = useSharedValue<number>(0);

    const carouselWidth = Platform.OS === 'web' ? Math.min(SCREEN_WIDTH, 600) : SCREEN_WIDTH;

    const onProgressChange = useCallback((offsetProgress: number, absoluteProgress: number) => {
        progressValue.value = absoluteProgress;
        const newIndex = Math.round(absoluteProgress) % items.length;
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
            onIndexChange?.(newIndex);
        }
    }, [currentIndex, items.length, onIndexChange, progressValue]);

    const goToPrevious = () => {
        carouselRef.current?.prev();
    };

    const goToNext = () => {
        carouselRef.current?.next();
    };

    const goToIndex = (index: number) => {
        carouselRef.current?.scrollTo({ index, animated: true });
    };

    const handleItemPress = (item: T, index: number) => {
        if (onItemPress) {
            onItemPress(item, index);
        } else if (enableImageModal && typeof item === 'string') {
            setExpandedImage(item as string);
        }
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <View style={styles.carouselContainer}>
            {/* Carrusel */}
            <View style={{ width: carouselWidth, alignSelf: 'center', position: 'relative' }}>
                <Carousel
                    ref={carouselRef}
                    width={carouselWidth}
                    height={280}
                    data={items}
                    autoPlay={autoScroll && items.length > 1}
                    autoPlayInterval={autoScrollInterval}
                    loop={items.length > 1}
                    scrollAnimationDuration={600}
                    onProgressChange={onProgressChange}
                    renderItem={({ item, index }) => (
                        <Pressable
                            onPress={() => handleItemPress(item, index)}
                            disabled={!onItemPress && !enableImageModal}
                            style={{ width: carouselWidth, height: '100%' }}
                        >
                            {renderItem(item, index)}
                        </Pressable>
                    )}
                />

                {/* Botón Anterior */}
                {showNavigation && items.length > 1 && (
                    <Pressable
                        style={[styles.navButton, styles.navButtonLeft, { backgroundColor: colors.background.primary }]}
                        onPress={goToPrevious}
                    >
                        <ChevronLeft size={24} color={colors.text.primary} strokeWidth={2.5} />
                    </Pressable>
                )}

                {/* Botón Siguiente */}
                {showNavigation && items.length > 1 && (
                    <Pressable
                        style={[styles.navButton, styles.navButtonRight, { backgroundColor: colors.background.primary }]}
                        onPress={goToNext}
                    >
                        <ChevronRight size={24} color={colors.text.primary} strokeWidth={2.5} />
                    </Pressable>
                )}
            </View>

            {/* Indicadores de página */}
            {showIndicators && items.length > 1 && (
                <View style={styles.indicators}>
                    {items.map((_, index) => (
                        <Pressable
                            key={index}
                            style={[
                                styles.indicator,
                                {
                                    backgroundColor: index === currentIndex
                                        ? colors.primary[500]
                                        : colors.border.medium,
                                },
                            ]}
                            onPress={() => goToIndex(index)}
                        />
                    ))}
                </View>
            )}

            {/* Modal para imagen expandida */}
            {enableImageModal && (
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
            )}
        </View>
    );
}) as <T>(props: GenericCarouselProps<T>) => React.ReactElement;
