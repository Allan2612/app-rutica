import { useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PIE_COLORS } from '@/styles/premium-section-styles';
import type {
    PeakDayData,
    BarChartDataItem,
    ChartDataItem,
    PieChartDataItem,
} from '@/types/entities/premium';

interface DailyTrendItem {
    label: string;
    count: number;
    date?: string;
}

interface BusinessStats {
    businessId: string;
    businessName: string;
    favoriteCount: number;
    logoUrl?: string | null;
}

interface FavoritesStats {
    dailyTrend?: DailyTrendItem[];
    businessesStats?: BusinessStats[];
    totalFavorites: number;
}

export function useFavoritesChartData(stats: FavoritesStats | undefined) {
    const peakDay = useMemo((): PeakDayData | null => {
        if (!stats?.dailyTrend || stats.dailyTrend.length === 0) return null;

        const maxDay = stats.dailyTrend.reduce((max, day) => {
            return day.count > max.count ? day : max;
        }, stats.dailyTrend[0]);

        if (maxDay.count === 0) return null;

        const formattedDate = maxDay.date
            ? format(new Date(maxDay.date), 'd MMMM', { locale: es })
            : maxDay.label;

        return { ...maxDay, formattedDate };
    }, [stats?.dailyTrend]);

    const barChartData = useMemo((): BarChartDataItem[] => {
        if (!stats?.businessesStats) return [];

        return stats.businessesStats.slice(0, 6).map((business, index) => ({
            value: business.favoriteCount,
            label: business.businessName.slice(0, 8),
            frontColor:
                index === 0 ? '#ef4444' : index === 1 ? '#f97316' : index === 2 ? '#eab308' : '#3b82f6',
        }));
    }, [stats?.businessesStats]);

    const lineChartData = useMemo((): ChartDataItem[] => {
        if (!stats?.dailyTrend) return [];

        return stats.dailyTrend.map((day) => ({
            value: day.count,
            label: day.label,
            dataPointText: day.count > 0 ? String(day.count) : '',
        }));
    }, [stats?.dailyTrend]);

    const pieChartData = useMemo((): PieChartDataItem[] => {
        if (!stats?.businessesStats || stats.businessesStats.length === 0) return [];

        const top5 = stats.businessesStats.slice(0, 5);
        const others = stats.businessesStats.slice(5);
        const othersTotal = others.reduce((sum, b) => sum + b.favoriteCount, 0);

        const data = top5.map((business, index) => ({
            value: business.favoriteCount,
            color: PIE_COLORS[index],
            text: `${Math.round((business.favoriteCount / stats.totalFavorites) * 100)}%`,
            label: business.businessName,
        }));

        if (othersTotal > 0) {
            data.push({
                value: othersTotal,
                color: '#9ca3af',
                text: `${Math.round((othersTotal / stats.totalFavorites) * 100)}%`,
                label: 'Otros',
            });
        }

        return data;
    }, [stats?.businessesStats, stats?.totalFavorites]);

    return { peakDay, barChartData, lineChartData, pieChartData };
}
