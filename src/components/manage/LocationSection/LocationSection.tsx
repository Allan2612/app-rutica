import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { LocationPicker } from '@/components/ui';
import { styles } from './styles';

interface LocationSectionProps {
    onLocationSelect: (location: {
        province?: string;
        canton?: string;
        district?: string;
        address?: string;
        latitude?: number;
        longitude?: number;
    }) => void;
    initialLatitude?: number;
    initialLongitude?: number;
    error?: string;
}

export const LocationSection = memo(function LocationSection({
    onLocationSelect,
    initialLatitude,
    initialLongitude,
    error,
}: LocationSectionProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Ubicación <Text style={styles.required}>*</Text>
            </Text>
            <LocationPicker
                onLocationSelect={onLocationSelect}
                initialLatitude={initialLatitude}
                initialLongitude={initialLongitude}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
});
