import { memo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { MapPin, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';
import { getCategoryColorScheme } from '@/utils/categoryColors';

export interface BusinessCardProps {
  name: string;
  description?: string | null;
  categoryName?: string | null;
  categoryId?: string | null;
  locationLabel?: string | null;
  imageUrl?: string | null;
  logoUrl?: string | null;
  rating?: number;
  reviewCount?: number;
  onPress?: () => void;
}

export const BusinessCard = memo(function BusinessCard({
  name,
  description,
  categoryName,
  categoryId = null,
  locationLabel,
  imageUrl,
  logoUrl,
  rating = 4.5,
  reviewCount = 20,
  onPress,
}: BusinessCardProps) {
  const colors = useThemedColors();
  const categoryColor = getCategoryColorScheme(categoryId);
  
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

      <View style={[styles.ratingBadge, { backgroundColor: 'rgba(255,255,255,0.92)', borderColor: colors.border.medium }]}>
        <Star size={16} color="#fbbf24" fill="#fbbf24" />
        <Text style={[styles.ratingValue, { color: colors.text.primary }]}>{rating.toFixed(1)}</Text>
        <Text style={[styles.ratingCount, { color: colors.text.tertiary }]}>({reviewCount})</Text>
      </View>

      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientOverlay}
      />

      <View style={styles.content}>
        <Text style={styles.title}>{name}</Text>

        {description ? (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          {categoryName ? (
            <View
              style={[
                styles.categoryChip,
                { backgroundColor: categoryColor.backgroundColor },
              ]}
            >
              <Text style={[styles.categoryText, { color: categoryColor.textColor }]}>
                {categoryName}
              </Text>
            </View>
          ) : null}
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
