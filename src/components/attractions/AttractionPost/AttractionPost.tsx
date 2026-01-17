import { memo, useState, useRef } from 'react';
import { Image, Pressable, Text, View, ScrollView, Dimensions, Linking, Platform } from 'react-native';
import { MapPin, Star, Mountain } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';
import { getCategoryColorScheme } from '@/utils/categoryColors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface AttractionPostProps {
    name: string;
    description?: string | null;
    categoryNames?: string[];
    categoryIds?: string[];
    locationLabel?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    imageUrls?: string[];
    authorName?: string | null;
    rating?: number;
    reviewCount?: number;
    isApproved?: boolean;
    createdAt?: string;
    onPress?: () => void;
}

function getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-CR', { day: 'numeric', month: 'short' });
}

function getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

function openMaps(latitude: number, longitude: number, label?: string) {
    const encodedLabel = encodeURIComponent(label ?? 'Ubicación');
    const url = Platform.select({
        ios: `maps:0,0?q=${encodedLabel}@${latitude},${longitude}`,
        android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodedLabel})`,
        default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });
    Linking.openURL(url);
}

export const AttractionPost = memo(function AttractionPost({
    name,
    description,
    categoryNames = [],
    categoryIds = [],
    locationLabel,
    latitude,
    longitude,
    imageUrls = [],
    authorName,
    rating = 0,
    reviewCount = 0,
    isApproved = false,
    createdAt,
    onPress,
}: AttractionPostProps) {
    const colors = useThemedColors();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const scrollRef = useRef<ScrollView>(null);

    const handleScroll = (event: any) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const imageWidth = event.nativeEvent.layoutMeasurement.width;
        const index = Math.round(contentOffset / imageWidth);
        setActiveImageIndex(index);
    };

    const handleLocationPress = () => {
        if (latitude && longitude) {
            openMaps(latitude, longitude, locationLabel ?? name);
        }
    };

    const hasLocation = latitude !== null && latitude !== undefined && longitude !== null && longitude !== undefined;

    return (
        <Pressable
            style={[styles.post, { backgroundColor: colors.background.primary, borderColor: colors.border.medium }]}
            onPress={onPress}
            disabled={!onPress}
        >
            {/* Header con autor */}
            <View style={styles.header}>
                <View style={[styles.avatar, { backgroundColor: colors.primary[100] }]}>
                    {authorName ? (
                        <Text style={[styles.avatarText, { color: colors.primary[700] }]}>
                            {getInitials(authorName)}
                        </Text>
                    ) : (
                        <Mountain size={20} color={colors.primary[600]} />
                    )}
                </View>
                <View style={styles.headerInfo}>
                    <Text style={[styles.authorName, { color: colors.text.primary }]}>
                        {authorName ?? 'Rutica'}
                    </Text>
                    <Text style={[styles.metaText, { color: colors.text.primary }]}>
                        {createdAt ? getTimeAgo(createdAt) : ''}
                        {locationLabel ? ` • ${locationLabel}` : ''}
                    </Text>
                </View>
                {isApproved && (
                    <Image
                        source={require('../../../../assets/verification.png')}
                        style={{ width: 20, height: 20 }}
                        resizeMode="contain"
                    />
                )}
            </View>

            {/* Carrusel de imágenes */}
            {imageUrls.length > 0 ? (
                <View>
                    <ScrollView
                        ref={scrollRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {imageUrls.map((uri, index) => (
                            <Image
                                key={index}
                                source={{ uri }}
                                style={[styles.image, { width: SCREEN_WIDTH - 32 }]}
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>
                    {/* Indicadores de página */}
                    {imageUrls.length > 1 && (
                        <View style={styles.pagination}>
                            {imageUrls.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.paginationDot,
                                        {
                                            backgroundColor: index === activeImageIndex
                                                ? colors.primary[500]
                                                : 'rgba(255,255,255,0.5)',
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                    )}
                </View>
            ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: colors.background.tertiary }]}>
                    <Mountain size={48} color={colors.text.tertiary} />
                </View>
            )}

            {/* Contenido */}
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text.primary }]}>{name}</Text>
                {description && (
                    <Text style={[styles.description, { color: colors.text.secondary }]} numberOfLines={3}>
                        {description}
                    </Text>
                )}

                {/* Categorías */}
                {categoryNames.length > 0 && (
                    <View style={styles.categoriesRow}>
                        {categoryNames.slice(0, 3).map((catName, index) => {
                            const categoryColor = getCategoryColorScheme(categoryIds[index]);
                            return (
                                <View
                                    key={index}
                                    style={[styles.categoryChip, { backgroundColor: categoryColor.backgroundColor }]}
                                >
                                    <Text style={[styles.categoryText, { color: categoryColor.textColor }]}>
                                        {catName}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>

            {/* Footer con rating y ubicación */}
            <View style={[styles.footer, { borderTopColor: colors.border.light }]}>
                {rating > 0 && (
                    <View style={styles.footerItem}>
                        <Star size={16} color="#fbbf24" fill="#fbbf24" />
                        <Text style={[styles.footerText, { color: colors.text.primary }]}>
                            {rating.toFixed(1)} ({reviewCount})
                        </Text>
                    </View>
                )}
                {locationLabel && (
                    <Pressable
                        style={styles.footerItem}
                        onPress={handleLocationPress}
                        disabled={!hasLocation}
                    >
                        <MapPin size={14} color={colors.primary[500]} />
                        <Text style={[styles.footerText, { color: colors.primary[500] }]}>
                            {locationLabel}
                        </Text>
                    </Pressable>
                )}
            </View>
        </Pressable>
    );
});
