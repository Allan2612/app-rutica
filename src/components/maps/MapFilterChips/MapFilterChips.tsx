import { memo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedColors } from '@/hooks';
import { MARKER_COLORS, type MarkerType } from '@/features/maps/types';
import { spacing, typography } from '@/styles/theme';

export interface MarkerFilter {
    type: MarkerType;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const FILTER_OPTIONS: MarkerFilter[] = [
    { type: 'attraction', label: 'Atracciones', icon: 'compass' },
    { type: 'event', label: 'Eventos', icon: 'calendar' },
    { type: 'business', label: 'Negocios', icon: 'storefront' },
];

interface MapFilterChipsProps {
    selectedTypes: MarkerType[];
    onToggle: (type: MarkerType) => void;
}

export const MapFilterChips = memo(function MapFilterChips({
    selectedTypes,
    onToggle,
}: MapFilterChipsProps) {
    const colors = useThemedColors();

    const handlePress = useCallback((type: MarkerType) => {
        onToggle(type);
    }, [onToggle]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            {FILTER_OPTIONS.map((filter) => {
                const isSelected = selectedTypes.includes(filter.type);
                const markerColor = MARKER_COLORS[filter.type];

                return (
                    <TouchableOpacity
                        key={filter.type}
                        style={[
                            styles.chip,
                            {
                                backgroundColor: isSelected ? markerColor : colors.background.secondary,
                                borderColor: markerColor,
                            },
                        ]}
                        onPress={() => handlePress(filter.type)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={filter.icon}
                            size={14}
                            color={isSelected ? '#ffffff' : markerColor}
                        />
                        <Text
                            style={[
                                styles.chipText,
                                { color: isSelected ? '#ffffff' : colors.text.primary },
                            ]}
                        >
                            {filter.label}
                        </Text>
                        {isSelected && (
                            <Ionicons name="checkmark" size={12} color="#ffffff" />
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xs + 2,
        gap: spacing.xs + 2,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 16,
        borderWidth: 1,
        gap: spacing.xs - 2,
    },
    chipText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.medium,
    },
});

export default MapFilterChips;
