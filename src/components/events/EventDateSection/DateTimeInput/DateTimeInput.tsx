import { memo } from 'react';
import { Platform } from 'react-native';
import { WebDateTimeInput } from './WebDateTimeInput';
import { NativeDateTimeInput } from './NativeDateTimeInput';

interface DateTimeInputProps {
    date: Date;
    onDateChange: (date: Date) => void;
    icon: 'calendar-outline' | 'time-outline';
    type: 'date' | 'time';
    label: string;
    error?: string;
    minDate?: string;
}

export const DateTimeInput = memo(function DateTimeInput({
    date,
    onDateChange,
    icon,
    type,
    label,
    error,
    minDate,
}: DateTimeInputProps) {
    const formatForInput = (date: Date) => {
        if (type === 'date') {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } else {
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        }
    };

    const formatForDisplay = (date: Date) => {
        if (type === 'date') {
            return date.toLocaleDateString('es-CR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } else {
            return date.toLocaleTimeString('es-CR', {
                hour: '2-digit',
                minute: '2-digit',
            });
        }
    };

    if (Platform.OS === 'web') {
        return (
            <WebDateTimeInput
                date={date}
                onDateChange={onDateChange}
                icon={icon}
                type={type}
                error={error}
                minDate={minDate}
                formatForInput={formatForInput}
                formatForDisplay={formatForDisplay}
            />
        );
    }

    return (
        <NativeDateTimeInput
            date={date}
            onDateChange={onDateChange}
            icon={icon}
            type={type}
            error={error}
            minDate={minDate}
            formatForDisplay={formatForDisplay}
        />
    );
});
