import { useState } from 'react';
import { Pressable, View, Dimensions, Platform } from 'react-native';
import { Mountain } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { GenericCarousel } from '@/components/ui';
import { ReviewModal } from '@/components/business/ReviewModal';
import { ConfirmDeleteDialog } from '@/components/manage/ConfirmDeleteDialog';
import { useAuthStore } from '@/store';
import { AttractionContent } from './AttractionContent';
import { AttractionFooter } from './AttractionFooter';
import { Image } from 'expo-image';
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
    const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
    const [selectedReviewUserId, setSelectedReviewUserId] = useState<string | null>(null);

    const {
        reviews,
        userReview,
        hasReviews,
        isSubmitting,
        isDeleting,
        handleSubmitReview,
        handleDeleteReview,
    } = useAttractionPostReviews(attractionId, user?.id ?? null, selectedReviewId, selectedReviewUserId);

    const hasLocation = !!(latitude && longitude);
    const carouselWidth = Platform.OS === 'web' ? Math.min(SCREEN_WIDTH, 600) : SCREEN_WIDTH;

    const selectedReview = selectedReviewId
        ? reviews.find(r => r.id === selectedReviewId) || userReview
        : userReview;

    const handleSubmit = async (ratingValue: number, comment: string) => {
        const success = await handleSubmitReview(ratingValue, comment);
        if (success) {
            setIsModalVisible(false);
            setSelectedReviewId(null);
            setSelectedReviewUserId(null);
        }
    };

    const handleDelete = async () => {
        const success = await handleDeleteReview();
        if (success) {
            setIsDeleteDialogVisible(false);
            setSelectedReviewId(null);
            setSelectedReviewUserId(null);
        }
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
                rating={rating}
                reviewCount={reviewCount}
                getInitials={getInitials}
                getTimeAgo={getTimeAgo}
            />

            <View style={{ width: carouselWidth, alignSelf: 'center' }}>
                {imageUrls.length > 0 ? (
                    <GenericCarousel
                        items={imageUrls}
                        renderItem={(image) => (
                            <Image
                                source={{ uri: image }}
                                style={{ width: carouselWidth, aspectRatio: 16 / 9 }}
                                contentFit="cover"
                            />
                        )}
                        showNavigation={true}
                        showIndicators={true}
                        enableImageModal={true}
                        autoScroll={false}
                    />
                ) : (
                    <View style={[styles.imagePlaceholder, { backgroundColor: colors.background.tertiary }]}>
                        <Mountain size={48} color={colors.text.tertiary} />
                    </View>
                )}
            </View>

            <AttractionFooter
                locationLabel={locationLabel}
                hasLocation={hasLocation}
                onLocationPress={() => latitude && longitude && openMaps(latitude, longitude, locationLabel ?? name)}
            />

            <ReviewsSectionControls
                attractionId={attractionId}
                attractionName={name}
                hasReviews={hasReviews ?? false}
                reviewCount={reviews.length}
                showReviews={showReviews}
                isAuthenticated={!!user}
                hasUserReview={!!userReview}
                onToggleReviews={() => setShowReviews(!showReviews)}
                onWriteReview={() => setIsModalVisible(true)}
            />

            {showReviews && (
                <ReviewsList
                    reviews={reviews}
                    currentUserId={user?.id ?? null}
                    isAuthenticated={!!user}
                    hasUserReview={!!userReview}
                    onEdit={(reviewId, userId) => {
                        setSelectedReviewId(reviewId);
                        setSelectedReviewUserId(userId);
                        setIsModalVisible(true);
                    }}
                    onDelete={(reviewId, userId) => {
                        setSelectedReviewId(reviewId);
                        setSelectedReviewUserId(userId);
                        setIsDeleteDialogVisible(true);
                    }}
                    onWriteReview={() => {
                        setSelectedReviewId(null);
                        setSelectedReviewUserId(null);
                        setIsModalVisible(true);
                    }}
                    getInitials={getInitials}
                    getTimeAgo={getTimeAgoForReview}
                />
            )}

            <ReviewModal
                visible={isModalVisible}
                onClose={() => {
                    setIsModalVisible(false);
                    setSelectedReviewId(null);
                    setSelectedReviewUserId(null);
                }}
                onSubmit={handleSubmit}
                businessName={name}
                businessLogo={imageUrls[0]}
                existingRating={selectedReview?.rating}
                existingComment={selectedReview?.comment}
                isEditMode={!!selectedReview}
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
