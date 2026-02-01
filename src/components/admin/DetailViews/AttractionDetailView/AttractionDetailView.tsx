// ============================================
// Attraction Detail View Component
// ============================================

import { memo } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import {
  MapPin,
  User,
  Calendar,
  Tag,
  Landmark,
  Star,
} from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { StatusBadge } from '@/components/ui';
import {
  InfoCard,
  CategoryChips,
  RatingDisplay,
  ActiveToggle,
  ImageGallery,
  ModerationNote,
} from '../../common';
import { formatDateAdmin } from '@/features/admin/services/helpers';
import { styles } from './styles';
import type { AttractionVerificationRequest } from '@/features/admin/types';

interface AttractionDetailViewProps {
  request: AttractionVerificationRequest;
  onToggleActive?: (isActive: boolean) => void;
  isProcessing?: boolean;
}

export const AttractionDetailView = memo(function AttractionDetailView({
  request,
  onToggleActive,
  isProcessing = false,
}: AttractionDetailViewProps) {
  const colors = useThemedColors();
  const { metadata } = request;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      nestedScrollEnabled={true}
      bounces={true}
      scrollEnabled={true}
      scrollEventThrottle={16}
      overScrollMode="always"
      alwaysBounceVertical={true}
    >
      {/* Main Image */}
      {request.imageUrl ? (
        <Image
          source={{ uri: request.imageUrl }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.background.tertiary }]}>
          <Landmark size={48} color={colors.text.tertiary} />
          <Text style={[styles.placeholderText, { color: colors.text.tertiary }]}>
            Sin imagen
          </Text>
        </View>
      )}

      {/* Name */}
      <Text style={[styles.entityName, { color: colors.text.primary }]}>
        {request.name}
      </Text>

      {/* Description */}
      {request.description && (
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          {request.description}
        </Text>
      )}

      {/* Status Row */}
      <View style={styles.statusRow}>
        <StatusBadge status={request.moderationStatus} size="md" />
        <View style={[
          styles.activeIndicator,
          { backgroundColor: request.isActive ? colors.success : colors.error }
        ]}>
          <Text style={styles.activeIndicatorText}>
            {request.isActive ? 'Visible' : 'Oculto'}
          </Text>
        </View>
      </View>

      {/* Active Toggle */}
      {onToggleActive && (
        <View style={[styles.toggleWrapper, { backgroundColor: colors.background.secondary }]}>
          <ActiveToggle
            isActive={request.isActive}
            onToggle={onToggleActive}
            disabled={isProcessing}
          />
        </View>
      )}

      {/* Rating & Reviews */}
      {(metadata.avgRating > 0 || metadata.reviewsCount > 0) && (
        <InfoCard
          icon={<Star size={18} color={colors.warning} fill={colors.warning} />}
          title="Calificación"
        >
          <RatingDisplay rating={metadata.avgRating} reviewsCount={metadata.reviewsCount} />
        </InfoCard>
      )}

      {/* Categories */}
      {metadata.categoriesNames.length > 0 && (
        <InfoCard
          icon={<Tag size={18} color={colors.primary[500]} />}
          title="Categorías"
        >
          <CategoryChips categories={metadata.categoriesNames} />
        </InfoCard>
      )}

      {/* Location */}
      {request.locationLabel && (
        <InfoCard
          icon={<MapPin size={18} color={colors.text.secondary} />}
          title="Ubicación"
          value={request.locationLabel}
        />
      )}

      {/* Image Gallery */}
      {request.images.length > 0 && (
        <ImageGallery images={request.images} />
      )}

      {/* Moderation Note */}
      <ModerationNote note={request.moderationNote} />

      {/* Submitted By */}
      <InfoCard
        icon={<User size={18} color={colors.text.secondary} />}
        title="Colaborador"
        value={request.ownerName}
      />

      {/* Created Date */}
      <InfoCard
        icon={<Calendar size={18} color={colors.text.secondary} />}
        title="Fecha de Registro"
        value={formatDateAdmin(request.createdAt)}
      />
    </ScrollView>
  );
});
