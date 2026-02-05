import { memo } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Activity } from 'lucide-react-native';
import { styles } from './styles';
import { CHART_WIDTH } from '@/styles/premium-section-styles';
import type { ChartDataItem, PeriodType, ThemedColors } from '../../../../../../../../types/entities/premium';

interface FavoritesTrendChartProps {
    colors: ThemedColors;
    lineChartData: ChartDataItem[];
    period: PeriodType;
}

export const FavoritesTrendChart = memo(function FavoritesTrendChart({
    colors,
    lineChartData,
    period,
}: FavoritesTrendChartProps) {
    if (lineChartData.length === 0) return null;

    return (
        <View style={[styles.chartCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
            <View style={styles.chartHeader}>
                <Activity color={colors.primary[500]} size={20} strokeWidth={2} />
                <Text style={[styles.chartTitle, { color: colors.text.primary }]}>
                    Tendencia de Favoritos
                </Text>
            </View>
            <Text style={[styles.chartSubtitle, { color: colors.text.secondary }]}>
                Favoritos recibidos en los últimos {period} días {Platform.OS !== 'web' && period > 7 ? '← Desliza para ver más' : ''}
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={Platform.OS === 'web'}
                contentContainerStyle={{ paddingRight: 20 }}
                style={{ width: '100%' }}
            >
                <LineChart
                    data={lineChartData}
                    width={lineChartData.length * (period === 90 ? 60 : period > 30 ? 50 : period > 7 ? 40 : CHART_WIDTH - 40)}
                    height={180}
                    spacing={period === 90 ? 40 : period > 30 ? 30 : period > 7 ? 20 : (CHART_WIDTH - 70) / lineChartData.length}
                    color="#3b82f6"
                    thickness={3}
                    startFillColor="rgba(59, 130, 246, 0.3)"
                    endFillColor="rgba(59, 130, 246, 0.01)"
                    startOpacity={0.9}
                    endOpacity={0.1}
                    initialSpacing={15}
                    noOfSections={4}
                    yAxisColor="transparent"
                    xAxisColor={colors.border.light}
                    yAxisTextStyle={{ color: colors.text.tertiary, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: colors.text.secondary, fontSize: 10 }}
                    hideRules
                    hideDataPoints={false}
                    dataPointsColor="#3b82f6"
                    dataPointsRadius={5}
                    curved
                    areaChart
                />
            </ScrollView>
        </View>
    );
});
