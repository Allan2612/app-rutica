import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { DateColumn } from './DateColumn';
import { styles } from './styles';

interface EventDateSectionProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  errors?: { startDate?: string; endDate?: string };
}

export const EventDateSection = memo(function EventDateSection({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  errors = {},
}: EventDateSectionProps) {
  const colors = useThemedColors();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Fecha y Hora</Text>

      <View style={styles.dateRow}>
        <DateColumn
          label="Inicio"
          date={startDate}
          onDateChange={onStartDateChange}
          error={errors.startDate}
        />

        <DateColumn
          label="Fin"
          date={endDate}
          onDateChange={onEndDateChange}
          error={errors.endDate}
          minDate={startDate.toISOString().split('T')[0]}
        />
      </View>
    </View>
  );
});
