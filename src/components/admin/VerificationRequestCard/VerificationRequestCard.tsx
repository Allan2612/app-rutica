import { memo } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import {
  Check,
  X,
  Store,
  CalendarDays,
  Landmark,
  Tag,
  MapPin,
  User,
  Eye,
  Edit2,
} from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { StatusBadge } from '@/components/ui';
import type { VerificationEntityType } from '@/features/admin/services/verification.service';
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

const TYPE_LABELS: Record<VerificationEntityType, string> = {
  business: 'Negocio',
  event: 'Evento',
  attraction: 'Atracción',
  promotion: 'Promoción',
};

// Dynamic colors based on theme
function getTypeColors(type: VerificationEntityType, isDark: boolean): { bg: string; text: string } {
  const colors = {
    business: isDark 
      ? { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa' }
      : { bg: '#dbeafe', text: '#1e40af' },
    event: isDark 
      ? { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24' }
      : { bg: '#fef3c7', text: '#92400e' },
    attraction: isDark 
      ? { bg: 'rgba(16, 185, 129, 0.2)', text: '#34d399' }
      : { bg: '#d1fae5', text: '#065f46' },
    promotion: isDark 
      ? { bg: 'rgba(236, 72, 153, 0.2)', text: '#f472b6' }
      : { bg: '#fce7f3', text: '#9d174d' },
  };
  return colors[type];
}

export const VerificationRequestCard = memo(function VerificationRequestCard({
  id,
  type,
  name,
  description,
  ownerName,
  imageUrl,
  moderationStatus,
  createdAt,
  locationLabel,
  onManageStatus,
  onView,
  onEdit,
  isProcessing = false,
}: VerificationRequestCardProps) {
  const colors = useThemedColors();
  const typeColors = getTypeColors(type, colors.isDark);
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
              backgroundColor: colors.background.tertiary,
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
              backgroundColor: colors.background.tertiary,
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
              backgroundColor: colors.warning,
              opacity: pressed || isProcessing ? 0.7 : 1,
            },
          ]}
          onPress={onManageStatus}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Check color="#fff" size={16} strokeWidth={2.5} />
              <Text style={[styles.actionText, { color: '#fff' }]}>Estado</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
});
