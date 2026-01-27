import { memo, useState, useEffect, ReactNode, useRef } from 'react';
import { View, Pressable, Animated, Modal, Image } from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

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
    const slideAnim = useRef(new Animated.Value(0)).current;

    const animateSlide = (toValue: number) => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: toValue * -50,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start(() => {
            slideAnim.setValue(toValue * 50);
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    useEffect(() => {
        if (!autoScroll || items.length <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % items.length;
                animateSlide(1);
                return nextIndex;
            });
        }, autoScrollInterval);

        return () => clearInterval(interval);
    }, [autoScroll, autoScrollInterval, items.length]);

    const goToPrevious = () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        animateSlide(-1);
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const newIndex = (currentIndex + 1) % items.length;
        animateSlide(1);
        setCurrentIndex(newIndex);
    };

    const goToIndex = (index: number) => {
        setCurrentIndex(index);
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
            {/* Botón Anterior */}
            {showNavigation && items.length > 1 && (
                <Pressable
                    style={[styles.navButton, styles.navButtonLeft, { backgroundColor: colors.background.primary }]}
                    onPress={goToPrevious}
                >
                    <ChevronLeft size={24} color={colors.text.primary} strokeWidth={2.5} />
                </Pressable>
            )}

            {/* Item actual */}
            <View style={styles.cardContainer}>
                <Pressable 
                    onPress={() => handleItemPress(items[currentIndex], currentIndex)}
                    disabled={!onItemPress && !enableImageModal}
                >
                    {renderItem(items[currentIndex], currentIndex)}
                </Pressable>
            </View>

            {/* Botón Siguiente */}
            {showNavigation && items.length > 1 && (
                <Pressable
                    style={[styles.navButton, styles.navButtonRight, { backgroundColor: colors.background.primary }]}
                    onPress={goToNext}
                >
                    <ChevronRight size={24} color={colors.text.primary} strokeWidth={2.5} />
                </Pressable>
            )}

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
