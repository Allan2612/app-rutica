import { memo } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import {
  Check,
  Store,
  CalendarDays,
  Landmark,
  Tag,
  MapPin,
  User,
  Eye,
  Edit2,
  EyeOff,
} from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { StatusBadge } from '@/components/ui';
import { TYPE_LABELS, type VerificationEntityType } from '@/features/admin/types';
import type { ModerationStatus } from '@/types/enums';
import { styles } from './styles';

export interface VerificationRequestCardProps {
  id: string;
  type: VerificationEntityType;
  name: string;
  description: string | null;
  ownerName: string;
  imageUrl: string | null;
  moderationStatus: ModerationStatus;
  isActive?: boolean;
  createdAt: string;
  locationLabel: string | null;
  onManageStatus?: () => void;
  onView?: () => void;
  onEdit?: () => void;
  isProcessing?: boolean;
}

const TYPE_ICONS: Record<VerificationEntityType, typeof Store> = {
  business: Store,
  event: CalendarDays,
  attraction: Landmark,
  promotion: Tag,
};

export const VerificationRequestCard = memo(function VerificationRequestCard({
  id,
  type,
  name,
  description,
  ownerName,
  imageUrl,
  moderationStatus,
  isActive = true,
  createdAt,
  locationLabel,
  onManageStatus,
  onView,
  onEdit,
  isProcessing = false,
}: VerificationRequestCardProps) {
  const colors = useThemedColors();
  const typeColors = colors.entityTypes[type];
  const Icon = TYPE_ICONS[type];
  const typeLabel = TYPE_LABELS[type];

  const formattedDate = new Date(createdAt).toLocaleDateString('es-CR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.background.primary, borderColor: colors.border.medium },
      ]}
    >
      <View style={styles.cardContent}>
        {/* Imagen */}
        <View style={[styles.imageContainer, { backgroundColor: colors.background.tertiary }]}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon color={colors.text.tertiary} size={28} strokeWidth={1.5} />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={[styles.name, { color: colors.text.primary }]} numberOfLines={2}>
                {name}
              </Text>
              {/* Type Badge */}
              <View style={[styles.typeBadge, { backgroundColor: typeColors.bg }]}>
                <Text style={[styles.typeText, { color: typeColors.text }]}>{typeLabel}</Text>
              </View>
            </View>

            {/* Status Badge */}
            <View style={styles.statusRow}>
              <StatusBadge status={moderationStatus} size="sm" />
              {!isActive && (
                <View style={[styles.inactiveBadge, { backgroundColor: colors.error }]}>
                  <EyeOff size={10} color={colors.text.inverse} strokeWidth={2.5} />
                </View>
              )}
            </View>
          </View>

          {/* Descripción */}
          {description && (
            <Text
              style={[styles.description, { color: colors.text.secondary }]}
              numberOfLines={2}
            >
              {description}
            </Text>
          )}

          {/* Owner */}
          <View style={styles.ownerRow}>
            <User color={colors.text.tertiary} size={12} strokeWidth={2} />
            <Text style={[styles.ownerText, { color: colors.text.tertiary }]}>{ownerName}</Text>
          </View>

          {/* Location or Business Name (for promotions) */}
          {locationLabel && (
            <View style={styles.metaRow}>
              <MapPin color={colors.text.tertiary} size={12} strokeWidth={2} />
              <Text style={[styles.metaText, { color: colors.text.tertiary }]}>
                {locationLabel}
              </Text>
            </View>
          )}

          {/* Date */}
          <View style={styles.metaRow}>
            <CalendarDays color={colors.text.tertiary} size={12} strokeWidth={2} />
            <Text style={[styles.metaText, { color: colors.text.tertiary }]}>
              {formattedDate}
            </Text>
          </View>
        </View>
      </View>

      {/* Acciones */}
      <View style={[styles.actions, { borderTopColor: colors.border.light }]}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            {
              backgroundColor: colors.primary[500] + '15',
              borderColor: colors.primary[500],
              opacity: pressed || isProcessing ? 0.7 : 1,
            },
          ]}
          onPress={onView}
          disabled={isProcessing}
        >
          <Eye color={colors.primary[500]} size={16} strokeWidth={2} />
          <Text style={[styles.actionText, { color: colors.primary[500] }]}>Ver</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            {
              backgroundColor: colors.info + '15',
              borderColor: colors.info,
              opacity: pressed || isProcessing ? 0.7 : 1,
            },
          ]}
          onPress={onEdit}
          disabled={isProcessing}
        >
          <Edit2 color={colors.info} size={16} strokeWidth={2} />
          <Text style={[styles.actionText, { color: colors.info }]}>Editar</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            {
              backgroundColor: colors.warning + '15',
              borderColor: colors.warning,
              opacity: pressed || isProcessing ? 0.7 : 1,
            },
          ]}
          onPress={onManageStatus}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={colors.warning} />
          ) : (
            <>
              <Check color={colors.warning} size={16} strokeWidth={2.5} />
              <Text style={[styles.actionText, { color: colors.warning }]}>Estado</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
});
