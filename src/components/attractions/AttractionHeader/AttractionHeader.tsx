import { memo, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { styles } from './styles';

interface AttractionHeaderProps {
  name: string;
  description: string | null;
  categoryIds: string[];
  categoryNames: string[];
  locationLabel: string | null;
  isApproved?: boolean;
  authorName?: string | null;
}

export const AttractionHeader = memo(
  ({
    name,
    description,
    categoryIds,
    categoryNames,
    locationLabel,
    isApproved = false,
    authorName,
  }: AttractionHeaderProps) => {
    const colors = useThemedColors();
    const [expandedDescription, setExpandedDescription] = useState(false);

    const shouldTruncate = description && description.length > 200;
    const displayDescription =
      shouldTruncate && !expandedDescription ? `${description.substring(0, 200)}...` : description;

    return (
      <View style={styles.header}>
        <View style={styles.infoSection}>
          {/* Name + Verification */}
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.text.primary }]}>{name}</Text>
            {isApproved && (
              <Image
                source={require('../../../../assets/verification.png')}
                style={styles.verificationIcon}
                resizeMode="contain"
              />
            )}
          </View>

          {/* Description */}
          {description && (
            <View style={styles.descriptionContainer}>
              <Text style={[styles.description, { color: colors.text.primary }]}>
                {displayDescription}
              </Text>
              {shouldTruncate && (
                <Pressable onPress={() => setExpandedDescription(!expandedDescription)}>
                  <Text style={[styles.readMoreText, { color: colors.primary[500] }]}>
                    {expandedDescription ? 'Ver menos' : 'Ver más'}
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Categories */}
          {categoryNames.length > 0 && (
            <View style={styles.categoriesRow}>
              {categoryNames.map((catName, idx) => (
                <CategoryChip
                  key={categoryIds[idx] || idx}
                  categoryId={categoryIds[idx]}
                  categoryName={catName}
                  variant="small"
                />
              ))}
            </View>
          )}

          {/* Location */}
          {locationLabel && (
            <View style={styles.locationRow}>
              <MapPin size={18} color={colors.primary[500]} />
              <Text style={[styles.locationText, { color: colors.primary[500] }]}>
                {locationLabel}
              </Text>
            </View>
          )}

          {/* Author */}
          {authorName && (
            <Text style={[styles.authorText, { color: colors.text.tertiary }]}>
              Publicado por {authorName}
            </Text>
          )}
        </View>
      </View>
    );
  },
);

AttractionHeader.displayName = 'AttractionHeader';
