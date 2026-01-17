import { memo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { MapPin, Star, Mountain } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';
import { getCategoryColorScheme } from '@/utils/categoryColors';

export interface AttractionPostProps {
    name: string;
    description?: string | null;
    categoryNames?: string[];
    categoryIds?: string[];
    locationLabel?: string | null;
    imageUrl?: string | null;
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

export const AttractionPost = memo(function AttractionPost({
    name,
    description,
    categoryNames = [],
    categoryIds = [],
    locationLabel,
    imageUrl,
    authorName,
    rating = 0,
    reviewCount = 0,
    isApproved = false,
    createdAt,
    onPress,
}: AttractionPostProps) {
    const colors = useThemedColors();

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
                    <Text style={[styles.metaText, { color: colors.text.tertiary }]}>
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

            {/* Imagen principal */}
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
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
                        <Text style={[styles.footerText, { color: colors.text.secondary }]}>
                            {rating.toFixed(1)} ({reviewCount})
                        </Text>
                    </View>
                )}
                {locationLabel && (
                    <View style={styles.footerItem}>
                        <MapPin size={14} color={colors.text.tertiary} />
                        <Text style={[styles.footerText, { color: colors.text.tertiary }]}>
                            {locationLabel}
                        </Text>
                    </View>
                )}
            </View>
        </Pressable>
    );
});
