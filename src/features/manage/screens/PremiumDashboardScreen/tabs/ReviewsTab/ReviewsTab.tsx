import { memo, useMemo } from 'react';
import { BusinessSelector } from '../../components/BusinessSelector';
import { PeriodFilter } from '../../components/PeriodFilter';
import {
    ReviewsSummaryCards,
    BestRatedHighlight,
    RatingTrendChart,
    RatingDistributionChart,
    ReviewsPieChart,
    BusinessReviewsList,
    TopProductsList,
    RecentReviewsList,
    ReviewsEmptyState,
} from './components';
import type {
    BaseTabProps,
    PeriodType,
    ReviewPieDataItem,
    BusinessOption,
    ReviewStats,
} from '../../../../../../types/entities/premium';

interface ReviewsTabProps extends BaseTabProps {
    businessOptions?: BusinessOption[];
    selectedBusinessId: string | null;
    onSelectBusiness: (id: string | null) => void;
    period: PeriodType;
    onPeriodChange: (period: PeriodType) => void;
    reviewStats: ReviewStats | undefined;
    reviewPieData: ReviewPieDataItem[];
}

export const ReviewsTab = memo(function ReviewsTab({
    colors,
    businessOptions,
    selectedBusinessId,
    onSelectBusiness,
    period,
    onPeriodChange,
    reviewStats,
    reviewPieData,
}: ReviewsTabProps) {
    if (!reviewStats) return null;

    // Calcular distribución total
    const totalDistribution = useMemo(() => {
        const distribution = {
            stars5: 0,
            stars4: 0,
            stars3: 0,
            stars2: 0,
            stars1: 0,
        };

        reviewStats.businessesStats.forEach((business) => {
            distribution.stars5 += business.ratingDistribution.stars5;
            distribution.stars4 += business.ratingDistribution.stars4;
            distribution.stars3 += business.ratingDistribution.stars3;
            distribution.stars2 += business.ratingDistribution.stars2;
            distribution.stars1 += business.ratingDistribution.stars1;
        });

        return distribution;
    }, [reviewStats.businessesStats]);

    // Best rated business
    const bestRated = useMemo(() => {
        return [...reviewStats.businessesStats]
            .filter(b => b.totalReviews >= 1)
            .sort((a, b) => b.averageRating - a.averageRating)[0];
    }, [reviewStats.businessesStats]);

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
            <ReviewsSummaryCards
                colors={colors}
                totalBusinessReviews={reviewStats.totalBusinessReviews}
                totalProductReviews={reviewStats.totalProductReviews}
                overallAverageRating={reviewStats.overallAverageRating}
            />

            {/* Best Rated Highlight */}
            {bestRated && selectedBusinessId === null && (
                <BestRatedHighlight
                    colors={colors}
                    bestRated={bestRated}
                />
            )}

            {/* Rating Trend Chart */}
            <RatingTrendChart
                colors={colors}
                ratingTrend={reviewStats.ratingTrend}
            />

            {/* Rating Distribution Chart */}
            <RatingDistributionChart
                colors={colors}
                totalDistribution={totalDistribution}
            />

            {/* Pie Chart */}
            <ReviewsPieChart
                colors={colors}
                reviewPieData={reviewPieData}
                overallAverageRating={reviewStats.overallAverageRating}
                selectedBusinessId={selectedBusinessId}
            />

            {/* Businesses Rating List */}
            <BusinessReviewsList
                colors={colors}
                businessesStats={reviewStats.businessesStats}
            />

            {/* Top Products */}
            <TopProductsList
                colors={colors}
                topProducts={reviewStats.topProducts}
            />

            {/* Recent Reviews */}
            <RecentReviewsList
                colors={colors}
                recentReviews={reviewStats.recentReviews}
            />

            {/* Empty State */}
            {reviewStats.totalBusinessReviews === 0 && reviewStats.totalProductReviews === 0 && (
                <ReviewsEmptyState colors={colors} />
            )}
        </>
    );
});
