import { memo } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import { Edit2, MapPin, CalendarDays, Trash2 } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { StatusBadge } from '@/components/ui';
import { getCategoryColorScheme } from '@/utils/categoryColors';
import { styles } from './styles';

export interface UserEventCardProps {
    name: string;
    description?: string | null;
    categoryNames: string[];
    categoryIds: string[];
    startDate: string;
    endDate: string;
    locationLabel?: string | null;
    imageUrl?: string | null;
    isFree: boolean;
    price?: number | null;
    currency?: string | null;
    capacity?: number | null;
    moderationStatus: 'pending' | 'approved' | 'rejected';
    isActive: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    isDeleting?: boolean;
}

export const UserEventCard = memo(function UserEventCard({
    name,
    description,
    categoryNames,
    categoryIds,
    startDate,
    endDate,
    locationLabel,
    imageUrl,
    isFree,
    price,
    currency,
    capacity,
    moderationStatus,
    isActive,
    onEdit,
    onDelete,
    isDeleting = false,
}: UserEventCardProps) {
    const colors = useThemedColors();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatPrice = () => {
        if (isFree) return 'Gratis';
        if (!price) return 'Precio no definido';
        const symbol = currency === 'CRC' || !currency ? '₡' : currency === 'USD' ? '$' : currency;
        return `${symbol}${price.toLocaleString('es-CR')}`;
    };

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
                            <CalendarDays color={colors.text.tertiary} size={32} strokeWidth={1.5} />
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
                                    {categoryNames.slice(0, 3).map((cat, idx) => {
                                        const categoryId = categoryIds[idx];
                                        const colorScheme = getCategoryColorScheme(categoryId);
                                        return (
                                            <View
                                                key={`${cat}-${idx}`}
                                                style={[styles.categoryChip, { backgroundColor: colorScheme.backgroundColor }]}
                                            >
                                                <Text style={[styles.categoryText, { color: colorScheme.textColor }]}>
                                                    {cat}
                                                </Text>
                                            </View>
                                        );
                                    })}
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

                        {/* Status Badge */}
                        <View style={styles.statusBadgeWrapper}>
                            <StatusBadge status={moderationStatus} />
                        </View>
                    </View>

                    {/* Descripción */}
                    {description && (
                        <Text style={[styles.description, { color: colors.text.secondary }]} numberOfLines={2}>
                            {description}
                        </Text>
                    )}

                    {/* Fecha */}
                    <View style={styles.infoRow}>
                        <CalendarDays size={14} color={colors.text.secondary} strokeWidth={2} />
                        <Text style={[styles.infoText, { color: colors.text.secondary }]}>
                            {formatDate(startDate)} - {formatDate(endDate)}
                        </Text>
                    </View>

                    {/* Ubicación */}
                    {locationLabel && (
                        <View style={styles.infoRow}>
                            <MapPin size={14} color={colors.text.secondary} strokeWidth={2} />
                            <Text style={[styles.infoText, { color: colors.text.secondary }]} numberOfLines={1}>
                                {locationLabel}
                            </Text>
                        </View>
                    )}

                    {/* Precio */}
                    <Text style={[styles.price, { color: isFree ? colors.success : colors.primary[600] }]}>
                        {formatPrice()}
                    </Text>

                    {/* Capacidad */}
                    {capacity && capacity > 0 && (
                        <Text style={[styles.capacity, { color: colors.text.tertiary }]}>
                            Capacidad: {capacity.toLocaleString('es-CR')} personas
                        </Text>
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
                    <Text style={[styles.actionText, { color: colors.text.primary }]}>
                        Editar
                    </Text>
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
                            <Text style={[styles.actionText, { color: colors.error }]}>
                                Eliminar
                            </Text>
                        </>
                    )}
                </Pressable>
            </View>
        </View>
    );
});
