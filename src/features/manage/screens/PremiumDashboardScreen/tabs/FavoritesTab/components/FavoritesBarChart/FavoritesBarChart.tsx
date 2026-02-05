import { memo } from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { BarChart3 } from 'lucide-react-native';
import { styles } from './styles';
import { CHART_WIDTH } from '@/styles/premium-section-styles';
import type { BarChartDataItem, ThemedColors } from '../../../../../../../../types/entities/premium';

interface FavoritesBarChartProps {
    colors: ThemedColors;
    barChartData: BarChartDataItem[];
}

export const FavoritesBarChart = memo(function FavoritesBarChart({
    colors,
    barChartData,
}: FavoritesBarChartProps) {
    if (barChartData.length === 0) return null;

    return (
        <View style={[styles.chartCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
            <View style={styles.chartHeader}>
                <BarChart3 color={colors.primary[500]} size={20} strokeWidth={2} />
                <Text style={[styles.chartTitle, { color: colors.text.primary }]}>
                    Favoritos por Negocio
                </Text>
            </View>
            <Text style={[styles.chartSubtitle, { color: colors.text.secondary }]}>
                Comparativa de popularidad de tus negocios
            </Text>
            <View style={styles.chartContainer}>
                <BarChart
                    data={barChartData}
                    width={CHART_WIDTH - 40}
                    height={180}
                    barWidth={32}
                    spacing={24}
                    initialSpacing={20}
                    noOfSections={4}
                    yAxisColor="transparent"
                    xAxisColor={colors.border.light}
                    yAxisTextStyle={{ color: colors.text.tertiary, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: colors.text.secondary, fontSize: 9, width: 50, textAlign: 'center' }}
                    hideRules
                    barBorderRadius={6}
                    isAnimated
                />
            </View>
        </View>
    );
});
