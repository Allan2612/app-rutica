import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from '../styles';

interface AttractionFooterProps {
    locationLabel?: string | null;
    hasLocation: boolean;
    onLocationPress: () => void;
}

export const AttractionFooter = memo(function AttractionFooter({
    locationLabel,
    hasLocation,
    onLocationPress,
}: AttractionFooterProps) {
    const colors = useThemedColors();

    return (
        <View style={[styles.footer, { borderTopColor: colors.border.light }]}>
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
