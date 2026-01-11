import { memo, useMemo } from 'react';
import { Pressable, Text, View, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { styles } from './styles';
import { BusinessImage } from '../../../types/entities';
import { ModerationStatus } from '../../../types/enums';
import { getImageUrl } from '../../../features/business/services/business.service';
import { StatusBadge } from '../../ui/StatusBadge';

export interface BusinessCardProps {
  name: string;
  description?: string;
  whatsapp?: string | null;
  status: ModerationStatus;
  onPress?: () => void;
  imageUrl?: string | null;
  location?: string | null;
  businessImages?: BusinessImage[];
  logo?: BusinessImage | null;
}

export const BusinessCard = memo(function BusinessCard({
  name,
  description,
  whatsapp,
  status,
  onPress,
  imageUrl,
  location,
  businessImages = [],
  logo,
}: BusinessCardProps) {
  // Obtener URL del logo (memoizado)
  const logoUrl = useMemo(
    () => (logo ? getImageUrl('business-logos', logo.path_BIM) : null),
    [logo]
  );

  // Obtener URLs de imágenes del negocio (memoizado)
  const galleryImages = useMemo(
    () =>
      businessImages
        .sort((a, b) => a.sort_order_BIM - b.sort_order_BIM)
        .map((img) => ({
          ...img,
          url: getImageUrl('business-images', img.path_BIM),
        })),
    [businessImages]
  );

  // Usar primera imagen de galería o logo como imagen principal
  const heroImageUrl = galleryImages.length > 0 ? galleryImages[0].url : logoUrl || imageUrl;

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
    >
      {/* Hero Image */}
      {heroImageUrl ? (
        <Image 
          source={{ uri: heroImageUrl }} 
          style={styles.hero}
          contentFit="cover"
          transition={300}
          placeholder={require('../../../../assets/logo.png')}
          placeholderContentFit="contain"
          cachePolicy="memory-disk"
        />
      ) : (
        <View style={[styles.hero, styles.heroPlaceholder]} />
      )}

      {/* Logo + Header */}
      <View style={styles.headerContainer}>
        {logoUrl && (
          <Image 
            source={{ uri: logoUrl }} 
            style={styles.logo}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        )}
        <View style={styles.headerContent}>
          <Text style={styles.name}>{name}</Text>
          <StatusBadge status={status} />
        </View>
      </View>

      {description ? (
        <Text
          style={styles.description}
          numberOfLines={2}
        >
          {description}
        </Text>
      ) : null}

      {/* WhatsApp Contact */}
      {whatsapp && (
        <View style={styles.whatsappContainer}>
          <Text style={styles.whatsappIcon}>💬</Text>
          <Text style={styles.whatsappText}>{whatsapp}</Text>
        </View>
      )}

      {/* Gallery Thumbnails */}
      {galleryImages.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.galleryContainer}
          contentContainerStyle={styles.galleryContent}
        >
          {galleryImages.map((img, index) => (
            <Image
              key={`${img.path_BIM}-${index}`}
              source={{ uri: img.url }}
              style={styles.galleryThumbnail}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          ))}
        </ScrollView>
      )}

      {location ? (
        <Text style={styles.location} numberOfLines={1}>{location}</Text>
      ) : null}
    </Pressable>
  );
});
