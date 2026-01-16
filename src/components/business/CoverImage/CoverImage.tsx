import { memo } from 'react';
import { View, Image, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import { styles } from './styles';

interface CoverImageProps {
    coverImage?: string | null;
    logoImage?: string | null;
    rating?: number;
    reviewCount?: number;
}

export const CoverImage = memo(({ coverImage, logoImage, rating = 0, reviewCount = 0 }: CoverImageProps) => {
    return (
        <View>
            {/* Cover Image */}
            <View style={styles.coverImageContainer}>
                {coverImage ? (
                    <Image
                        source={{ uri: coverImage }}
                        style={styles.coverImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholderCover} />
                )}
            </View>

            {/* Logo Overlay */}
            {logoImage && (
                <View style={styles.logoContainer}>
                    <Image source={{ uri: logoImage }} style={styles.logo} resizeMode="cover" />
                </View>
            )}

            {/* Rating Badge */}
            {rating > 0 && (
                <View style={styles.ratingBadge}>
                    <Star size={16} color="#fbbf24" fill="#fbbf24" />
                    <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
                    <Text style={styles.ratingCount}>({reviewCount})</Text>
                </View>
            )}
        </View>
    );
});

CoverImage.displayName = 'CoverImage';
