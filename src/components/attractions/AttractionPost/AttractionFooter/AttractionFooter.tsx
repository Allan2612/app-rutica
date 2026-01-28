import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MapPin, Star } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from '../styles';

interface AttractionFooterProps {
    rating: number;
    reviewCount: number;
    locationLabel?: string | null;
    hasLocation: boolean;
    onLocationPress: () => void;
}

export const AttractionFooter = memo(function AttractionFooter({
    rating,
    reviewCount,
    locationLabel,
    hasLocation,
    onLocationPress,
}: AttractionFooterProps) {
    const colors = useThemedColors();

    return (
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
                    onPress={onLocationPress}
                    disabled={!hasLocation}
                >
                    <MapPin size={14} color={colors.primary[500]} />
                    <Text style={[styles.footerText, { color: colors.primary[500] }]}>
                        {locationLabel}
                    </Text>
                </Pressable>
            )}
        </View>
    );
});
