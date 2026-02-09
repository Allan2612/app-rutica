import { memo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface WebDateTimeInputProps {
  date: Date;
  onDateChange: (date: Date) => void;
  icon: 'calendar-outline' | 'time-outline';
  type: 'date' | 'time';
  error?: string;
  minDate?: string;
  formatForInput: (date: Date) => string;
  formatForDisplay: (date: Date) => string;
}

export const WebDateTimeInput = memo(function WebDateTimeInput({
  date,
  onDateChange,
  icon,
  type,
  error,
  minDate,
  formatForInput,
  formatForDisplay,
}: WebDateTimeInputProps) {
  const colors = useThemedColors();
  const inputRef = useRef<HTMLInputElement>(null);

  // Inyectar estilos CSS para el datepicker
  useEffect(() => {
    const styleId = 'datepicker-theme';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

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
  }, [colors.isDark, colors.text.primary]);

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
        {icon === 'calendar-outline' ? (
          <Calendar size={20} color={colors.text.primary} />
        ) : (
          <Clock size={20} color={colors.text.primary} />
        )}
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
});
