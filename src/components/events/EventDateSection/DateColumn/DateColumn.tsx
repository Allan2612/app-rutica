import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { SimpleDateTimeInput } from '@/components/ui';
import { styles } from './styles';

interface DateColumnProps {
  label: string;
  date: Date;
  onDateChange: (date: Date) => void;
  error?: string;
  minDate?: string;
}

export const DateColumn = memo(function DateColumn({
  label,
  date,
  onDateChange,
  error,
  minDate,
}: DateColumnProps) {
  const colors = useThemedColors();

  return (
    <View style={styles.column}>
      <Text style={[styles.label, { color: colors.text.primary }]}>
        {label} <Text style={{ color: colors.error }}>*</Text>
      </Text>

      <SimpleDateTimeInput
        date={date}
        onDateChange={onDateChange}
        type="date"
        error={error}
        minDate={minDate}
      />

      <SimpleDateTimeInput date={date} onDateChange={onDateChange} type="time" />

      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
});
