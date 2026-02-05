import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from './styles';
import { PERIOD_OPTIONS } from '@/styles/premium-section-styles';
import type { PeriodFilterProps } from '../../../../../../types/entities/premium';

export const PeriodFilter = memo(function PeriodFilter({
    selectedPeriod,
    onSelectPeriod,
    colors,
}: PeriodFilterProps) {
    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
                Período
            </Text>
            <View style={styles.buttons}>
                {PERIOD_OPTIONS.map((period) => (
                    <Pressable
                        key={period}
                        style={[
                            styles.button,
                            {
                                backgroundColor: selectedPeriod === period
                                    ? colors.primary[500]
                                    : colors.background.primary,
                                borderColor: selectedPeriod === period
                                    ? colors.primary[500]
                                    : colors.border.light,
                            },
                        ]}
                        onPress={() => onSelectPeriod(period)}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                {
                                    color: selectedPeriod === period ? '#ffffff' : colors.text.secondary,
                                },
                            ]}
                        >
                            {period} días
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
});
