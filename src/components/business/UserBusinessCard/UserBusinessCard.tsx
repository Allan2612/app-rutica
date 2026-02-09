import { memo } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import { Edit2, MapPin, Store, Trash2, Eye, EyeOff } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { StatusBadge } from '@/components/ui';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { styles } from './styles';

export interface UserBusinessCardProps {
  name: string;
  description?: string | null;
  categoryNames: string[];
  categoryIds: string[];
  locationLabel?: string | null;
  imageUrl?: string | null;
  logoUrl?: string | null;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  moderationNote?: string | null;
  isActive: boolean;
  onProducts?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export const UserBusinessCard = memo(function UserBusinessCard({
  name,
  description,
  categoryNames,
  categoryIds,
  locationLabel,
  imageUrl,
  logoUrl,
  moderationStatus,
  moderationNote,
  isActive,
  onEdit,
  onDelete,
  onProducts,
  isDeleting = false,
}: UserBusinessCardProps) {
  const colors = useThemedColors();

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
          {logoUrl || imageUrl ? (
            <Image
              source={{ uri: logoUrl || imageUrl || '' }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Store color={colors.text.tertiary} size={32} strokeWidth={1.5} />
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

              {/* Categorías */}
              {categoryNames.length > 0 && (
                <View style={styles.categoriesRow}>
                  {categoryNames.slice(0, 3).map((cat, idx) => (
                    <CategoryChip
                      key={categoryIds[idx] || idx}
                      categoryId={categoryIds[idx]}
                      categoryName={cat}
                      variant="small"
                    />
                  ))}
                  {categoryNames.length > 3 && (
                    <View
                      style={[styles.categoryChip, { backgroundColor: colors.background.tertiary }]}
                    >
                      <Text style={[styles.categoryText, { color: colors.text.secondary }]}>
                        +{categoryNames.length - 3}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Status and Active Indicators */}
            <View style={styles.statusBadgeWrapper}>
              {isActive ? (
                <Eye size={20} color={colors.success} strokeWidth={2} />
              ) : (
                <EyeOff size={20} color={colors.text.tertiary} strokeWidth={2} />
              )}
              <StatusBadge status={moderationStatus} />
            </View>
          </View>

          {/* Descripción */}
          {description && (
            <Text style={[styles.description, { color: colors.text.secondary }]} numberOfLines={2}>
              {description}
            </Text>
          )}

          {/* Ubicación */}
          {locationLabel && (
            <View style={styles.location}>
              <MapPin color={colors.text.tertiary} size={12} strokeWidth={2} />
              <Text style={[styles.locationText, { color: colors.text.tertiary }]}>
                {locationLabel}
              </Text>
            </View>
          )}

          {/* Nota de Moderación */}
          {moderationNote && moderationStatus === 'rejected' && (
            <View
              style={[
                styles.moderationNoteContainer,
                { backgroundColor: colors.error + '15', borderColor: colors.error + '40' },
              ]}
            >
              <Text style={[styles.moderationNoteLabel, { color: colors.error }]}>
                Razón de rechazo:
              </Text>
              <Text style={[styles.moderationNoteText, { color: colors.text.primary }]}>
                {moderationNote}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Acciones */}
      <View style={[styles.actions, { borderTopColor: colors.border.light }]}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            {
              backgroundColor: colors.primary[600],
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={onProducts}
          disabled={isDeleting}
        >
          <Store color="#fff" size={16} strokeWidth={2} />
          <Text style={[styles.actionText, { color: '#fff' }]}>Productos</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            {
              backgroundColor: colors.background.tertiary,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={onEdit}
          disabled={isDeleting}
        >
          <Edit2 color={colors.primary[500]} size={16} strokeWidth={2} />
          <Text style={[styles.actionText, { color: colors.primary[500] }]}>Editar</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            {
              backgroundColor: colors.background.tertiary,
              opacity: pressed || isDeleting ? 0.5 : 1,
            },
          ]}
          onPress={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color={colors.error} />
          ) : (
            <>
              <Trash2 color={colors.error} size={16} strokeWidth={2} />
              <Text style={[styles.actionText, { color: colors.error }]}>Eliminar</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
});
