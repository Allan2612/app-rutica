import { memo, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';
import { IOSDateTimePickerModal } from './IOSDateTimePickerModal';

interface NativeDateTimeInputProps {
  date: Date;
  onDateChange: (date: Date) => void;
  icon: 'calendar-outline' | 'time-outline';
  type: 'date' | 'time';
  error?: string;
  minDate?: string;
  formatForDisplay: (date: Date) => string;
}

export const NativeDateTimeInput = memo(function NativeDateTimeInput({
  date,
  onDateChange,
  icon,
  type,
  error,
  minDate,
  formatForDisplay,
}: NativeDateTimeInputProps) {
  const colors = useThemedColors();
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(date);

  useEffect(() => {
    setTempDate(date);
  }, [date]);

  const handleNativeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
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
    } else if (Platform.OS === 'ios' && selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleIOSConfirm = () => {
    const newDate = new Date(date);
    if (type === 'date') {
      newDate.setFullYear(tempDate.getFullYear());
      newDate.setMonth(tempDate.getMonth());
      newDate.setDate(tempDate.getDate());
    } else {
      newDate.setHours(tempDate.getHours());
      newDate.setMinutes(tempDate.getMinutes());
    }
    onDateChange(newDate);
    setShowPicker(false);
  };

  const handleIOSCancel = () => {
    setTempDate(date);
    setShowPicker(false);
  };

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

      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={date}
          mode={type}
          is24Hour={true}
          display="default"
          onChange={handleNativeChange}
          minimumDate={minDate ? new Date(minDate) : undefined}
        />
      )}

      {Platform.OS === 'ios' && (
        <IOSDateTimePickerModal
          visible={showPicker}
          tempDate={tempDate}
          type={type}
          minDate={minDate}
          onConfirm={handleIOSConfirm}
          onCancel={handleIOSCancel}
          onChange={handleNativeChange}
        />
      )}
    </>
  );
});
