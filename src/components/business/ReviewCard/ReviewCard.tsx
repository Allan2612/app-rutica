import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Star, Pencil, Trash2 } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface ReviewCardProps {
    authorName: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    isOwner?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    isDeleting?: boolean;
}

export const ReviewCard = memo(function ReviewCard({
    authorName,
    rating,
    comment,
    createdAt,
    isOwner = false,
    onEdit,
    onDelete,
    isDeleting = false,
}: ReviewCardProps) {
    const colors = useThemedColors();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CR', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        });
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={16}
                    color="#fbbf24"
                    fill={i <= rating ? '#fbbf24' : 'transparent'}
                    strokeWidth={1.5}
                />
            );
        }
        return stars;
    };

    return (
        <View style={[styles.container, {
            backgroundColor: colors.background.primary,
            borderColor: colors.border.light,
        }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.authorInfo}>
                    <Text style={[styles.authorName, { color: colors.text.primary }]}>
                        {authorName}
                    </Text>
                    <View style={styles.starsContainer}>
                        {renderStars()}
                    </View>
                </View>
                <Text style={[styles.date, { color: colors.text.tertiary }]}>
                    {formatDate(createdAt)}
                </Text>
            </View>

            {/* Comment */}
            {comment && (
                <Text style={[styles.comment, { color: colors.text.secondary }]}>
                    {comment}
                </Text>
            )}

            {/* Owner Actions */}
            {isOwner && (
                <View style={styles.actionsContainer}>
                    <Pressable
                        style={[styles.editButton, {
                            borderColor: colors.border.medium,
                            opacity: isDeleting ? 0.5 : 1,
                        }]}
                        onPress={onEdit}
                        disabled={isDeleting}
                    >
                        <Pencil size={16} color={colors.text.secondary} />
                        <Text style={[styles.editButtonText, { color: colors.text.secondary }]}>
                            Editar mi reseña
                        </Text>
                    </Pressable>

                    <Pressable
                        style={[styles.deleteButton, {
                            borderColor: colors.error,
                            opacity: isDeleting ? 0.5 : 1,
                        }]}
                        onPress={onDelete}
                        disabled={isDeleting}
                    >
                        <Trash2 size={16} color="#dc2626" />
                        <Text style={[styles.deleteButtonText, { color: colors.error }]}>
                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
});