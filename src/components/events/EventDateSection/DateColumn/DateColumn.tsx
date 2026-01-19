import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { DateTimeInput } from '../DateTimeInput';
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
            
            <DateTimeInput
                date={date}
                onDateChange={onDateChange}
                icon="calendar-outline"
                type="date"
                label={`Fecha de ${label.toLowerCase()}`}
                error={error}
                minDate={minDate}
            />
            
            <DateTimeInput
                date={date}
                onDateChange={onDateChange}
                icon="time-outline"
                type="time"
                label={`Hora de ${label.toLowerCase()}`}
            />
            
            {error && (
                <Text style={[styles.error, { color: colors.error }]}>
                    {error}
                </Text>
            )}
        </View>
    );
});
