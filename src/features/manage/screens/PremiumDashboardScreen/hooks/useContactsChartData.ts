import { useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CONTACT_COLORS } from '@/styles/premium-section-styles';
import type { ContactType } from '@/services/contactClicks.service';
import type {
    ChartDataItem,
    PieChartDataItem,
    ContactBarDataItem,
    PeriodType,
} from '@/types/entities/premium';

interface ClicksByTypeItem {
    contactType: ContactType;
    count: number;
    label: string;
}

interface DailyTrendItem {
    label: string;
    count: number;
    date?: string;
}

interface ContactStats {
    clicksByType?: ClicksByTypeItem[];
    dailyTrend?: DailyTrendItem[];
    totalClicks: number;
}

export function useContactsChartData(
    contactStats: ContactStats | undefined,
    visibleContactTypes: Set<ContactType>,
    contactPeriod: PeriodType
) {
    const contactBarData = useMemo((): ContactBarDataItem[] => {
        if (!contactStats?.clicksByType) return [];

        return contactStats.clicksByType
            .filter(item => visibleContactTypes.has(item.contactType))
            .slice(0, 10)
            .map((item) => ({
                value: item.count,
                label: item.label,
                frontColor: CONTACT_COLORS[item.contactType] || '#6b7280',
            }));
    }, [contactStats?.clicksByType, visibleContactTypes]);

    const contactLineData = useMemo((): ChartDataItem[] => {
        if (!contactStats?.dailyTrend) return [];

        if (contactPeriod === 90) {
            const monthlyData: { [key: string]: { count: number; label: string; order: number } } = {};

            contactStats.dailyTrend.forEach((day) => {
                const monthKey = day.label;

                if (!monthlyData[monthKey]) {
                    const monthOrder = {
                        'Noviembre': 1, 'Diciembre': 2, 'Enero': 3, 'Febrero': 4, 'Marzo': 5, 'Abril': 6,
                        'Mayo': 7, 'Junio': 8, 'Julio': 9, 'Agosto': 10, 'Septiembre': 11, 'Octubre': 12
                    };
                    monthlyData[monthKey] = {
                        count: 0,
                        label: monthKey,
                        order: monthOrder[monthKey as keyof typeof monthOrder] || 0
                    };
                }
                monthlyData[monthKey].count += day.count;
            });

            return Object.values(monthlyData)
                .sort((a, b) => a.order - b.order)
                .map(month => ({
                    value: month.count,
                    label: month.label,
                    dataPointText: '',
                }));
        }

        // Para períodos menores a 90 días, formatear siempre con mes completo
        return contactStats.dailyTrend.map((day) => {
            let formattedLabel = day.label;

            // Si existe el campo date, formatear con mes completo
            if (day.date) {
                try {
                    formattedLabel = format(new Date(day.date), 'd MMMM', { locale: es });
                } catch {
                    formattedLabel = day.label;
                }
            }

            return {
                value: day.count,
                label: formattedLabel,
                dataPointText: '',
            };
        });
    }, [contactStats?.dailyTrend, contactPeriod]);

    const contactPieData = useMemo((): PieChartDataItem[] => {
        if (!contactStats?.clicksByType || contactStats.clicksByType.length === 0) return [];

        const totalClicks = contactStats.totalClicks;

        return contactStats.clicksByType.map((item) => ({
            value: item.count,
            color: CONTACT_COLORS[item.contactType] || '#6b7280',
            text: `${Math.round((item.count / totalClicks) * 100)}%`,
            label: item.label,
        }));
    }, [contactStats?.clicksByType, contactStats?.totalClicks]);

    return { contactBarData, contactLineData, contactPieData };
}
