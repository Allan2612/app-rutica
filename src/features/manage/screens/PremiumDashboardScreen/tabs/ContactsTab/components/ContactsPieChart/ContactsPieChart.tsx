import { memo } from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { MousePointerClick } from 'lucide-react-native';
import { styles } from './styles';
import type { PieChartDataItem, ThemedColors } from '../../../../../../../../types/entities/premium';

interface ContactsPieChartProps {
    colors: ThemedColors;
    contactPieData: PieChartDataItem[];
    totalClicks: number;
    selectedBusinessId: string | null;
}

export const ContactsPieChart = memo(function ContactsPieChart({
    colors,
    contactPieData,
    totalClicks,
    selectedBusinessId,
}: ContactsPieChartProps) {
    if (contactPieData.length === 0 || totalClicks === 0) return null;

    return (
        <View style={[styles.chartCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
            <View style={styles.chartHeader}>
                <MousePointerClick color="#8b5cf6" size={20} strokeWidth={2} />
                <Text style={[styles.chartTitle, { color: colors.text.primary }]}>Distribución de Interacciones</Text>
            </View>
            <Text style={[styles.chartSubtitle, { color: colors.text.secondary }]}>
                {selectedBusinessId === null ? 'Proporción de interacciones por tipo de contacto' : 'Proporción de interacciones para este negocio'}
            </Text>
            <View style={styles.pieContainer}>
                <View style={styles.pieChartWrapper}>
                    <PieChart
                        data={contactPieData}
                        donut
                        radius={80}
                        innerRadius={50}
                        centerLabelComponent={() => (
                            <View style={styles.pieCenter}>
                                <Text style={[styles.pieCenterValue, { color: '#000000' }]}>{totalClicks}</Text>
                                <Text style={[styles.pieCenterLabel, { color: colors.text.secondary }]}>Clicks</Text>
                            </View>
                        )}
                    />
                </View>
                <View style={styles.legendContainer}>
                    {contactPieData.map((item, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                            <Text numberOfLines={1} style={[styles.legendLabel, { color: colors.text.secondary }]}>{item.label}</Text>
                            <Text style={[styles.legendValue, { color: colors.text.primary }]}>{item.text}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
});
