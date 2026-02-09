import { memo, useState, useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { useThemedColors } from '@/hooks';
import { CalendarHeader } from './CalendarHeader';
import { CalendarWeekDays } from './CalendarWeekDays';
import { CalendarDaysGrid } from './CalendarDaysGrid';
import { PickerModal } from './PickerModal';
import { styles } from './styles';

interface CalendarPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  minDate?: Date;
}

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const currentYear = new Date().getFullYear();
const YEARS = [currentYear, currentYear + 1];

export const CalendarPicker = memo(function CalendarPicker({
  selectedDate,
  onDateChange,
  minDate,
}: CalendarPickerProps) {
  const colors = useThemedColors();
  const [viewDate, setViewDate] = useState(() => new Date(selectedDate));
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);
    return days;
  }, [year, month]);

  const monthItems = useMemo(
    () => MONTHS.map((name, i) => ({ value: i, label: name.substring(0, 3) })),
    [],
  );

  const yearItems = useMemo(() => YEARS.map((y) => ({ value: y, label: String(y) })), []);

  const canGoPrevious = useMemo(() => {
    if (!minDate) return true;
    const previousMonth = new Date(year, month - 1, 1);
    return previousMonth >= new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  }, [year, month, minDate]);

  const isDisabled = useCallback(
    (day: number) => {
      if (!minDate) return false;
      const date = new Date(year, month, day);
      return date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    },
    [year, month, minDate],
  );

  const isMonthDisabled = useCallback(
    (monthIndex: number) => {
      if (!minDate) return false;
      return new Date(year, monthIndex + 1, 0) < minDate;
    },
    [year, minDate],
  );

  const isYearDisabled = useCallback(
    (checkYear: number) => {
      if (!minDate) return false;
      return checkYear < minDate.getFullYear();
    },
    [minDate],
  );

  const handleDayPress = useCallback(
    (day: number) => {
      const newDate = new Date(year, month, day);
      if (minDate && newDate < minDate) return;
      onDateChange(newDate);
    },
    [year, month, minDate, onDateChange],
  );

  const handleMonthSelect = useCallback((selectedMonth: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), selectedMonth, 1));
    setShowMonthPicker(false);
  }, []);

  const handleYearSelect = useCallback((selectedYear: number) => {
    setViewDate((prev) => new Date(selectedYear, prev.getMonth(), 1));
    setShowYearPicker(false);
  }, []);

  return (
    <View style={styles.container}>
      <CalendarHeader
        month={month}
        year={year}
        monthName={MONTHS[month]}
        canGoPrevious={canGoPrevious}
        colors={colors}
        onPreviousMonth={() =>
          setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
        }
        onNextMonth={() =>
          setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
        }
        onMonthPress={() => setShowMonthPicker(true)}
        onYearPress={() => setShowYearPicker(true)}
      />

      <CalendarWeekDays colors={colors} />

      <CalendarDaysGrid
        calendarDays={calendarDays}
        selectedDate={selectedDate}
        month={month}
        year={year}
        colors={colors}
        isDisabled={isDisabled}
        onDayPress={handleDayPress}
      />

      <PickerModal
        visible={showMonthPicker}
        title="Seleccionar Mes"
        items={monthItems}
        selectedValue={month}
        colors={colors}
        isDisabled={isMonthDisabled}
        onSelect={handleMonthSelect}
        onClose={() => setShowMonthPicker(false)}
      />

      <PickerModal
        visible={showYearPicker}
        title="Seleccionar Año"
        items={yearItems}
        selectedValue={year}
        colors={colors}
        isDisabled={isYearDisabled}
        onSelect={handleYearSelect}
        onClose={() => setShowYearPicker(false)}
      />
    </View>
  );
});
