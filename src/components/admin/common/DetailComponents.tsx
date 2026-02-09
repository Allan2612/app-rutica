// ============================================
// Admin Module - Shared UI Components
// ============================================

import { memo, useCallback, useState } from 'react';
import { View, Text, Image, Pressable, Switch, ScrollView, Modal, Platform } from 'react-native';
import {
  Star,
  Phone,
  Mail,
  Globe,
  ImageIcon,
  MessageSquare,
  X,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Video,
} from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { formatDateShort } from '@/features/admin/services/helpers';
import { styles } from './styles';

// ============================================
// Info Card Component
// ============================================

interface InfoCardProps {
  icon?: React.ReactNode;
  title: string;
  value?: string | number | null | undefined;
  valueColor?: string;
  children?: React.ReactNode;
}

export const InfoCard = memo(function InfoCard({
  icon,
  title,
  value,
  valueColor,
  children,
}: InfoCardProps) {
  const colors = useThemedColors();

  return (
    <View style={[styles.infoCard, { backgroundColor: colors.background.secondary }]}>
      <View style={styles.infoCardHeader}>
        {icon}
        <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>{title}</Text>
      </View>
      {children ? (
        children
      ) : (
        <Text
          style={[styles.infoCardValue, { color: valueColor || colors.text.primary }]}
          allowFontScaling={false}
        >
          {value ?? 'No especificado'}
        </Text>
      )}
    </View>
  );
});

// ============================================
// Category Chips Component
// ============================================

interface CategoryChipsProps {
  categories: string[];
}

export const CategoryChips = memo(function CategoryChips({ categories }: CategoryChipsProps) {
  const colors = useThemedColors();

  if (categories.length === 0) return null;

  return (
    <View style={styles.categoryList}>
      {categories.map((cat, index) => (
        <View
          key={index}
          style={[
            styles.categoryChip,
            {
              backgroundColor: colors.isDark ? 'rgba(59, 130, 246, 0.15)' : colors.primary[50],
              borderColor: colors.isDark ? colors.primary[500] : colors.primary[200],
            },
          ]}
        >
          <Text
            style={[
              styles.categoryChipText,
              {
                color: colors.isDark ? colors.primary[400] : colors.primary[700],
              },
            ]}
          >
            {cat}
          </Text>
        </View>
      ))}
    </View>
  );
});

// ============================================
// Rating Display Component
// ============================================

interface RatingDisplayProps {
  rating: number;
  reviewsCount: number;
}

export const RatingDisplay = memo(function RatingDisplay({
  rating,
  reviewsCount,
}: RatingDisplayProps) {
  const colors = useThemedColors();

  return (
    <View style={styles.ratingContainer}>
      <Star size={18} color={colors.warning} fill={colors.warning} />
      <Text style={[styles.ratingValue, { color: colors.text.primary }]}>{rating.toFixed(1)}</Text>
      <Text style={[styles.ratingCount, { color: colors.text.secondary }]}>
        ({reviewsCount} reseñas)
      </Text>
    </View>
  );
});

// ============================================
// Date Range Display Component
// ============================================

interface DateRangeDisplayProps {
  startAt: string | null;
  endAt: string | null;
}

export const DateRangeDisplay = memo(function DateRangeDisplay({
  startAt,
  endAt,
}: DateRangeDisplayProps) {
  const colors = useThemedColors();

  return (
    <View style={styles.dateRange}>
      <View style={styles.dateItem}>
        <Text style={[styles.dateLabel, { color: colors.text.secondary }]}>Inicio</Text>
        <Text style={[styles.dateValue, { color: colors.text.primary }]}>
          {formatDateShort(startAt)}
        </Text>
      </View>
      <View style={[styles.dateSeparator, { backgroundColor: colors.border.light }]} />
      <View style={styles.dateItem}>
        <Text style={[styles.dateLabel, { color: colors.text.secondary }]}>Fin</Text>
        <Text style={[styles.dateValue, { color: colors.text.primary }]}>
          {formatDateShort(endAt)}
        </Text>
      </View>
    </View>
  );
});

// ============================================
// Active Toggle Component
// ============================================

interface ActiveToggleProps {
  isActive: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}

export const ActiveToggle = memo(function ActiveToggle({
  isActive,
  onToggle,
  disabled = false,
}: ActiveToggleProps) {
  const colors = useThemedColors();

  return (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleInfo}>
        <Text style={[styles.toggleLabel, { color: colors.text.primary }]}>
          Estado de Visibilidad
        </Text>
        <Text style={[styles.toggleStatus, { color: isActive ? colors.success : colors.error }]}>
          {isActive ? 'Activo (Visible)' : 'Inactivo (Oculto)'}
        </Text>
      </View>
      <Switch
        value={isActive}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: colors.background.tertiary, true: colors.success }}
        thumbColor={isActive ? colors.text.inverse : colors.text.tertiary}
      />
    </View>
  );
});

// ============================================
// Image Gallery Component with Lightbox
// ============================================

interface ImageGalleryProps {
  images: { url: string; type?: string }[];
}

