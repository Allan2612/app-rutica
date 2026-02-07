import { memo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Activity, MousePointerClick, Clock } from 'lucide-react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { styles } from './styles';
import type { ChartDataItem, PeriodType, ThemedColors } from '../../../../../../../../types/entities/premium';

interface ContactsTrendChartProps {
    colors: ThemedColors;
    contactLineData: ChartDataItem[];
    period: PeriodType;
}

export const ContactsTrendChart = memo(function ContactsTrendChart({
    colors,
    contactLineData,
    period,
}: ContactsTrendChartProps) {
    // Filtrar solo los días con actividad (valor > 0)
    const activeDays = contactLineData.filter(item => item.value > 0);

    if (activeDays.length === 0) return null;

    return (
        <View style={[styles.chartCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
            <View style={styles.chartHeader}>
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                    <Activity color="#8b5cf6" size={20} strokeWidth={2} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.chartTitle, { color: colors.text.primary }]}>Actividad de Interacciones</Text>
                    <Text style={[styles.chartSubtitle, { color: colors.text.secondary, marginBottom: 0 }]}>
                        {activeDays.length} {activeDays.length === 1 ? 'día' : 'días'} con actividad en los últimos {period} días
                    </Text>
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.daysContainer}
            >
                {activeDays.map((day, index) => {
                    // Formatear label con mes completo
                    let formattedLabel = day.label;
                    let timeLabel = '';

                    if (day.label.includes(':')) {
                        // Si el label ya incluye hora (formato: "30 - 14:00")
                        const parts = day.label.split(' - ');
                        formattedLabel = parts[0];
                        timeLabel = parts[1] || '';
                    }

                    return (
                        <View
                            key={`${day.label}-${index}`}
                            style={[styles.dayCard, {
                                backgroundColor: colors.background.secondary,
                                borderColor: colors.border.light
                            }]}
                        >
                            <View style={[styles.dayIconBadge, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                                <MousePointerClick color="#8b5cf6" size={16} strokeWidth={2} />
                            </View>
                            <Text style={[styles.dayValue, { color: colors.text.primary }]}>
                                {day.value}
                            </Text>
                            {timeLabel && (
                                <View style={styles.timeContainer}>
                                    <Clock color={colors.text.tertiary} size={10} strokeWidth={2} />
                                    <Text style={[styles.timeLabel, { color: colors.text.tertiary }]}>
                                        {timeLabel}
                                    </Text>
                                </View>
                            )}
                            <Text style={[styles.dayLabel, { color: colors.text.secondary }]}>
                                {formattedLabel}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
});
