import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react-native';
import { styles } from './styles';

interface CalendarHeaderProps {
    month: number;
    year: number;
    monthName: string;
    canGoPrevious: boolean;
    colors: any;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onMonthPress: () => void;
    onYearPress: () => void;
}

export const CalendarHeader = memo(function CalendarHeader({
    month,
    year,
    monthName,
    canGoPrevious,
    colors,
    onPreviousMonth,
    onNextMonth,
    onMonthPress,
    onYearPress,
}: CalendarHeaderProps) {
    return (
        <View style={styles.header}>
            <Pressable
                onPress={onPreviousMonth}
                style={[
                    styles.navButton,
                    !canGoPrevious && styles.navButtonDisabled,
                ]}
                disabled={!canGoPrevious}
            >
                <ChevronLeft
                    size={24}
                    color={canGoPrevious ? colors.text.primary : colors.text.tertiary}
                />
            </Pressable>

            <Pressable style={styles.monthYearButton} onPress={onMonthPress}>
                <Text style={[styles.monthYearText, { color: colors.text.primary }]}>
                    {monthName}
                </Text>
                <ChevronDown size={16} color={colors.text.secondary} />
            </Pressable>

            <Pressable style={styles.monthYearButton} onPress={onYearPress}>
                <Text style={[styles.monthYearText, { color: colors.text.primary }]}>
                    {year}
                </Text>
                <ChevronDown size={16} color={colors.text.secondary} />
            </Pressable>

            <Pressable onPress={onNextMonth} style={styles.navButton}>
                <ChevronRight size={24} color={colors.text.primary} />
            </Pressable>
        </View>
    );
});
