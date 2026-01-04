import { memo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { styles } from './styles';

export interface PromoCardProps {
  title: string;
  business?: string | null;
  description?: string | null;
  discountLabel?: string | null;
  imageUrl?: string | null;
  onPress?: () => void;
}

export const PromoCard = memo(function PromoCard({
  title,
  business,
  description,
  discountLabel,
  imageUrl,
  onPress,
}: PromoCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress} disabled={!onPress}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <View style={styles.overlay} />
      {discountLabel ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{discountLabel}</Text>
        </View>
      ) : null}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {business ? (
          <Text style={styles.business} numberOfLines={1}>
            {business}
          </Text>
        ) : null}
        {description ? (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
});
