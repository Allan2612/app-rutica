import { memo, useCallback } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Compass, Calendar, Store, MapPin, Check, type LucideIcon } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { MARKER_COLORS, USER_MARKER_COLOR, type MarkerType } from '@/features/maps/types';
import { spacing, typography } from '@/styles/theme';

export interface MarkerFilter {
  type: MarkerType;
  label: string;
  icon: LucideIcon;
}

const FILTER_OPTIONS: MarkerFilter[] = [
  { type: 'attraction', label: 'Atracciones', icon: Compass },
  { type: 'event', label: 'Eventos', icon: Calendar },
  { type: 'business', label: 'Negocios', icon: Store },
];

interface MapFilterChipsProps {
  selectedTypes: MarkerType[];
  onToggle: (type: MarkerType) => void;
  showUserLocation: boolean;
  onToggleUserLocation: () => void;
}

export const MapFilterChips = memo(function MapFilterChips({
  selectedTypes,
  onToggle,
  showUserLocation,
  onToggleUserLocation,
}: MapFilterChipsProps) {
  const colors = useThemedColors();

  const handlePress = useCallback(
    (type: MarkerType) => {
      onToggle(type);
    },
    [onToggle],
  );

  const renderChips = () => (
    <>
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
            <filter.icon size={14} color={isSelected ? '#ffffff' : markerColor} strokeWidth={2.5} />
            <Text
              style={[styles.chipText, { color: isSelected ? '#ffffff' : colors.text.primary }]}
            >
              {filter.label}
            </Text>
            {isSelected && <Check size={12} color="#ffffff" strokeWidth={2.5} />}
          </TouchableOpacity>
        );
      })}

      {/* Filtro de Mi Ubicación */}
      <TouchableOpacity
        style={[
          styles.chip,
          {
            backgroundColor: showUserLocation ? USER_MARKER_COLOR : colors.background.secondary,
            borderColor: USER_MARKER_COLOR,
          },
        ]}
        onPress={onToggleUserLocation}
        activeOpacity={0.7}
      >
        <MapPin
          size={14}
          color={showUserLocation ? '#ffffff' : USER_MARKER_COLOR}
          strokeWidth={2.5}
        />
        <Text
          style={[styles.chipText, { color: showUserLocation ? '#ffffff' : colors.text.primary }]}
        >
          Mi ubicación
        </Text>
        {showUserLocation && <Check size={12} color="#ffffff" strokeWidth={2.5} />}
      </TouchableOpacity>
    </>
  );

  // En móvil, usar ScrollView horizontal
  if (Platform.OS !== 'web') {
    return (
      <View style={[styles.wrapper, { backgroundColor: colors.background.primary }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {renderChips()}
        </ScrollView>
      </View>
    );
  }

  // En web, usar flexbox normal
  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {renderChips()}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: spacing.xs + 2,
  },
  scrollView: {
    flexGrow: 0,
    flexShrink: 0,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs + 2,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    gap: spacing.xs + 2,
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.xs - 2,
    flexShrink: 0,
  },
  chipText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
    flexShrink: 0,
  },
});

export default MapFilterChips;
