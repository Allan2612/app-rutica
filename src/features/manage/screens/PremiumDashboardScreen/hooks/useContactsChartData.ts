import { useMemo } from 'react';
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
                        'Nov': 1, 'Dic': 2, 'Ene': 3, 'Feb': 4, 'Mar': 5, 'Abr': 6,
                        'May': 7, 'Jun': 8, 'Jul': 9, 'Ago': 10, 'Sep': 11, 'Oct': 12
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

        const total = contactStats.dailyTrend.length;

        const showLabelAt = (index: number) => {
            if (index === 0) return true;
            if (index === total - 1) return true;
            if (contactPeriod === 7) return true;
            if (contactPeriod === 15) return index % 3 === 0;
            if (contactPeriod === 30) return index % 5 === 0;
            return false;
        };

        return contactStats.dailyTrend.map((day, index) => ({
            value: day.count,
            label: showLabelAt(index) ? day.label : '',
            dataPointText: '',
        }));
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
