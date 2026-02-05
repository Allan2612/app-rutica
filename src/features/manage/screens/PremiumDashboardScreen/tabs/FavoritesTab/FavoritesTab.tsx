import { memo } from 'react';
import { BusinessSelector } from '../../components/BusinessSelector';
import { PeriodFilter } from '../../components/PeriodFilter';
import {
    FavoritesSummaryCards,
    TopBusinessHighlight,
    FavoritesTrendChart,
    FavoritesBarChart,
    FavoritesPieChart,
    BusinessRankingList,
} from './components';
import type {
    BaseTabProps,
    PeriodType,
    PeakDayData,
    ChartDataItem,
    BarChartDataItem,
    PieChartDataItem,
    BusinessOption,
} from '../../../../../../types/entities/premium';

interface FavoritesTabProps extends BaseTabProps {
    businessOptions?: BusinessOption[];
    selectedBusinessId: string | null;
    onSelectBusiness: (id: string | null) => void;
    period: PeriodType;
    onPeriodChange: (period: PeriodType) => void;
    stats: {
        totalFavorites: number;
        growthPercentage: number;
        topBusiness?: {
            businessName: string;
            logoUrl?: string;
            favoriteCount: number;
        };
        businessesStats: Array<{
            businessId: string;
            businessName: string;
            logoUrl?: string;
            favoriteCount: number;
        }>;
    } | undefined;
    peakDay: PeakDayData | null;
    lineChartData: ChartDataItem[];
    barChartData: BarChartDataItem[];
    pieChartData: PieChartDataItem[];
    isPositiveGrowth: boolean;
}

export const FavoritesTab = memo(function FavoritesTab({
    colors,
    businessOptions,
    selectedBusinessId,
    onSelectBusiness,
    period,
    onPeriodChange,
    stats,
    peakDay,
    lineChartData,
    barChartData,
    pieChartData,
    isPositiveGrowth,
}: FavoritesTabProps) {
    if (!stats) return null;

    return (
        <>
            {/* Business Selector */}
            {businessOptions && businessOptions.length > 1 && (
                <BusinessSelector
                    businessOptions={businessOptions}
                    selectedBusinessId={selectedBusinessId}
                    onSelectBusiness={onSelectBusiness}
                    colors={colors}
                />
            )}

            {/* Period Filter */}
            <PeriodFilter
                selectedPeriod={period}
                onSelectPeriod={onPeriodChange}
                colors={colors}
            />

            {/* Summary Cards */}
            <FavoritesSummaryCards
                colors={colors}
                totalFavorites={stats.totalFavorites}
                peakDay={peakDay}
                growthPercentage={stats.growthPercentage}
                isPositiveGrowth={isPositiveGrowth}
            />

            {/* Top Business Highlight */}
            {stats.topBusiness && stats.topBusiness.favoriteCount > 0 && selectedBusinessId === null && (
                <TopBusinessHighlight
                    colors={colors}
                    topBusiness={stats.topBusiness}
                />
            )}

            {/* Trend Chart */}
            <FavoritesTrendChart
                colors={colors}
                lineChartData={lineChartData}
                period={period}
            />

            {/* Bar Chart */}
            {selectedBusinessId === null && (
                <FavoritesBarChart
                    colors={colors}
                    barChartData={barChartData}
                />
            )}

            {/* Pie Chart */}
            {selectedBusinessId === null && (
                <FavoritesPieChart
                    colors={colors}
                    pieChartData={pieChartData}
                    totalFavorites={stats.totalFavorites}
                />
            )}

            {/* Business Ranking List */}
            {selectedBusinessId === null && (
                <BusinessRankingList
                    colors={colors}
                    businessesStats={stats.businessesStats}
                />
            )}
        </>
    );
});
