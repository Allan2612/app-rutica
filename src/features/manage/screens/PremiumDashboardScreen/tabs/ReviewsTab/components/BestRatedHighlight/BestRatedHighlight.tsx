import { memo } from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Award, Store, Star } from 'lucide-react-native';
import { styles } from './styles';
import type { ThemedColors } from '../../../../../../../../types/entities/premium';

interface BestRatedHighlightProps {
  colors: ThemedColors;
  bestRated: {
    businessName: string;
    logoUrl?: string;
    averageRating: number;
    totalReviews: number;
  };
}

export const BestRatedHighlight = memo(function BestRatedHighlight({
  colors,
  bestRated,
}: BestRatedHighlightProps) {
  return (
    <View
      style={[
        styles.highlightCard,
        { backgroundColor: colors.background.primary, borderColor: '#fbbf24' },
      ]}
    >
      <View style={styles.highlightHeader}>
        <Award color="#f59e0b" size={24} strokeWidth={2} />
        <Text style={[styles.highlightTitle, { color: colors.text.primary }]}>
          Mejor Calificado
        </Text>
      </View>
      <View style={styles.highlightContent}>
        {bestRated.logoUrl ? (
          <Image
            source={{ uri: bestRated.logoUrl }}
            style={styles.highlightLogo}
            contentFit="cover"
          />
        ) : (
          <View
            style={[
              styles.highlightIconPlaceholder,
              { backgroundColor: `${colors.primary[500]}15` },
            ]}
          >
            <Store color={colors.primary[500]} size={24} strokeWidth={2} />
          </View>
        )}
        <View style={styles.highlightInfo}>
          <Text style={[styles.highlightName, { color: colors.text.primary }]} numberOfLines={1}>
            {bestRated.businessName}
          </Text>
          <View style={styles.highlightRating}>
            <Star color="#fbbf24" size={16} strokeWidth={2} fill="#fbbf24" />
            <Text style={[styles.highlightRatingText, { color: '#fbbf24' }]}>
              {bestRated.averageRating.toFixed(1)}
            </Text>
            <Text style={[styles.highlightReviewCount, { color: colors.text.tertiary }]}>
              ({bestRated.totalReviews} reseñas)
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});
