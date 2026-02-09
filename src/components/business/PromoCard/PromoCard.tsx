import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
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
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={300}
          placeholder={require('../../../../assets/logo.png')}
          placeholderContentFit="contain"
          cachePolicy="memory-disk"
        />
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
