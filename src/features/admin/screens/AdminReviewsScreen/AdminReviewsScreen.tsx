import { useState, memo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, Alert, RefreshControl } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { BackButton } from '@/components/ui';
import { ReviewFilters, AdminReviewCard, ReviewStatsCards, EditReviewDialog } from '@/components/admin';
import { useAdminReviews, useReviewsStats, useDeleteReviewAsAdmin, useUpdateReviewAsAdmin } from '@/features/admin/hooks/useAdminReviews';
import type { ReviewFilters as ReviewFiltersType, ReviewType, AdminReviewDisplay } from '@/features/admin/types';
import { styles } from './styles';

export const AdminReviewsScreen = memo(function AdminReviewsScreen() {
    const colors = useThemedColors();
    const [filters, setFilters] = useState<ReviewFiltersType>({});
    const [editingReview, setEditingReview] = useState<AdminReviewDisplay | null>(null);

    const { data: reviews, isLoading, error, refetch, isFetching } = useAdminReviews(filters);
    const { data: stats } = useReviewsStats();
    const deleteReview = useDeleteReviewAsAdmin();
    const updateReview = useUpdateReviewAsAdmin();

    const handleDeleteReview = async (reviewId: string, type: ReviewType, contentId: string) => {
        try {
            await deleteReview.mutateAsync({ reviewId, type, contentId });
            Alert.alert('Éxito', 'La reseña ha sido eliminada correctamente');
        } catch (error) {
            console.error('Error al eliminar reseña:', error);
            Alert.alert('Error', 'No se pudo eliminar la reseña. Verifica tus permisos de administrador.');
            throw error; // Re-throw para que el componente lo maneje
        }
    };

    const handleEditReview = (reviewId: string, type: ReviewType, contentId: string) => {
        const review = reviews?.find(r => r.id === reviewId && r.type === type);
        if (review) {
            setEditingReview(review);
        }
    };

    const handleSaveEdit = async (rating: number, comment: string) => {
        if (!editingReview) return;

        try {
            await updateReview.mutateAsync({
                reviewId: editingReview.id,
                type: editingReview.type,
                contentId: editingReview.contentId,
                rating,
                comment,
            });
            Alert.alert('Éxito', 'La reseña ha sido actualizada correctamente');
            setEditingReview(null);
        } catch (error) {
            console.error('Error al editar reseña:', error);
            Alert.alert('Error', 'No se pudo actualizar la reseña.');
        }
    };

    const handleCancelEdit = () => {
        setEditingReview(null);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={refetch}
                        tintColor={colors.primary[500]}
                        colors={[colors.primary[500]]}
                    />
                }
            >
                <View style={styles.contentWrapper}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
                    <View style={styles.headerRow}>
                        <BackButton href="/(app)/(tabs)/manage/admin" />
                        <View style={styles.headerContent}>
                            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                                Gestión de Reseñas
                            </Text>
                            <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                                Administra todas las reseñas de la plataforma
                            </Text>
                        </View>
                    </View>
                </View>
                {/* Stats Cards */}
                {stats && (
                    <View style={styles.statsContainer}>
                        <ReviewStatsCards
                            totalReviews={stats.totalReviews}
                            averageRating={stats.averageRating}
                            byType={stats.byType}
                        />
                    </View>
                )}

                {/* Filters */}
                <View style={styles.filtersContainer}>
                    <ReviewFilters filters={filters} onFiltersChange={setFilters} />
                </View>

                {/* Reviews List */}
                <View style={styles.listContainer}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.primary[500]} />
                            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                                Cargando reseñas...
                            </Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={[styles.errorText, { color: colors.error }]}>
                                Error al cargar las reseñas
                            </Text>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.retryButton,
                                    {
                                        backgroundColor: colors.primary[500],
                                        opacity: pressed ? 0.8 : 1,
                                    },
                                ]}
                                onPress={() => refetch()}
                            >
                                <Text style={[styles.retryButtonText, { color: colors.text.inverse }]}>Reintentar</Text>
                            </Pressable>
                        </View>
                    ) : reviews && reviews.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <MessageSquare color={colors.text.tertiary} size={48} strokeWidth={1.5} />
                            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                                No hay reseñas
                            </Text>
                            <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
                                No se encontraron reseñas con los filtros seleccionados
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.reviewsList}>
                            {reviews?.map((review) => (
                                <AdminReviewCard
                                    key={`${review.type}-${review.id}`}
                                    review={review}
                                    onDelete={handleDeleteReview}
                                    onEdit={handleEditReview}
                                />
                            ))}
                        </View>
                    )}
                </View>
                </View>
            </ScrollView>

            {/* Edit Review Dialog */}
            {editingReview && (
                <EditReviewDialog
                    visible={!!editingReview}
                    authorName={editingReview.authorName}
                    contentTitle={editingReview.contentTitle}
                    currentRating={editingReview.rating}
                    currentComment={editingReview.comment}
                    onConfirm={handleSaveEdit}
                    onCancel={handleCancelEdit}
                    isSaving={updateReview.isPending}
                />
            )}
        </View>
    );
});
