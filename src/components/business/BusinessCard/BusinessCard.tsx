import { memo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { MapPin, Star, Tag } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';
import { getCategoryColorScheme } from '@/utils/categoryColors';

export interface BusinessCardProps {
  name: string;
  categoryNames?: string[];
  categoryIds?: string[];
  locationLabel?: string | null;
  imageUrl?: string | null;
  logoUrl?: string | null;
  rating?: number;
  reviewCount?: number;
  isApproved?: boolean;
  hasActivePromotions?: boolean; // NEW: Indica si tiene promociones activas
  onPress?: () => void;
}

export const BusinessCard = memo(function BusinessCard({
  name,
  categoryNames = [],
  categoryIds = [],
  locationLabel,
  imageUrl,
  logoUrl,
  rating = 4.5,
  reviewCount = 20,
  isApproved = false,
  hasActivePromotions = false, // NEW
  onPress,
}: BusinessCardProps) {
  const colors = useThemedColors();

  return (
    <Pressable style={[styles.card, { backgroundColor: colors.background.primary, borderColor: colors.border.medium }]} onPress={onPress} disabled={!onPress}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.heroFull} resizeMode="cover" />
      ) : (
        <View style={[styles.heroFull, styles.heroPlaceholder, { backgroundColor: colors.background.tertiary }]} />
      )}

      {logoUrl ? (
        <View style={[styles.logoBadge, { backgroundColor: colors.background.primary, borderColor: colors.border.medium }]}>
          <Image source={{ uri: logoUrl }} style={styles.logoImage} resizeMode="cover" />
        </View>
      ) : null}

      {/* NEW: Promotion Badge */}
      {hasActivePromotions && (
        <View style={styles.promotionBadge}>
          <Tag size={14} color="#000000" strokeWidth={2.5} />
        </View>
      )}

      {rating > 0 && (
        <View style={[styles.ratingBadge, { backgroundColor: 'rgba(255,255,255,0.92)', borderColor: colors.border.medium }]}>
          <Star size={16} color="#fbbf24" fill="#fbbf24" />
          <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
          <Text style={[styles.ratingCount, { color: colors.text.tertiary }]}>({reviewCount})</Text>
        </View>
      )}

      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientOverlay}
      />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{name}</Text>
          {isApproved && (
            <Image
              source={require('../../../../assets/verification.png')}
              style={styles.verificationIcon}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={styles.metaRow}>
          {categoryNames.length > 0 && categoryNames.slice(0, 2).map((catName, index) => {
            const categoryColor = getCategoryColorScheme(categoryIds[index]);
            return (
              <View
                key={index}
                style={[
                  styles.categoryChip,
                  { backgroundColor: categoryColor.backgroundColor },
                ]}
              >
                <Text style={[styles.categoryText, { color: categoryColor.textColor }]}>
                  {catName}
                </Text>
              </View>
            );
          })}
          {categoryNames.length > 2 && (
            <View style={[styles.categoryChip, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
              <Text style={[styles.categoryText, { color: '#FFFFFF' }]}>
                +{categoryNames.length - 2}
              </Text>
            </View>
          )}
        </View>

        {locationLabel ? (
          <View style={styles.locationRow}>
            <MapPin size={16} color="#fff" strokeWidth={1.75} />
            <Text style={styles.locationText} numberOfLines={1}>
              {locationLabel}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
});
