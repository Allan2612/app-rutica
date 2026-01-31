import { memo, useState, useCallback } from 'react';
import { Modal, View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useAuthStore } from '@/store';
import { ReviewModal } from '../ReviewModal';
import { ConfirmDeleteDialog } from '@/components/manage/ConfirmDeleteDialog';
import { useProductReviews } from './useProductReviews';
import { ProductReviewItem } from './ProductReviewItem';
import { styles } from './styles';

interface ProductReviewsModalProps {
    visible: boolean;
    productId: string;
    productName: string;
    productImage?: string;
    onClose: () => void;
}

export const ProductReviewsModal = memo(function ProductReviewsModal({
    visible,
    productId,
    productName,
    productImage,
    onClose,
}: ProductReviewsModalProps) {
    const colors = useThemedColors();
    const { user } = useAuthStore();
    const userId = user?.id ?? null;

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const {
        reviews,
        userReview,
        isLoading,
        isSubmitting,
        isDeleting,
        handleSubmitReview,
        handleDeleteReview,
    } = useProductReviews(productId, userId);

    const handleWriteReview = useCallback(() => {
        setShowReviewModal(true);
    }, []);

    const handleReviewSubmit = useCallback(async (ratingValue: number, comment: string) => {
        const success = await handleSubmitReview(ratingValue, comment);
        if (success) setShowReviewModal(false);
        return success;
    }, [handleSubmitReview]);

    const handleConfirmDelete = useCallback(async () => {
        const success = await handleDeleteReview();
        if (success) setShowDeleteConfirm(false);
    }, [handleDeleteReview]);

    return (
        <>
            <Modal
                visible={visible}
                animationType="slide"
                transparent
                onRequestClose={onClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background.primary }]}>
                        {/* Header */}
                        <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
                            <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={2}>
                                Opiniones del producto {productName}
                            </Text>
                            <Pressable onPress={onClose} style={styles.closeButton}>
                                <X size={24} color={colors.text.primary} />
                            </Pressable>
                        </View>

                        {/* Reviews List */}
                        <ScrollView 
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color={colors.primary[500]} />
                                </View>
                            ) : reviews.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
                                        Sin opiniones aún. ¡Sé el primero en compartir tu experiencia con este producto!
                                    </Text>
                                    {userId && (
                                        <Pressable
                                            style={[styles.writeButton, { backgroundColor: colors.primary[500] }]}
                                            onPress={handleWriteReview}
                                        >
                                            <Text style={styles.writeButtonText}>
                                                Dejar opinión
                                            </Text>
                                        </Pressable>
                                    )}
                                </View>
                            ) : (
                                <>
                                    {/* User's review first if exists */}
                                    {userReview && (
                                        <ProductReviewItem
                                            review={userReview}
                                            isOwner={true}
                                            onEdit={handleWriteReview}
                                            onDelete={() => setShowDeleteConfirm(true)}
                                        />
                                    )}

                                    {/* Other reviews */}
                                    {reviews
                                        .filter((review) => review.userId !== userId)
                                        .map((review) => (
                                            <ProductReviewItem
                                                key={review.id}
                                                review={review}
                                                isOwner={false}
                                                onEdit={() => {}}
                                                onDelete={() => {}}
                                            />
                                        ))}

                                    {/* Write Review Button (only for users without review) */}
                                    {userId && !userReview && (
                                        <Pressable
                                            style={[styles.writeButtonOutline, { borderColor: colors.primary[500] }]}
                                            onPress={handleWriteReview}
                                        >
                                            <Text style={[styles.writeButtonOutlineText, { color: colors.primary[500] }]}>
                                                Dejar opinión
                                            </Text>
                                        </Pressable>
                                    )}
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Review Modal */}
            <ReviewModal
                visible={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                onSubmit={handleReviewSubmit}
                businessName={productName}
                businessLogo={productImage}
                existingRating={userReview?.rating}
                existingComment={userReview?.comment}
                isEditMode={!!userReview}
                isLoading={isSubmitting}
            />

            {/* Delete Confirmation */}
            <ConfirmDeleteDialog
                visible={showDeleteConfirm}
                entityName="Mi opinión"
                entityType="opinión"
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                isDeleting={isDeleting}
            />
        </>
    );
});
