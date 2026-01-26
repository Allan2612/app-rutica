import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface EventPostFooterProps {
    locationLabel?: string | null;
    hasLocation: boolean;
    onLocationPress: () => void;
}

export const EventPostFooter = memo(function EventPostFooter({
    locationLabel,
    hasLocation,
    onLocationPress,
}: EventPostFooterProps) {
    const colors = useThemedColors();

    if (!hasLocation || !locationLabel) return null;

    return (
        <Pressable
            style={[styles.footer, { borderTopColor: colors.border.light }]}
            onPress={onLocationPress}
        >
            <View style={styles.footerItem}>
                <MapPin size={16} color={colors.primary[500]} />
                <Text style={[styles.footerText, { color: colors.primary[500] }]}>{locationLabel}</Text>
            </View>
        </Pressable>
    );
});
