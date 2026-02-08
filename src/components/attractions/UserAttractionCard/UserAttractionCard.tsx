import { memo } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import { Edit2, MapPin, Landmark, Trash2, Eye, EyeOff } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { StatusBadge } from '@/components/ui';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { styles } from './styles';

export interface UserAttractionCardProps {
    name: string;
    description?: string | null;
    categoryNames: string[];
    categoryIds: string[];
    locationLabel?: string | null;
    imageUrl?: string | null;
    moderationStatus: 'pending' | 'approved' | 'rejected';
    moderationNote?: string | null;
    isActive: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    isDeleting?: boolean;
}

export const UserAttractionCard = memo(function UserAttractionCard({
    name,
    description,
    categoryNames,
    categoryIds,
    locationLabel,
    imageUrl,
    moderationStatus,
    moderationNote,
    isActive,
    onEdit,
    onDelete,
    isDeleting = false,
}: UserAttractionCardProps) {
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
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Landmark color={colors.text.tertiary} size={32} strokeWidth={1.5} />
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
                                            style={[
                                                styles.categoryChip,
                                                { backgroundColor: colors.background.tertiary },
                                            ]}
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
                        <View style={styles.infoRow}>
                            <MapPin size={14} color={colors.text.secondary} strokeWidth={2} />
                            <Text style={[styles.infoText, { color: colors.text.secondary }]} numberOfLines={1}>
                                {locationLabel}
                            </Text>
                        </View>
                    )}
                    
                    {/* Nota de moderación */}
                    {moderationNote && moderationStatus === 'rejected' && (
                        <View style={[styles.moderationNoteContainer, { backgroundColor: colors.error + '15', borderColor: colors.error + '40' }]}>
                            <Text style={[styles.moderationNoteLabel, { color: colors.error }]}>Razón de rechazo:</Text>
                            <Text style={[styles.moderationNoteText, { color: colors.text.primary }]}>{moderationNote}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Acciones */}
            <View style={[styles.actions, { borderTopColor: colors.border.light }]}>
                <Pressable
                    style={[
                        styles.actionButton,
                        { borderColor: colors.border.medium, backgroundColor: colors.background.secondary },
                    ]}
                    onPress={onEdit}
                >
                    <Edit2 size={16} color={colors.text.primary} strokeWidth={2} />
                    <Text style={[styles.actionText, { color: colors.text.primary }]}>Editar</Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.actionButton,
                        {
                            borderColor: colors.error + '40',
                            backgroundColor: colors.error + '10',
                        },
                    ]}
                    onPress={onDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <ActivityIndicator size="small" color={colors.error} />
                    ) : (
                        <>
                            <Trash2 size={16} color={colors.error} strokeWidth={2} />
                            <Text style={[styles.actionText, { color: colors.error }]}>Eliminar</Text>
                        </>
                    )}
                </Pressable>
            </View>
        </View>
    );
});
