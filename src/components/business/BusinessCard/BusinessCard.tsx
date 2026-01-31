import { memo, useCallback } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Heart, MapPin, Star, Tag } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemedColors } from '@/hooks';
import { useAuthStore } from '@/store';
import { useBusinessFavoriteIds } from '@/features/business/hooks/useBusinessFavorites';
import { useToggleBusinessFavorite } from '@/features/business/hooks/useToggleBusinessFavorite';
import { styles } from './styles';
import { getCategoryColorScheme } from '@/utils/categoryColors';

export interface BusinessCardProps {
  id: string;
  name: string;
  categoryNames?: string[];
  categoryIds?: string[];
  locationLabel?: string | null;
  imageUrl?: string | null;
  logoUrl?: string | null;
  rating?: number;
  reviewCount?: number;
  isApproved?: boolean;
  hasActivePromotions?: boolean;
  onPress?: () => void;
}

export const BusinessCard = memo(function BusinessCard({
  id,
  name,
  categoryNames = [],
  categoryIds = [],
  locationLabel,
  imageUrl,
  logoUrl,
  rating = 4.5,
  reviewCount = 20,
  isApproved = false,
  hasActivePromotions = false,
  onPress,
}: BusinessCardProps) {
  const colors = useThemedColors();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: favoriteIds = [] } = useBusinessFavoriteIds();
  const { mutate: toggleFavorite, isPending } = useToggleBusinessFavorite();

  const isFavorite = favoriteIds.includes(id);

  const handleToggleFavorite = useCallback((e: any) => {
    e.stopPropagation?.();
    if (!isAuthenticated || isPending) return;
    toggleFavorite(id);
  }, [id, isAuthenticated, isPending, toggleFavorite]);

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
          {/* NEW: Promotion Badge */}
          {hasActivePromotions && (
            <View style={styles.promotionBadge}>
              <Tag size={12} color="#000000" strokeWidth={2.5} />
            </View>
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
            {/* Botón de favoritos */}
            {isAuthenticated && (
              <Pressable
                style={[
                  styles.favoriteButton,
                  {
                    backgroundColor: isFavorite ? 'rgba(239, 68, 68, 0.95)' : 'rgba(255,255,255,0.92)',
                    borderColor: colors.border.medium,
                  }
                ]}
                onPress={handleToggleFavorite}
                disabled={isPending}
              >
                <Heart
                  size={16}
                  color={isFavorite ? '#ffffff' : '#ef4444'}
                  fill={isFavorite ? '#ffffff' : 'transparent'}
                />
              </Pressable>
            )}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
});
