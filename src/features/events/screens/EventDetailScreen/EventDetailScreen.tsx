/**
 * Pantalla de detalle de evento
 */
import { memo, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, Linking, Platform, Modal, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, PartyPopper, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useEventDetail } from '@/features/events/hooks';
import { ImageCarousel } from '@/components/ui';
import { BusinessGallery, ContactSection } from '@/components/business';
import { EventHeader } from '@/components/events';
import { styles } from './styles';

export const EventDetailScreen = memo(function EventDetailScreen() {
    const colors = useThemedColors();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: event, isLoading, error } = useEventDetail(id);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    const handleClose = () => {
        router.canGoBack() ? router.back() : router.replace('/(app)/(tabs)/attractions');
    };

    const handleOpenMaps = () => {
        if (!event?.latitude || !event?.longitude) return;
        const label = encodeURIComponent(event.name);
        const url = Platform.select({
            ios: `http://maps.apple.com/?q=${label}&ll=${event.latitude},${event.longitude}`,
            android: `geo:${event.latitude},${event.longitude}?q=${event.latitude},${event.longitude}(${label})`,
            default: `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`,
        });
        Linking.openURL(url);
    };

    const handleOpenLink = (url: string) => url && Linking.openURL(url).catch(() => { });
    const handleGalleryImagePress = (imageUrl: string) => setExpandedImage(imageUrl);

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
                {event.coverImage && (
                    <ImageCarousel images={[event.coverImage]} aspectRatio={16 / 9} maxHeight={280} />
                )}

                <Pressable
                    style={({ pressed }) => [styles.backButton, { backgroundColor: colors.background.primary, opacity: pressed ? 0.7 : 1 }]}
                    onPress={handleClose}
                >
                    <ArrowLeft size={24} color={colors.text.primary} />
                </Pressable>

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
                            rating={event.rating}
                            reviewCount={event.reviewCount}
                            locationLabel={event.locationLabel}
                            latitude={event.latitude}
                            longitude={event.longitude}
                            onOpenMaps={handleOpenMaps}
                        />

                        {event.authorName && (
                            <Text style={[styles.authorText, { color: colors.text.tertiary }]}>
                                Organizado por {event.authorName}
                            </Text>
                        )}

                        {event.galleryImages.length > 0 && (
                            <BusinessGallery
                                images={event.galleryImages}
                                onImagePress={handleGalleryImagePress}
                            />
                        )}

                        <ContactSection
                            phone={event.contactPhone}
                            email={event.contactEmail}
                            website={event.website}
                            facebook={event.socialLinks.facebook}
                            instagram={event.socialLinks.instagram}
                            tiktok={event.socialLinks.tiktok}
                            onContactPress={handleOpenLink}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Modal para imagen expandida */}
            <Modal
                visible={expandedImage !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setExpandedImage(null)}
            >
                <Pressable
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => setExpandedImage(null)}
                >
                    <Pressable
                        style={{ position: 'absolute', top: 50, right: 20, zIndex: 10 }}
                        onPress={() => setExpandedImage(null)}
                    >
                        <X size={32} color="#FFFFFF" />
                    </Pressable>
                    {expandedImage && (
                        <Image
                            source={{ uri: expandedImage }}
                            style={{ width: '95%', height: '80%' }}
                            resizeMode="contain"
                        />
                    )}
                </Pressable>
            </Modal>
        </View>
    );
});

export default EventDetailScreen;