export const ImageGallery = memo(function ImageGallery({ images }: ImageGalleryProps) {
  const colors = useThemedColors();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (images.length === 0) return null;

  const handleImagePress = useCallback((url: string) => {
    setSelectedImage(url);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  return (
    <View style={styles.galleryContainer}>
      <View style={styles.galleryHeader}>
        <ImageIcon size={18} color={colors.text.secondary} />
        <Text style={[styles.galleryTitle, { color: colors.text.primary }]}>
          Galería ({images.length})
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={Platform.OS === 'web'}
        contentContainerStyle={styles.galleryScroll}
        scrollEnabled={true}
        nestedScrollEnabled={false}
        directionalLockEnabled={true}
        style={[
          styles.galleryScrollView,
          Platform.OS === 'web' && {
            // @ts-ignore - Web-only CSS properties
            overflowX: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: `${colors.border.medium} ${colors.background.secondary}`,
          },
        ]}
      >
        {images.map((img, index) => (
          <Pressable
            key={index}
            onPress={() => handleImagePress(img.url)}
            style={({ pressed }) => [styles.galleryImageWrapper, pressed && { opacity: 0.8 }]}
          >
            <Image source={{ uri: img.url }} style={styles.galleryImage} resizeMode="cover" />
          </Pressable>
        ))}
      </ScrollView>

      {/* Image Lightbox Modal */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <Pressable
          style={[styles.lightboxOverlay, { backgroundColor: colors.overlay.dark }]}
          onPress={handleCloseModal}
        >
          <Pressable style={styles.lightboxContent} onPress={(e) => e.stopPropagation()}>
            <Pressable
              style={[styles.lightboxCloseButton, { backgroundColor: colors.overlay.light }]}
              onPress={handleCloseModal}
            >
              <X size={24} color={colors.text.inverse} />
            </Pressable>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.lightboxImage}
                resizeMode="contain"
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
});

// ============================================
// Contact Info Section Component
// ============================================

interface ContactInfoProps {
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}

export const ContactInfo = memo(function ContactInfo({ phone, email, website }: ContactInfoProps) {
  const colors = useThemedColors();

  if (!phone && !email && !website) return null;

  return (
    <View style={[styles.contactSection, { backgroundColor: colors.background.secondary }]}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Información de Contacto
      </Text>
      {phone && (
        <View style={styles.contactRow}>
          <Phone size={16} color={colors.text.secondary} />
          <Text style={[styles.contactText, { color: colors.text.primary }]}>{phone}</Text>
        </View>
      )}
      {email && (
        <View style={styles.contactRow}>
          <Mail size={16} color={colors.text.secondary} />
          <Text style={[styles.contactText, { color: colors.text.primary }]}>{email}</Text>
        </View>
      )}
      {website && (
        <View style={styles.contactRow}>
          <Globe size={16} color={colors.text.secondary} />
          <Text style={[styles.contactText, { color: colors.primary[500] }]}>{website}</Text>
        </View>
      )}
    </View>
  );
});

// ============================================
// Moderation Note Display Component
// ============================================

interface ModerationNoteProps {
  note: string | null | undefined;
}

export const ModerationNote = memo(function ModerationNote({ note }: ModerationNoteProps) {
  const colors = useThemedColors();

  if (!note) return null;

  return (
    <View style={[styles.noteContainer, { backgroundColor: colors.background.secondary }]}>
      <View style={styles.noteHeader}>
        <MessageSquare size={16} color={colors.warning} />
        <Text style={[styles.noteTitle, { color: colors.text.primary }]}>Nota de Moderación</Text>
      </View>
      <Text style={[styles.noteText, { color: colors.text.secondary }]}>{note}</Text>
    </View>
  );
});

// ============================================
// Social Links Display Component
// ============================================

interface SocialLinksProps {
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    whatsapp?: string;
  } | null;
}

export const SocialLinksDisplay = memo(function SocialLinksDisplay({
  socialLinks,
}: SocialLinksProps) {
  const colors = useThemedColors();

  if (!socialLinks) return null;

  const { facebook, instagram, tiktok, youtube, whatsapp } = socialLinks;

  // Only show if at least one social link exists
  if (!facebook && !instagram && !tiktok && !youtube && !whatsapp) return null;

  return (
    <View style={[styles.contactSection, { backgroundColor: colors.background.secondary }]}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Redes Sociales</Text>
      {facebook && (
        <View style={styles.contactRow}>
          <Facebook size={16} color={colors.social.facebook} />
          <Text style={[styles.contactText, { color: colors.text.primary }]} numberOfLines={1}>
            {facebook}
          </Text>
        </View>
      )}
      {instagram && (
        <View style={styles.contactRow}>
          <Instagram size={16} color={colors.social.instagram} />
          <Text style={[styles.contactText, { color: colors.text.primary }]} numberOfLines={1}>
            {instagram}
          </Text>
        </View>
      )}
      {tiktok && (
        <View style={styles.contactRow}>
          <Video size={16} color={colors.isDark ? colors.text.inverse : colors.social.tiktok} />
          <Text style={[styles.contactText, { color: colors.text.primary }]} numberOfLines={1}>
            {tiktok}
          </Text>
        </View>
      )}
      {youtube && (
        <View style={styles.contactRow}>
          <Youtube size={16} color={colors.social.youtube} />
          <Text style={[styles.contactText, { color: colors.text.primary }]} numberOfLines={1}>
            {youtube}
          </Text>
        </View>
      )}
      {whatsapp && (
        <View style={styles.contactRow}>
          <MessageCircle size={16} color={colors.social.whatsapp} />
          <Text style={[styles.contactText, { color: colors.text.primary }]} numberOfLines={1}>
            {whatsapp}
          </Text>
        </View>
      )}
    </View>
  );
});
