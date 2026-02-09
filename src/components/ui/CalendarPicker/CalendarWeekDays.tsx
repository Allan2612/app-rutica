import { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

interface CalendarWeekDaysProps {
  colors: any;
}

export const CalendarWeekDays = memo(function CalendarWeekDays({ colors }: CalendarWeekDaysProps) {
  return (
    <View style={styles.weekDaysRow}>
      {DAYS_OF_WEEK.map((dayName) => (
        <View key={dayName} style={styles.weekDayCell}>
          <Text style={[styles.weekDayText, { color: colors.text.tertiary }]}>{dayName}</Text>
        </View>
      ))}
    </View>
  );
});
