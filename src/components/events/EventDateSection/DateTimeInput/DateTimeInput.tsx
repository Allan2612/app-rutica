import { memo, useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

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
    const colors = useThemedColors();
    const [showPicker, setShowPicker] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Inyectar estilos CSS para el datepicker en web
    useEffect(() => {
        if (Platform.OS === 'web') {
            const styleId = 'datepicker-theme';
            let styleElement = document.getElementById(styleId) as HTMLStyleElement;
            
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = styleId;
                document.head.appendChild(styleElement);
            }
            
            // Actualizar estilos según el tema actual
            styleElement.textContent = `
                input[type="date"],
                input[type="time"] {
                    color-scheme: ${colors.isDark ? 'dark' : 'light'};
                }
                
                input[type="date"]::-webkit-calendar-picker-indicator,
                input[type="time"]::-webkit-calendar-picker-indicator {
                    ${colors.isDark ? 'filter: invert(1);' : ''}
                    cursor: pointer;
                }
                
                input[type="date"]::-webkit-datetime-edit-text,
                input[type="date"]::-webkit-datetime-edit-month-field,
                input[type="date"]::-webkit-datetime-edit-day-field,
                input[type="date"]::-webkit-datetime-edit-year-field,
                input[type="time"]::-webkit-datetime-edit-text,
                input[type="time"]::-webkit-datetime-edit-hour-field,
                input[type="time"]::-webkit-datetime-edit-minute-field,
                input[type="time"]::-webkit-datetime-edit-ampm-field {
                    color: ${colors.text.primary};
                }
            `;
        }
    }, [colors.isDark, colors.text.primary]);

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

    const handleWebChange = (value: string) => {
        if (type === 'date') {
            const [year, month, day] = value.split('-').map(Number);
            const newDate = new Date(date);
            newDate.setFullYear(year);
            newDate.setMonth(month - 1);
            newDate.setDate(day);
            onDateChange(newDate);
        } else {
            const [hours, minutes] = value.split(':').map(Number);
            const newDate = new Date(date);
            newDate.setHours(hours);
            newDate.setMinutes(minutes);
            onDateChange(newDate);
        }
    };

    const handleNativeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }
        
        if (event.type === 'set' && selectedDate) {
            const newDate = new Date(date);
            if (type === 'date') {
                newDate.setFullYear(selectedDate.getFullYear());
                newDate.setMonth(selectedDate.getMonth());
                newDate.setDate(selectedDate.getDate());
            } else {
                newDate.setHours(selectedDate.getHours());
                newDate.setMinutes(selectedDate.getMinutes());
            }
            onDateChange(newDate);
        }
        
        if (event.type === 'dismissed' || Platform.OS === 'ios') {
            setShowPicker(false);
        }
    };

    if (Platform.OS === 'web') {
        return (
            <TouchableOpacity
                style={[
                    styles.dateButton,
                    {
                        backgroundColor: colors.background.secondary,
                        borderColor: error ? colors.error : colors.border.medium,
                    },
                ]}
                onPress={() => inputRef.current?.showPicker?.()}
                activeOpacity={0.7}
            >
                <View style={styles.dateButtonContent}>
                    <Ionicons name={icon} size={20} color={colors.text.primary} />
                    <Text style={[styles.dateText, { color: colors.text.primary }]}>
                        {formatForDisplay(date)}
                    </Text>
                </View>
                <input
                    ref={inputRef as any}
                    type={type}
                    style={styles.hiddenInput}
                    value={formatForInput(date)}
                    onChange={(e) => handleWebChange(e.target.value)}
                    min={minDate}
                />
            </TouchableOpacity>
        );
    }

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.dateButton,
                    {
                        backgroundColor: colors.background.secondary,
                        borderColor: error ? colors.error : colors.border.medium,
                    },
                ]}
                onPress={() => setShowPicker(true)}
            >
                <View style={styles.dateButtonContent}>
                    <Ionicons name={icon} size={20} color={colors.text.primary} />
                    <Text style={[styles.dateText, { color: colors.text.primary }]}>
                        {formatForDisplay(date)}
                    </Text>
                </View>
            </TouchableOpacity>
            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode={type}
                    is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleNativeChange}
                    minimumDate={minDate ? new Date(minDate) : undefined}
                    themeVariant={colors.isDark ? 'dark' : 'light'}
                    textColor={colors.text.primary}
                    accentColor={colors.primary[500]}
                />
            )}
        </>
    );
});
