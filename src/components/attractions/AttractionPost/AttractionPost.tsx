import { useState } from 'react';
import { Pressable, View, Dimensions, Platform } from 'react-native';
import { Mountain } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { ImageCarousel } from '@/components/ui';
import { ReviewModal } from '@/components/business/ReviewModal';
import { ConfirmDeleteDialog } from '@/components/manage/ConfirmDeleteDialog';
import { useAuthStore } from '@/store';
import { AttractionContent } from './AttractionContent';
import { AttractionFooter } from './AttractionFooter';
import { ReviewsSectionControls } from './ReviewsSectionControls';
import { ReviewsList } from './ReviewsList';
import { useAttractionPostReviews } from './useAttractionPostReviews';
import { getTimeAgo, getInitials, openMaps, getTimeAgoForReview } from './helpers';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface AttractionPostProps {
    attractionId: string;
    name: string;
    description?: string | null;
    categoryNames?: string[];
    categoryIds?: string[];
    locationLabel?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    imageUrls?: string[];
    authorName?: string | null;
    rating?: number;
    reviewCount?: number;
    isApproved?: boolean;
    createdAt?: string;
    onPress?: () => void;
}

export function AttractionPost({
    attractionId,
    name,
    description,
    categoryNames = [],
    categoryIds = [],
    locationLabel,
    latitude,
    longitude,
    imageUrls = [],
    authorName,
    rating = 0,
    reviewCount = 0,
    isApproved = false,
    createdAt,
    onPress,
}: AttractionPostProps) {
    const colors = useThemedColors();
    const { user } = useAuthStore();
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

    const {
        reviews,
        userReview,
        hasReviews,
        isSubmitting,
        isDeleting,
        handleSubmitReview,
        handleDeleteReview,
    } = useAttractionPostReviews(attractionId, user?.id ?? null);

    const hasLocation = !!(latitude && longitude);
    const carouselWidth = Platform.OS === 'web' ? Math.min(SCREEN_WIDTH, 600) : SCREEN_WIDTH;

    const handleSubmit = async (ratingValue: number, comment: string) => {
        const success = await handleSubmitReview(ratingValue, comment);
        if (success) setIsModalVisible(false);
    };

    const handleDelete = async () => {
        const success = await handleDeleteReview();
        if (success) setIsDeleteDialogVisible(false);
    };

    return (
        <Pressable
            style={[styles.post, { backgroundColor: colors.background.primary, borderColor: colors.border.medium }]}
            onPress={onPress}
            disabled={!onPress}
        >
            <AttractionContent
                name={name}
                description={description}
                categoryNames={categoryNames}
                categoryIds={categoryIds}
                isApproved={isApproved}
                showAllCategories={showAllCategories}
                onToggleCategories={() => setShowAllCategories(true)}
                authorName={authorName}
                createdAt={createdAt}
                getInitials={getInitials}
                getTimeAgo={getTimeAgo}
            />

            <View style={{ width: carouselWidth, alignSelf: 'center' }}>
                {imageUrls.length > 0 ? (
                    <ImageCarousel images={imageUrls} imageWidth={carouselWidth} aspectRatio={16 / 9} />
                ) : (
                    <View style={[styles.imagePlaceholder, { backgroundColor: colors.background.tertiary }]}>
                        <Mountain size={48} color={colors.text.tertiary} />
                    </View>
                )}
            </View>

            <AttractionFooter
                rating={rating}
                reviewCount={reviewCount}
                locationLabel={locationLabel}
                hasLocation={hasLocation}
                onLocationPress={() => latitude && longitude && openMaps(latitude, longitude, locationLabel ?? name)}
            />

            <ReviewsSectionControls
                hasReviews={hasReviews ?? false}
                reviewCount={reviews.length}
                showReviews={showReviews}
                isAuthenticated={!!user}
                hasUserReview={!!userReview}
                onToggleReviews={() => setShowReviews(!showReviews)}
                onWriteReview={() => setIsModalVisible(true)}
            />

            {showReviews && hasReviews && (
                <ReviewsList
                    reviews={reviews}
                    currentUserId={user?.id ?? null}
                    onEdit={() => setIsModalVisible(true)}
                    onDelete={() => setIsDeleteDialogVisible(true)}
                    getInitials={getInitials}
                    getTimeAgo={getTimeAgoForReview}
                />
            )}

            <ReviewModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleSubmit}
                businessName={name}
                businessLogo={imageUrls[0]}
                existingRating={userReview?.rating}
                existingComment={userReview?.comment}
                isEditMode={!!userReview}
                isLoading={isSubmitting}
            />

            <ConfirmDeleteDialog
                visible={isDeleteDialogVisible}
                entityName="Mi reseña"
                entityType="reseña"
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteDialogVisible(false)}
                isDeleting={isDeleting}
            />
        </Pressable>
    );
}
