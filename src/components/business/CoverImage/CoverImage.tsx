import { memo } from 'react';
import { View, Image, Text, Pressable } from 'react-native';
import { Star } from 'lucide-react-native';
import { styles } from './styles';

interface CoverImageProps {
    coverImage?: string | null;
    logoImage?: string | null;
    rating?: number;
    reviewCount?: number;
    onCoverPress?: (imageUrl: string) => void;
    onLogoPress?: (imageUrl: string) => void;
}

export const CoverImage = memo(({ coverImage, logoImage, rating = 0, reviewCount = 0, onCoverPress, onLogoPress }: CoverImageProps) => {
    return (
        <View style={styles.container}>
            {/* Cover Image */}
            <View style={styles.coverImageContainer}>
                {coverImage ? (
                    <Pressable onPress={() => onCoverPress?.(coverImage)} style={{ width: '100%', height: '100%' }}>
                        <Image
                            source={{ uri: coverImage }}
                            style={styles.coverImage}
                            resizeMode="cover"
                        />
                    </Pressable>
                ) : (
                    <View style={styles.placeholderCover} />
                )}
            </View>

            {/* Logo Overlay */}
            {logoImage && (
                <Pressable onPress={() => onLogoPress?.(logoImage)} style={styles.logoContainer}>
                    <Image source={{ uri: logoImage }} style={styles.logo} resizeMode="cover" />
                </Pressable>
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
