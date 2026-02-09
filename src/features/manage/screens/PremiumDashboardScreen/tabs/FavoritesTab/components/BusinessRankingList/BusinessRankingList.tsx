import { memo } from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Store, Heart } from 'lucide-react-native';
import { styles } from './styles';
import type { ThemedColors } from '../../../../../../../../types/entities/premium';

interface BusinessStat {
  businessId: string;
  businessName: string;
  logoUrl?: string;
  favoriteCount: number;
}

interface BusinessRankingListProps {
  colors: ThemedColors;
  businessesStats: BusinessStat[];
}

export const BusinessRankingList = memo(function BusinessRankingList({
  colors,
  businessesStats,
}: BusinessRankingListProps) {
  return (
    <View style={styles.listSection}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Ranking de Negocios</Text>
      <View style={styles.businessList}>
        {businessesStats.map((business, index) => (
          <View
            key={business.businessId}
            style={[
              styles.businessCard,
              { backgroundColor: colors.background.primary, borderColor: colors.border.light },
            ]}
          >
            <View
              style={[
                styles.rankBadge,
                {
                  backgroundColor:
                    index === 0
                      ? '#fef3c7'
                      : index === 1
                        ? '#f3f4f6'
                        : index === 2
                          ? '#fed7aa'
                          : colors.background.secondary,
                },
              ]}
            >
              <Text
                style={[
                  styles.rankText,
                  {
                    color:
                      index === 0
                        ? '#d97706'
                        : index === 1
                          ? '#6b7280'
                          : index === 2
                            ? '#ea580c'
                            : colors.text.tertiary,
                  },
                ]}
              >
                #{index + 1}
              </Text>
            </View>
            <View style={[styles.businessLogo, { backgroundColor: colors.background.secondary }]}>
              {business.logoUrl ? (
                <Image
                  source={{ uri: business.logoUrl }}
                  style={styles.logoImage}
                  contentFit="cover"
                />
              ) : (
                <Store color={colors.text.tertiary} size={20} strokeWidth={2} />
              )}
            </View>
            <View style={styles.businessInfo}>
              <Text style={[styles.businessName, { color: colors.text.primary }]} numberOfLines={1}>
                {business.businessName}
              </Text>
            </View>
            <View style={styles.favoriteContainer}>
              <Heart
                color="#ef4444"
                size={16}
                strokeWidth={2}
                fill={business.favoriteCount > 0 ? '#ef4444' : 'transparent'}
              />
              <Text style={[styles.favoriteCount, { color: colors.text.primary }]}>
                {business.favoriteCount}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});
