/**
 * NoLocalResultsPlaceholder Component
 * Shown when there are no items matching the selected location.
 * Themed, with animated-feel icon and helpful message.
 * Compact mode (home carousels): one quiet line, the carousel of other places follows.
 */

import { memo } from 'react';
import { View, Text } from 'react-native';
import { MapPinOff, Navigation } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface NoLocalResultsPlaceholderProps {
  /** Name of the selected location (e.g., "Pérez Zeledón") */
  locationName: string;
  /** Entity label, e.g. "comercios", "atracciones" */
  entityLabel: string;
  /** Compact mode for inline use in home sections */
  compact?: boolean;
}

export const NoLocalResultsPlaceholder = memo(function NoLocalResultsPlaceholder({
  locationName,
  entityLabel,
  compact = false,
}: NoLocalResultsPlaceholderProps) {
  const colors = useThemedColors();

  const iconBg = colors.isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)';
  const accentColor = colors.primary[500];
  const ringColor = colors.isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)';

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <MapPinOff size={14} color={accentColor} strokeWidth={2} />
        <Text style={[styles.compactText, { color: colors.text.secondary }]}>
          Sin {entityLabel} en {locationName} todavía · te mostramos otros lugares
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Ring decorativo */}
      <View style={[styles.iconRing, { borderColor: ringColor }]}>
        <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
          <MapPinOff size={28} color={accentColor} strokeWidth={1.75} />
        </View>
      </View>

      <Text style={[styles.title, { color: colors.text.primary }]}>
        Sin {entityLabel} en {locationName}
      </Text>

      <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
        No encontramos {entityLabel} registrados en esta ubicación todavía
      </Text>

      <View style={[styles.hintRow, { backgroundColor: iconBg }]}>
        <Navigation size={13} color={accentColor} strokeWidth={2} />
        <Text style={[styles.hintText, { color: colors.text.tertiary }]}>
          Explora los resultados de otros lugares más abajo
        </Text>
      </View>
    </View>
  );
});
