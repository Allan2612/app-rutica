import { useState, useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { useThemedColors } from '@/hooks';
import { ReviewModal } from '@/components/business/ReviewModal';
import { ConfirmDeleteDialog } from '@/components/manage/ConfirmDeleteDialog';
import { useAuthStore } from '@/store';
import { useEventPostReviews } from './useEventPostReviews';
import { EventPostHeader } from './EventPostHeader';
import { EventPostImage } from './EventPostImage';
import { EventPostContent } from './EventPostContent';
import { EventContactSection } from './EventContactSection';
import { EventPostFooter } from './EventPostFooter';
import { EventReviewsSectionControls } from './EventReviewsSectionControls';
import { EventReviewsList } from './EventReviewsList';
import { openMaps } from './helpers';
import { styles } from './styles';
import type { EventPostProps } from './types';

export type { EventPostProps };

export function EventPost({
    eventId,
    name,
    description,
    startAt,
    endAt,
    isFree = false,
    price,
    currency,
    capacity,
    categoryNames = [],
    categoryIds = [],
    locationLabel,
    latitude,
    longitude,
    imageUrls = [],
    authorName,
    isApproved = false,
    createdAt,
    contactPhone,
    contactEmail,
    website,
    socialLinks,
    rating = 0,
    reviewCount = 0,
    onPress,
}: EventPostProps) {
    const colors = useThemedColors();
    const [showReviews, setShowReviews] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { user } = useAuthStore();
    const userId = user?.id ?? null;
    const isAuthenticated = !!userId;

    const { reviews, userReview, hasReviews, isSubmitting, isDeleting, handleSubmitReview, handleDeleteReview } =
        useEventPostReviews(eventId, userId);

    const hasLocation = latitude != null && longitude != null;

    const handleLocationPress = useCallback(() => {
        if (latitude && longitude) openMaps(latitude, longitude, locationLabel ?? name);
    }, [latitude, longitude, locationLabel, name]);

    const handleToggleReviews = useCallback(() => setShowReviews((prev) => !prev), []);
    const handleWriteReview = useCallback(() => setShowReviewModal(true), []);

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
        <Pressable
            style={[styles.post, { backgroundColor: colors.background.primary, borderColor: colors.border.medium }]}
            onPress={onPress}
            disabled={!onPress}
        >
            <EventPostHeader 
                authorName={authorName} 
                createdAt={createdAt}
                rating={rating}
                reviewCount={reviewCount}
            />
            <EventPostImage imageUrls={imageUrls} />

            <View style={styles.content}>
                <EventPostContent
                    name={name}
                    description={description}
                    isApproved={isApproved}
                    categoryNames={categoryNames}
                    categoryIds={categoryIds}
                    startAt={startAt}
                    endAt={endAt}
                    isFree={isFree}
                    price={price}
                    currency={currency}
                    capacity={capacity}
                    rating={rating}
                    reviewCount={reviewCount}
                />
                <EventContactSection
                    contactPhone={contactPhone}
                    contactEmail={contactEmail}
                    website={website}
                    socialLinks={socialLinks}
                />
            </View>

            <EventPostFooter locationLabel={locationLabel} hasLocation={hasLocation} onLocationPress={handleLocationPress} />

            <EventReviewsSectionControls
                eventId={eventId}
                eventName={name}
                hasReviews={hasReviews ?? false}
                reviewCount={reviews.length}
                showReviews={showReviews}
                isAuthenticated={isAuthenticated}
                hasUserReview={!!userReview}
                onToggleReviews={handleToggleReviews}
                onWriteReview={handleWriteReview}
            />

            {showReviews && (
                <EventReviewsList
                    reviews={reviews}
                    currentUserId={userId}
                    isAuthenticated={isAuthenticated}
                    hasUserReview={!!userReview}
                    onEdit={handleWriteReview}
                    onDelete={() => setShowDeleteConfirm(true)}
                    onWriteReview={handleWriteReview}
                />
            )}

            <ReviewModal
                visible={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                onSubmit={handleReviewSubmit}
                businessName={name}
                businessLogo={imageUrls[0]}
                existingRating={userReview?.rating}
                existingComment={userReview?.comment}
                isEditMode={!!userReview}
                isLoading={isSubmitting}
            />

            <ConfirmDeleteDialog
                visible={showDeleteConfirm}
                entityName="Mi reseña"
                entityType="reseña"
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                isDeleting={isDeleting}
            />
        </Pressable>
    );
}
