// ============================================
// Event Detail View Component
// ============================================

import { memo } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import {
  MapPin,
  User,
  Calendar,
  Tag,
  CalendarDays,
  Star,
  Clock,
  Users,
  Ticket,
  DollarSign,
} from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { StatusBadge } from '@/components/ui';
import {
  InfoCard,
  CategoryChips,
  RatingDisplay,
  DateRangeDisplay,
  ContactInfo,
  SocialLinksDisplay,
  ActiveToggle,
  ImageGallery,
  ModerationNote,
} from '../../common';
import { formatDateAdmin, formatCurrency } from '@/features/admin/services/helpers';
import { styles } from './styles';
import type { EventVerificationRequest } from '@/features/admin/types';

interface EventDetailViewProps {
  request: EventVerificationRequest;
  onToggleActive?: (isActive: boolean) => void;
  isProcessing?: boolean;
}

export const EventDetailView = memo(function EventDetailView({
  request,
  onToggleActive,
  isProcessing = false,
}: EventDetailViewProps) {
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
          <CalendarDays size={48} color={colors.text.tertiary} />
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

      {/* Date Range - Important for Events */}
      <InfoCard
        icon={<Clock size={18} color={colors.warning} />}
        title="Fecha y Hora del Evento"
      >
        <DateRangeDisplay startAt={metadata.startAt} endAt={metadata.endAt} />
      </InfoCard>

      {/* Price Info */}
      <InfoCard
        icon={<DollarSign size={18} color={colors.success} />}
        title="Precio"
      >
        <View style={styles.priceContainer}>
          {metadata.isFree ? (
            <View style={[styles.freeBadge, { backgroundColor: colors.success }]}>
              <Text style={styles.freeBadgeText}>GRATIS</Text>
            </View>
          ) : (
            <Text style={[styles.priceValue, { color: colors.text.primary }]}>
              {formatCurrency(metadata.price)}
            </Text>
          )}
        </View>
      </InfoCard>

      {/* Capacity */}
      {metadata.capacity && (
        <InfoCard
          icon={<Users size={18} color={colors.info} />}
          title="Capacidad"
          value={`${metadata.capacity} personas`}
        />
      )}

      {/* Ticket URL */}
      {metadata.ticketUrl && (
        <InfoCard
          icon={<Ticket size={18} color={colors.primary[500]} />}
          title="Enlace de Tickets"
          value={metadata.ticketUrl}
          valueColor={colors.primary[500]}
        />
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

      {/* Contact Info */}
      <ContactInfo
        phone={metadata.phone}
        email={metadata.email}
        website={metadata.website}
      />

      {/* Social Links */}
      <SocialLinksDisplay socialLinks={metadata.socialLinks} />

      {/* Image Gallery */}
      {request.images.length > 0 && (
        <ImageGallery images={request.images} />
      )}

      {/* Moderation Note */}
      <ModerationNote note={request.moderationNote} />

      {/* Creator */}
      <InfoCard
        icon={<User size={18} color={colors.text.secondary} />}
        title="Creado Por"
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
