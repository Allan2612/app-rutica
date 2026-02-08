/**
 * LocationSectionHeader Component
 * Beautiful section divider for location-split lists.
 * Shows "En [location]" for local items and "Otros lugares" for non-matching.
 */

import { memo } from 'react';
import { View, Text } from 'react-native';
import { MapPin, Globe2 } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface LocationSectionHeaderProps {
    /** 'local' for matching items, 'others' for non-matching */
    type: 'local' | 'others';
    /** Location name to display (e.g., "Pérez Zeledón") */
    locationName?: string;
    /** Number of items in this section */
    count: number;
    /** Entity label for the count badge (e.g., "comercios", "atracciones") */
    entityLabel?: string;
    /** Compact mode for horizontal carousel sections (home) */
    compact?: boolean;
}

export const LocationSectionHeader = memo(function LocationSectionHeader({
    type,
    locationName = '',
    count,
    entityLabel = 'resultados',
    compact = false,
}: LocationSectionHeaderProps) {
    const colors = useThemedColors();

    const isLocal = type === 'local';
    const IconComponent = isLocal ? MapPin : Globe2;
    const title = isLocal ? `En ${locationName}` : 'Otros lugares';

    // Colors based on type
    const accentColor = isLocal ? colors.primary[500] : (colors.isDark ? '#6b7280' : '#9ca3af');
    const iconBgColor = isLocal
        ? (colors.isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)')
        : (colors.isDark ? 'rgba(107, 114, 128, 0.15)' : 'rgba(156, 163, 175, 0.1)');
    const titleColor = isLocal ? colors.text.primary : colors.text.secondary;
    const badgeBgColor = isLocal
        ? (colors.isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.12)')
        : (colors.isDark ? 'rgba(107, 114, 128, 0.2)' : 'rgba(156, 163, 175, 0.12)');
    const borderColor = isLocal
        ? (colors.isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)')
        : 'transparent';

    if (compact) {
        return (
            <View style={styles.compactContainer}>
                <View style={[styles.compactIconWrapper, { backgroundColor: iconBgColor }]}>
                    <IconComponent size={12} color={accentColor} strokeWidth={2.5} />
                </View>
                <Text style={[styles.compactTitle, { color: titleColor }]} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={[styles.compactCount, { color: accentColor }]}>
                    ({count})
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: iconBgColor, borderLeftColor: borderColor }]}>
            <View style={styles.row}>
                <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
                    <IconComponent size={16} color={accentColor} strokeWidth={2.5} />
                </View>
                <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
                    {title}
                </Text>
                <View style={[styles.countBadge, { backgroundColor: badgeBgColor }]}>
                    <Text style={[styles.countText, { color: accentColor }]}>
                        {count} {entityLabel}
                    </Text>
                </View>
            </View>
        </View>
    );
});
