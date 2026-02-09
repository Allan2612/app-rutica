/**
 * AttractionCard Component
 * Card for displaying attractions in lists and carousels
 */

import { memo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Mountain, MapPin, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemedColors } from '@/hooks';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { styles } from './styles';

export interface AttractionCardProps {
  id: string;
  name: string;
  description?: string | null;
  categoryNames?: string[];
  categoryIds?: string[];
  locationLabel?: string | null;
  imageUrls?: string[];
  rating?: number;
  reviewCount?: number;
  onPress?: () => void;
}

export const AttractionCard = memo(function AttractionCard({
  id,
  name,
  description,
  categoryNames = [],
  categoryIds = [],
  locationLabel,
  imageUrls = [],
  rating = 0,
  reviewCount = 0,
  onPress,
}: AttractionCardProps) {
  const colors = useThemedColors();
  const imageUrl = imageUrls[0];

  return (
    <Pressable
      style={[
        styles.card,
        { backgroundColor: colors.background.primary, borderColor: colors.border.medium },
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.heroFull} resizeMode="cover" />
      ) : (
        <View
          style={[
            styles.heroFull,
            styles.heroPlaceholder,
            { backgroundColor: colors.background.tertiary },
          ]}
        >
          <Mountain size={40} color={colors.text.tertiary} strokeWidth={1.5} />
        </View>
      )}

      {rating > 0 && (
        <View
          style={[
            styles.ratingBadge,
            { backgroundColor: 'rgba(255,255,255,0.92)', borderColor: colors.border.medium },
          ]}
        >
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
        {categoryNames.length > 0 && (
          <View style={styles.categoryRow}>
            <CategoryChip
              categoryId={categoryIds[0]}
              categoryName={categoryNames[0]}
              variant="small"
            />
            {categoryNames.length > 1 && (
              <View style={[styles.categoryChip, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                <Text style={[styles.categoryText, { color: '#FFFFFF' }]}>
                  +{categoryNames.length - 1}
                </Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.title} numberOfLines={2}>
          {name}
        </Text>

        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}

        {locationLabel && (
          <View style={styles.infoRow}>
            <MapPin size={14} color="rgba(255,255,255,0.85)" strokeWidth={2} />
            <Text style={styles.infoText} numberOfLines={1}>
              {locationLabel}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
});
