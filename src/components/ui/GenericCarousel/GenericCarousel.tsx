import { memo, useState, useRef, ReactNode, useCallback, useEffect } from 'react';
import { View, Pressable, Modal, Image, Dimensions, Platform, FlatList, ViewToken } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import type { PanGesture } from 'react-native-gesture-handler';
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

// Componente simple de carrusel usando FlatList para móvil
function SimpleMobileCarousel<T>({
    items,
    renderItem,
    showNavigation,
    showIndicators,
    autoScroll,
    autoScrollInterval,
    onIndexChange,
    onItemPress,
    enableImageModal,
    carouselWidth,
}: GenericCarouselProps<T> & { carouselWidth: number }) {
    const colors = useThemedColors();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const flatListRef = useRef<FlatList<T>>(null);
    const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Configurar auto scroll
    useEffect(() => {
        if (autoScroll && items.length > 1) {
            autoScrollTimerRef.current = setInterval(() => {
                const nextIndex = (currentIndex + 1) % items.length;
                flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            }, autoScrollInterval);
        }

        return () => {
            if (autoScrollTimerRef.current) {
                clearInterval(autoScrollTimerRef.current);
            }
        };
    }, [autoScroll, autoScrollInterval, currentIndex, items.length]);

    const handleViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0 && viewableItems[0].index != null) {
            setCurrentIndex(viewableItems[0].index);
            onIndexChange?.(viewableItems[0].index);
        }
    }, [onIndexChange]);

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const handleItemPress = (item: T, index: number) => {
        if (onItemPress) {
            onItemPress(item, index);
        } else if (enableImageModal && typeof item === 'string') {
            setExpandedImage(item as string);
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
        } else if (items.length > 1) {
            flatListRef.current?.scrollToIndex({ index: items.length - 1, animated: true });
        }
    };

    const goToNext = () => {
        if (currentIndex < items.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
        } else if (items.length > 1) {
            flatListRef.current?.scrollToIndex({ index: 0, animated: true });
        }
    };

    const goToIndex = (index: number) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
    };

    const getItemLayout = useCallback((_: unknown, index: number) => ({
        length: carouselWidth,
        offset: carouselWidth * index,
        index,
    }), [carouselWidth]);

    if (items.length === 0) {
        return null;
    }

    return (
        <View style={styles.carouselContainer}>
            <View style={{ width: carouselWidth, alignSelf: 'center', position: 'relative' }}>
                <FlatList
                    ref={flatListRef}
                    data={items}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={handleViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    getItemLayout={getItemLayout}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <Pressable
                            onPress={() => handleItemPress(item, index)}
                            disabled={!onItemPress && !enableImageModal}
                            style={{ width: carouselWidth, height: 280 }}
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
}

// Componente avanzado de carrusel usando react-native-reanimated-carousel para web
function ReanimatedCarousel<T>({
    items,
    renderItem,
    showNavigation,
    showIndicators,
    autoScroll,
    autoScrollInterval,
    onIndexChange,
    onItemPress,
    enableImageModal,
    carouselWidth,
}: GenericCarouselProps<T> & { carouselWidth: number }) {
    const colors = useThemedColors();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const carouselRef = useRef<ICarouselInstance>(null);

    const onSnapToItem = useCallback((index: number) => {
        setCurrentIndex(index);
        onIndexChange?.(index);
    }, [onIndexChange]);

    const handleConfigurePanGesture = useCallback((gesture: PanGesture) => {
        gesture.runOnJS(true);
        if (items.length <= 1) {
            gesture.enabled(false);
        }
    }, [items.length]);

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
                    onSnapToItem={onSnapToItem}
                    onConfigurePanGesture={handleConfigurePanGesture}
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
}

export const GenericCarousel = memo(function GenericCarousel<T>(props: GenericCarouselProps<T>) {
    const carouselWidth = Platform.OS === 'web' ? Math.min(SCREEN_WIDTH, 600) : SCREEN_WIDTH;

    // Usar el carrusel simple basado en FlatList en móvil para evitar crash
    // En web usar el carrusel avanzado de reanimated
    if (Platform.OS === 'web') {
        return <ReanimatedCarousel {...props} carouselWidth={carouselWidth} />;
    }

    return <SimpleMobileCarousel {...props} carouselWidth={carouselWidth} />;
}) as <T>(props: GenericCarouselProps<T>) => React.ReactElement;
