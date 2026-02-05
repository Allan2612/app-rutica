import { memo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { TrendingUp } from 'lucide-react-native';
import { styles } from './styles';
import { CHART_WIDTH } from '@/styles/premium-section-styles';
import type { ThemedColors } from '../../../../../../../../types/entities/premium';

interface RatingTrendItem {
    label: string;
    count: number;
    averageRating: number;
}

interface RatingTrendChartProps {
    colors: ThemedColors;
    ratingTrend: RatingTrendItem[];
}

export const RatingTrendChart = memo(function RatingTrendChart({
    colors,
    ratingTrend,
}: RatingTrendChartProps) {
    const ratingLineData = ratingTrend.map((item) => ({
        value: item.count > 0 ? item.averageRating : 0,
        label: item.label,
        dataPointText: item.count > 0 ? item.averageRating.toFixed(1) : '',
    }));

    if (ratingLineData.length === 0) return null;

    return (
        <View style={[styles.chartCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
            <View style={styles.chartHeader}>
                <View style={[styles.chartIconContainer, { backgroundColor: 'rgba(251, 191, 36, 0.15)' }]}>
                    <TrendingUp color="#fbbf24" size={22} strokeWidth={2} />
                </View>
                <Text style={[styles.chartTitle, { color: colors.text.primary }]}>Tendencia de Calificaciones</Text>
            </View>
            <Text style={[styles.chartSubtitle, { color: colors.text.secondary }]}>
                Promedio de estrellas en los últimos 30 días
            </Text>
            <View style={styles.chartContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={true}
                    contentContainerStyle={{ paddingRight: 30, paddingLeft: 10 }}
                    style={{ width: '100%' }}
                >
                    <LineChart
                        data={ratingLineData}
                        width={Math.max(CHART_WIDTH - 40, 550)}
                        height={200}
                        spacing={17}
                        color="#fbbf24"
                        thickness={3}
                        startFillColor="rgba(251, 191, 36, 0.3)"
                        endFillColor="rgba(251, 191, 36, 0.05)"
                        startOpacity={1}
                        endOpacity={0.3}
                        initialSpacing={15}
                        endSpacing={15}
                        noOfSections={5}
                        maxValue={5}
                        yAxisColor="transparent"
                        xAxisColor={colors.border.light}
                        yAxisTextStyle={{ color: colors.text.tertiary, fontSize: 12, fontWeight: '700' }}
                        xAxisLabelTextStyle={{ color: colors.text.secondary, fontSize: 10, fontWeight: '600' }}
                        xAxisThickness={1.5}
                        rulesColor={colors.border.light}
                        rulesType="solid"
                        hideDataPoints={false}
                        dataPointsHeight={10}
                        dataPointsWidth={10}
                        dataPointsColor="#ffffff"
                        dataPointsRadius={5}
                        focusEnabled
                        showStripOnFocus
                        showTextOnFocus
                        stripColor="rgba(251, 191, 36, 0.3)"
                        curved
                        areaChart
                        isAnimated
                    />
                </ScrollView>
            </View>
        </View>
    );
});
