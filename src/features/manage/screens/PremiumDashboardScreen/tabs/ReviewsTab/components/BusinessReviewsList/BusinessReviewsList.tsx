import { memo } from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Store, Star } from 'lucide-react-native';
import { styles } from './styles';
import type { ThemedColors } from '../../../../../../../../types/entities/premium';

interface BusinessStats {
  businessId: string;
  businessName: string;
  logoUrl?: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    stars5: number;
    stars4: number;
    stars3: number;
    stars2: number;
    stars1: number;
  };
}

interface BusinessReviewsListProps {
  colors: ThemedColors;
  businessesStats: BusinessStats[];
}

export const BusinessReviewsList = memo(function BusinessReviewsList({
  colors,
  businessesStats,
}: BusinessReviewsListProps) {
  if (businessesStats.length === 0) return null;

  return (
    <View style={styles.listSection}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Rating por Negocio</Text>
      <View style={styles.businessReviewsList}>
        {businessesStats.map((business) => (
          <View
            key={business.businessId}
            style={[
              styles.businessReviewCard,
              { backgroundColor: colors.background.primary, borderColor: colors.border.light },
            ]}
          >
            {business.logoUrl ? (
              <Image
                source={{ uri: business.logoUrl }}
                style={styles.businessReviewLogo}
                contentFit="cover"
              />
            ) : (
              <View
                style={[
                  styles.businessReviewIconPlaceholder,
                  { backgroundColor: `${colors.primary[500]}15` },
                ]}
              >
                <Store color={colors.primary[500]} size={20} strokeWidth={2} />
              </View>
            )}
            <View style={styles.businessReviewInfo}>
              <Text
                style={[styles.businessReviewName, { color: colors.text.primary }]}
                numberOfLines={1}
              >
                {business.businessName}
              </Text>
              <View style={styles.businessReviewStats}>
                <Star color="#fbbf24" size={14} strokeWidth={2} fill="#fbbf24" />
                <Text style={[styles.businessReviewRating, { color: colors.text.primary }]}>
                  {business.averageRating.toFixed(1)}
                </Text>
                <Text style={[styles.businessReviewCount, { color: colors.text.tertiary }]}>
                  · {business.totalReviews} reseñas
                </Text>
              </View>
            </View>
            <View style={styles.miniRatingDistribution}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count =
                  business.ratingDistribution[
                    `stars${star}` as keyof typeof business.ratingDistribution
                  ];
                const total = business.totalReviews || 1;
                const percent = (count / total) * 100;
                return (
                  <View key={star} style={styles.miniRatingBar}>
                    <View
                      style={[
                        styles.miniRatingFill,
                        {
                          width: `${percent}%`,
                          backgroundColor:
                            star >= 4 ? '#10b981' : star === 3 ? '#fbbf24' : '#ef4444',
                        },
                      ]}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});
