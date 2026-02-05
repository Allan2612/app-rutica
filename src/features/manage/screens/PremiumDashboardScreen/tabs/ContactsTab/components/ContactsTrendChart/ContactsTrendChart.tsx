import { memo } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Activity } from 'lucide-react-native';
import { styles } from './styles';
import { CHART_WIDTH } from '@/styles/premium-section-styles';
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
    if (contactLineData.length === 0) return null;

    return (
        <View style={[styles.chartCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
            <View style={styles.chartHeader}>
                <View style={[styles.chartIconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                    <Activity color="#8b5cf6" size={22} strokeWidth={2.5} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.chartTitle, { color: colors.text.primary }]}>Tendencia de Interacciones</Text>
                    <Text style={[styles.chartSubtitle, { color: colors.text.secondary, marginBottom: 0 }]}>
                        Clicks en datos de contacto en los últimos {period} días {Platform.OS !== 'web' && period > 7 ? '← Desliza para ver más' : ''}
                    </Text>
                </View>
            </View>
            <View style={styles.chartContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={Platform.OS === 'web' && period > 7}
                    contentContainerStyle={{ paddingRight: 30, paddingLeft: 10 }}
                    style={{ width: '100%' }}
                >
                    <LineChart
                        data={contactLineData}
                        width={period === 7 ? CHART_WIDTH - 40 : period === 15 ? Math.max(CHART_WIDTH - 40, 480) : period === 30 ? Math.max(CHART_WIDTH - 40, 580) : CHART_WIDTH - 40}
                        height={240}
                        spacing={period === 7 ? 45 : period === 15 ? 28 : period === 30 ? 17 : 80}
                        color="#8b5cf6"
                        thickness={3}
                        startFillColor="rgba(139, 92, 246, 0.3)"
                        endFillColor="rgba(139, 92, 246, 0.05)"
                        startOpacity={1}
                        endOpacity={0.3}
                        initialSpacing={15}
                        endSpacing={15}
                        noOfSections={5}
                        maxValue={Math.max(...contactLineData.map(d => d.value), 5)}
                        yAxisColor="transparent"
                        xAxisColor={colors.border.light}
                        yAxisTextStyle={{ color: colors.text.tertiary, fontSize: 12, fontWeight: '700' }}
                        xAxisLabelTextStyle={{ color: colors.text.secondary, fontSize: 12, fontWeight: '600' }}
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
                        stripColor="rgba(139, 92, 246, 0.3)"
                        curved
                        areaChart
                        isAnimated
                    />
                </ScrollView>
            </View>
        </View>
    );
});
