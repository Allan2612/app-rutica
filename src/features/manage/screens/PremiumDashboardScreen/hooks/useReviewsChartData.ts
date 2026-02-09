import { useMemo } from 'react';
import { RATING_COLORS } from '@/styles/premium-section-styles';
import type { ReviewPieDataItem } from '@/types/entities/premium';

interface RatingDistribution {
  stars5: number;
  stars4: number;
  stars3: number;
  stars2: number;
  stars1: number;
}

interface BusinessReviewStats {
  ratingDistribution?: RatingDistribution;
}

interface ReviewStats {
  businessesStats?: BusinessReviewStats[];
  totalBusinessReviews: number;
  totalProductReviews: number;
}

export function useReviewsChartData(reviewStats: ReviewStats | undefined) {
  const reviewPieData = useMemo((): ReviewPieDataItem[] => {
    if (!reviewStats?.businessesStats || reviewStats.businessesStats.length === 0) return [];

    const totalDistribution = {
      stars5: 0,
      stars4: 0,
      stars3: 0,
      stars2: 0,
      stars1: 0,
    };

    reviewStats.businessesStats.forEach((business) => {
      if (business.ratingDistribution) {
        totalDistribution.stars5 += business.ratingDistribution.stars5;
        totalDistribution.stars4 += business.ratingDistribution.stars4;
        totalDistribution.stars3 += business.ratingDistribution.stars3;
        totalDistribution.stars2 += business.ratingDistribution.stars2;
        totalDistribution.stars1 += business.ratingDistribution.stars1;
      }
    });

    const totalReviews = reviewStats.totalBusinessReviews + reviewStats.totalProductReviews;
    if (totalReviews === 0) return [];

    const data = [
      {
        value: totalDistribution.stars5,
        color: RATING_COLORS.stars5,
        text: `${Math.round((totalDistribution.stars5 / totalReviews) * 100)}%`,
        label: '5 estrellas',
        stars: 5,
      },
      {
        value: totalDistribution.stars4,
        color: RATING_COLORS.stars4,
        text: `${Math.round((totalDistribution.stars4 / totalReviews) * 100)}%`,
        label: '4 estrellas',
        stars: 4,
      },
      {
        value: totalDistribution.stars3,
        color: RATING_COLORS.stars3,
        text: `${Math.round((totalDistribution.stars3 / totalReviews) * 100)}%`,
        label: '3 estrellas',
        stars: 3,
      },
      {
        value: totalDistribution.stars2,
        color: RATING_COLORS.stars2,
        text: `${Math.round((totalDistribution.stars2 / totalReviews) * 100)}%`,
        label: '2 estrellas',
        stars: 2,
      },
      {
        value: totalDistribution.stars1,
        color: RATING_COLORS.stars1,
        text: `${Math.round((totalDistribution.stars1 / totalReviews) * 100)}%`,
        label: '1 estrella',
        stars: 1,
      },
    ].filter((item) => item.value > 0);

    return data;
  }, [
    reviewStats?.businessesStats,
    reviewStats?.totalBusinessReviews,
    reviewStats?.totalProductReviews,
  ]);

  return { reviewPieData };
}
