import { memo, useMemo } from 'react';
import { BusinessSelector } from '../../components/BusinessSelector';
import { PeriodFilter } from '../../components/PeriodFilter';
import { ReviewTypeFilter } from '../../components/ReviewTypeFilter';
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
  ReviewType,
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
  reviewType: ReviewType;
  onReviewTypeChange: (type: ReviewType) => void;
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
  reviewType,
  onReviewTypeChange,
  reviewStats,
  reviewPieData,
}: ReviewsTabProps) {
  if (!reviewStats) return null;

  // Filtrar datos según el tipo de reseña seleccionado
  const filteredData = useMemo(() => {
    // Filtrar reseñas recientes
    const filteredRecentReviews =
      reviewType === 'all'
        ? reviewStats.recentReviews
        : reviewStats.recentReviews.filter((r) => r.type === reviewType);

    // Calcular totales filtrados
    const filteredTotalBusiness = reviewType === 'product' ? 0 : reviewStats.totalBusinessReviews;
    const filteredTotalProduct = reviewType === 'business' ? 0 : reviewStats.totalProductReviews;
    const totalFiltered = filteredTotalBusiness + filteredTotalProduct;

    return {
      recentReviews: filteredRecentReviews,
      totalBusinessReviews: filteredTotalBusiness,
      totalProductReviews: filteredTotalProduct,
      totalReviews: totalFiltered,
    };
  }, [reviewStats, reviewType]);

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
      .filter((b) => b.totalReviews >= 1)
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
          showStoreIcon
        />
      )}

      {/* Review Type Filter */}
      <ReviewTypeFilter
        selectedType={reviewType}
        onSelectType={onReviewTypeChange}
        colors={colors}
      />

      {/* Period Filter */}
      <PeriodFilter selectedPeriod={period} onSelectPeriod={onPeriodChange} colors={colors} />

      {/* Summary Cards */}
      <ReviewsSummaryCards
        colors={colors}
        totalBusinessReviews={filteredData.totalBusinessReviews}
        totalProductReviews={filteredData.totalProductReviews}
        overallAverageRating={reviewStats.overallAverageRating}
        reviewType={reviewType}
        totalDistribution={totalDistribution}
      />

      {/* Best Rated Highlight */}
      {bestRated && selectedBusinessId === null && reviewType !== 'product' && (
        <BestRatedHighlight colors={colors} bestRated={bestRated} />
      )}

      {/* Rating Trend Chart */}
      <RatingTrendChart colors={colors} ratingTrend={reviewStats.ratingTrend} period={period} />

      {/* Rating Distribution Chart */}
      <RatingDistributionChart colors={colors} totalDistribution={totalDistribution} />

      {/* Pie Chart */}
      <ReviewsPieChart
        colors={colors}
        reviewPieData={reviewPieData}
        overallAverageRating={reviewStats.overallAverageRating}
        selectedBusinessId={selectedBusinessId}
      />

      {/* Businesses Rating List */}
      {reviewType !== 'product' && (
        <BusinessReviewsList colors={colors} businessesStats={reviewStats.businessesStats} />
      )}

      {/* Top Products */}
      {reviewType !== 'business' && (
        <TopProductsList colors={colors} topProducts={reviewStats.topProducts} />
      )}

      {/* Recent Reviews */}
      <RecentReviewsList colors={colors} recentReviews={filteredData.recentReviews} />

      {/* Empty State */}
      {filteredData.totalReviews === 0 && <ReviewsEmptyState colors={colors} />}
    </>
  );
});
