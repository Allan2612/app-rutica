import { memo, useCallback } from 'react';
import * as React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Star, Pencil, Trash2, ThumbsUp } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useThemedColors } from '@/hooks';
import { useAuthStore } from '@/store';
import { useToggleReviewLike } from '@/features/business/hooks/useToggleReviewLike';
import { formatDate, DATE_FORMAT_OPTIONS } from '@/utils';
import { colors as themeColors } from '@/styles/theme/colors';
import { isAdmin } from '@/types/entities';
import { styles } from './styles';

interface ReviewCardProps {
    id: string;
    authorName: string;
    authorId?: string; // ID del autor de la reseña
    rating: number;
    comment: string | null;
    createdAt: string;
    likesCount: number;
    isLikedByUser: boolean;
    isOwner?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    isDeleting?: boolean;
    /** Optional external like toggle – when provided, overrides the internal business-like hook */
    onLikeToggle?: (reviewId: string) => void;
    isLikeToggling?: boolean;
}

export const ReviewCard = memo(function ReviewCard({
    id,
    authorName,
    authorId,
    rating,
    comment,
    createdAt,
    likesCount,
    isLikedByUser,
    isOwner = false,
    onEdit,
    onDelete,
    isDeleting = false,
    onLikeToggle,
    isLikeToggling = false,
}: ReviewCardProps) {
    const colors = useThemedColors();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const currentUser = useAuthStore((state) => state.user);
    const internalToggleLike = useToggleReviewLike();

    // Verificar si el usuario es admin
    const [userProfile, setUserProfile] = React.useState<any>(null);
    React.useEffect(() => {
        if (currentUser?.id) {
            import('@/lib/supabase/client').then(({ supabase }) => {
                supabase.from('profiles').select('*').eq('id_prf', currentUser.id).single()
                    .then(({ data }) => setUserProfile(data));
            });
        }
    }, [currentUser?.id]);
    const userIsAdmin = isAdmin(userProfile);
    const canEditOrDelete = isOwner || userIsAdmin;

    const likeIsPending = onLikeToggle ? isLikeToggling : internalToggleLike.isPending;

    const handleLikePress = useCallback(() => {
        if (!isAuthenticated) {
            Toast.show({
                type: 'error',
                text1: 'Iniciar sesión',
                text2: 'Debes iniciar sesión para poder dejar tu me gusta',
                position: 'top',
                visibilityTime: 3000,
            });
            return;
        }
        if (onLikeToggle) {
            onLikeToggle(id);
        } else {
            internalToggleLike.mutate(id);
        }
    }, [id, isAuthenticated, onLikeToggle, internalToggleLike]);

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={16}
                    color={themeColors.promo.badge}
                    fill={i <= rating ? themeColors.promo.badge : 'transparent'}
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
                    {formatDate(createdAt, DATE_FORMAT_OPTIONS.full)}
                </Text>
            </View>

            {/* Comment */}
            {comment && (
                <Text style={[styles.comment, { color: colors.text.secondary }]}>
                    {comment}
                </Text>
            )}

            {/* Like Button */}
            {!canEditOrDelete && (
                <View style={styles.likeContainer}>
                    <Pressable
                        style={styles.likeButton}
                        onPress={handleLikePress}
                        disabled={likeIsPending}
                    >
                        <ThumbsUp
                            size={18}
                            color={isLikedByUser ? '#1877f2' : colors.text.tertiary}
                            fill={isLikedByUser ? '#1877f2' : 'transparent'}
                            strokeWidth={1.5}
                        />
                        <Text style={[styles.likeText, {
                            color: isLikedByUser ? '#1877f2' : colors.text.tertiary
                        }]}>
                            Me gusta
                        </Text>
                        {likesCount > 0 && (
                            <Text style={[styles.likesCount, {
                                color: isLikedByUser ? '#1877f2' : colors.text.tertiary
                            }]}>
                                ({likesCount})
                            </Text>
                        )}
                    </Pressable>
                </View>
            )}

            {/* Owner Actions */}
            {canEditOrDelete && (
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
                            {isOwner ? 'Editar mi reseña' : 'Editar reseña'}
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