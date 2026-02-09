import { memo, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, PartyPopper } from 'lucide-react-native';
import { useThemedColors, useRefreshOnFocus } from '@/hooks';
import { useEventDetail } from '@/features/events/hooks';
import {
    BusinessGallery,
    ContactSection,
    CoverImage,
    ImageViewerModal,
    BusinessMap,
} from '@/components/business';
import { EventHeader, EventReviewsSection } from '@/components/events';
import { styles } from './styles';

export const EventDetailScreen = memo(function EventDetailScreen() {
    const colors = useThemedColors();
    const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
    const { data: event, isLoading, error, refetch } = useEventDetail(id);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useRefreshOnFocus(refetch);

    const handleClose = () => {
        if (from === 'maps') {
            router.replace('/(app)/(tabs)/maps');
            return;
        }
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(app)/(tabs)/attractions');
        }
    };

    const handleOpenLink = (url: string) => url && Linking.openURL(url).catch(() => { });

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={colors.primary[500]} />
                </View>
            </View>
        );
    }

    if (error || !event) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
                <View style={styles.errorContainer}>
                    <PartyPopper size={48} color={colors.text.tertiary} />
                    <Text style={[styles.errorText, { color: colors.text.secondary }]}>
                        No se pudo cargar la información del evento
                    </Text>
                    <Pressable style={[styles.retryButton, { backgroundColor: colors.primary[500] }]} onPress={handleClose}>
                        <Text style={[styles.retryText, { color: colors.text.inverse }]}>Volver</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Cover Image con rating */}
                <CoverImage
                    coverImage={event.coverImage}
                    rating={event.rating}
                    reviewCount={event.reviewCount}
                    onCoverPress={setSelectedImage}
                />

                {/* Back Button */}
                <Pressable
                    style={({ pressed }) => ({
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: colors.background.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: pressed ? 0.7 : 1,
                    })}
                    onPress={handleClose}
                >
                    <ArrowLeft size={24} color={colors.text.primary} />
                </Pressable>

                {/* Main Content */}
                <View style={styles.contentContainer}>
                    <View style={styles.mainContent}>
                        <EventHeader
                            name={event.name}
                            description={event.description}
                            categoryIds={event.categoryIds}
                            categoryNames={event.categoryNames}
                            startAt={event.startAt}
                            endAt={event.endAt}
                            isFree={event.isFree}
                            price={event.price}
                            currency={event.currency}
                            capacity={event.capacity}
                            locationLabel={event.locationLabel}
                            isApproved={event.isApproved}
                            authorName={event.authorName}
                        />

                        {/* Gallery */}
                        {event.galleryImages.length > 0 && (
                            <BusinessGallery
                                images={event.galleryImages}
                                onImagePress={setSelectedImage}
                            />
                        )}

                        {/* Map Section */}
                        {event.latitude && event.longitude && (
                            <BusinessMap
                                latitude={event.latitude}
                                longitude={event.longitude}
                                businessName={event.name}
                                phone={event.contactPhone}
                            />
                        )}

                        {/* Contact Section */}
                        <ContactSection
                            phone={event.contactPhone}
                            email={event.contactEmail}
                            website={event.website}
                            facebook={event.socialLinks.facebook}
                            instagram={event.socialLinks.instagram}
                            tiktok={event.socialLinks.tiktok}
                            onContactPress={handleOpenLink}
                        />

                        {/* Reviews Section */}
                        <EventReviewsSection
                            eventId={id}
                            eventName={event.name}
                            eventImage={event.coverImage ?? undefined}
                            ownerId={event.createdBy}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Image Viewer Modal */}
            <ImageViewerModal
                visible={selectedImage !== null}
                imageUri={selectedImage}
                onClose={() => setSelectedImage(null)}
            />
        </View>
    );
});

export default EventDetailScreen;
