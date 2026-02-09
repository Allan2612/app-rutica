import { memo } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Mountain, Star } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { getCategoryColorScheme } from '@/utils/categoryColors';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { styles } from '../styles';

interface AttractionContentProps {
  name: string;
  description?: string | null;
  categoryNames: string[];
  categoryIds: string[];
  isApproved: boolean;
  showAllCategories: boolean;
  onToggleCategories: () => void;
  authorName?: string | null;
  authorAvatarUrl?: string | null;
  createdAt?: string;
  rating?: number;
  reviewCount?: number;
  getInitials: (name: string) => string;
  getTimeAgo: (date: string) => string;
}

const MAX_VISIBLE_CATEGORIES = 3;

export const AttractionContent = memo(function AttractionContent({
  name,
  description,
  categoryNames,
  categoryIds,
  isApproved,
  showAllCategories,
  onToggleCategories,
  authorName,
  authorAvatarUrl,
  createdAt,
  rating = 0,
  reviewCount = 0,
  getInitials,
  getTimeAgo,
}: AttractionContentProps) {
  const colors = useThemedColors();

  const categoriesToShow = showAllCategories
    ? categoryNames
    : categoryNames.slice(0, MAX_VISIBLE_CATEGORIES);
  const extraCategoriesCount = showAllCategories
    ? 0
    : categoryNames.length - MAX_VISIBLE_CATEGORIES;

  return (
    <>
      {/* Header con autor */}
      <View style={styles.header}>
        {authorAvatarUrl ? (
          <ExpoImage
            source={{ uri: authorAvatarUrl }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[styles.avatar, { backgroundColor: colors.primary[100] }]}>
            {authorName ? (
              <Text style={[styles.avatarText, { color: colors.primary[700] }]}>
                {getInitials(authorName)}
              </Text>
            ) : (
              <Mountain size={20} color={colors.primary[600]} />
            )}
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={[styles.authorName, { color: colors.text.primary }]}>
            {authorName ?? 'Rutica'}
          </Text>
          <Text style={[styles.metaText, { color: colors.text.secondary }]}>
            {createdAt ? getTimeAgo(createdAt) : ''}
          </Text>
        </View>
        {/* Rating a la derecha */}
        {rating > 0 && (
          <View style={styles.headerRating}>
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <Text style={[styles.ratingText, { color: colors.text.secondary }]}>
              {rating.toFixed(1)} ({reviewCount})
            </Text>
          </View>
        )}
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text.primary }]}>{name}</Text>
          {isApproved && (
            <Image
              source={require('../../../../../assets/verification.png')}
              style={{ width: 18, height: 18, marginLeft: 6 }}
              resizeMode="contain"
            />
          )}
        </View>
        {description && (
          <Text style={[styles.description, { color: colors.text.secondary }]} numberOfLines={3}>
            {description}
          </Text>
        )}

        {/* Categorías */}
        {categoryNames.length > 0 && (
          <View style={styles.categoriesRow}>
            {categoriesToShow.map((catName, index) => (
              <CategoryChip
                key={categoryIds[index] ?? index}
                categoryId={categoryIds[index]}
                categoryName={catName}
                variant="small"
              />
            ))}
            {extraCategoriesCount > 0 && (
              <Pressable
                onPress={onToggleCategories}
                style={[styles.categoryChip, { backgroundColor: colors.background.tertiary }]}
              >
                <Text style={[styles.categoryText, { color: colors.text.secondary }]}>
                  +{extraCategoriesCount}
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </>
  );
});
