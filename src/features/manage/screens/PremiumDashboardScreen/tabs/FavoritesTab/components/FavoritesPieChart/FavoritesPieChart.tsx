import { memo } from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Heart } from 'lucide-react-native';
import { styles } from './styles';
import type { PieChartDataItem, ThemedColors } from '../../../../../../../../types/entities/premium';

interface FavoritesPieChartProps {
    colors: ThemedColors;
    pieChartData: PieChartDataItem[];
    totalFavorites: number;
}

export const FavoritesPieChart = memo(function FavoritesPieChart({
    colors,
    pieChartData,
    totalFavorites,
}: FavoritesPieChartProps) {
    if (pieChartData.length === 0 || totalFavorites === 0) return null;

    return (
        <View style={[styles.chartCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
            <View style={styles.chartHeader}>
                <Heart color="#ef4444" size={20} strokeWidth={2} />
                <Text style={[styles.chartTitle, { color: colors.text.primary }]}>
                    Distribución de Favoritos
                </Text>
            </View>
            <Text style={[styles.chartSubtitle, { color: colors.text.secondary }]}>
                Proporción de favoritos por negocio
            </Text>
            <View style={styles.pieContainer}>
                <View style={styles.pieChartWrapper}>
                    <PieChart
                        data={pieChartData}
                        donut
                        radius={80}
                        innerRadius={50}
                        centerLabelComponent={() => (
                            <View style={styles.pieCenter}>
                                <Text style={[styles.pieCenterValue, { color: '#000000' }]}>
                                    {totalFavorites}
                                </Text>
                                <Text style={[styles.pieCenterLabel, { color: colors.text.secondary }]}>
                                    Total
                                </Text>
                            </View>
                        )}
                    />
                </View>
                <View style={styles.pieLegend}>
                    {pieChartData.map((item, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                            <Text style={[styles.legendText, { color: colors.text.secondary }]} numberOfLines={1}>
                                {item.label}
                            </Text>
                            <Text style={[styles.legendValue, { color: colors.text.primary }]}>
                                {item.text}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
});
