import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from './CalendarPicker.styles';

interface CalendarDaysGridProps {
    calendarDays: (number | null)[];
    selectedDate: Date;
    month: number;
    year: number;
    colors: any;
    isDisabled: (day: number) => boolean;
    onDayPress: (day: number) => void;
}

export const CalendarDaysGrid = memo(function CalendarDaysGrid({
    calendarDays,
    selectedDate,
    month,
    year,
    colors,
    isDisabled,
    onDayPress,
}: CalendarDaysGridProps) {
    const isSelectedDay = (day: number) => {
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year
        );
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year
        );
    };

    return (
        <View style={styles.daysGrid}>
            {calendarDays.map((day, index) => (
                <View key={index} style={styles.dayCell}>
                    {day !== null && (
                        <Pressable
                            onPress={() => onDayPress(day)}
                            disabled={isDisabled(day)}
                            style={({ pressed }) => [
                                styles.dayButton,
                                isSelectedDay(day) && [
                                    styles.selectedDay,
                                    { backgroundColor: colors.primary[500] },
                                ],
                                isToday(day) && !isSelectedDay(day) && [
                                    styles.todayDay,
                                    { borderColor: colors.primary[500] },
                                ],
                                isDisabled(day) && styles.disabledDay,
                                pressed && !isDisabled(day) && { opacity: 0.7 },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.dayText,
                                    { color: colors.text.primary },
                                    isSelectedDay(day) && styles.selectedDayText,
                                    isDisabled(day) && { color: colors.text.tertiary },
                                ]}
                            >
                                {day}
                            </Text>
                        </Pressable>
                    )}
                </View>
            ))}
        </View>
    );
});
