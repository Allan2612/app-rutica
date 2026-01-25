/**
 * Pantalla de detalle de atracción
 */
import { memo, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, Linking, Platform, Modal, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Mountain, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useAttractionDetail } from '@/features/attractions/hooks';
import { ImageCarousel } from '@/components/ui';
import { BusinessGallery } from '@/components/business';
import { AttractionHeader } from '@/components/attractions';
import { styles } from '@/features/attractions/screens/AttractionDetailScreen/styles';

export const AttractionDetailScreen = memo(function AttractionDetailScreen() {
    const colors = useThemedColors();
    const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
    const { data: attraction, isLoading, error } = useAttractionDetail(id);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    const handleClose = () => {
        // Si viene del mapa, regresar al mapa
        if (from === 'maps') {
            router.replace('/(app)/(tabs)/maps');
            return;
        }
        // Intentar regresar normalmente
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(app)/(tabs)/attractions');
        }
    };

    const handleOpenMaps = () => {
        if (!attraction?.latitude || !attraction?.longitude) return;
        const label = encodeURIComponent(attraction.name);
        const url = Platform.select({
            ios: `http://maps.apple.com/?q=${label}&ll=${attraction.latitude},${attraction.longitude}`,
            android: `geo:${attraction.latitude},${attraction.longitude}?q=${attraction.latitude},${attraction.longitude}(${label})`,
            default: `https://www.google.com/maps/search/?api=1&query=${attraction.latitude},${attraction.longitude}`,
        });
        Linking.openURL(url);
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={colors.primary[500]} />
                </View>
            </View>
        );
    }

    if (error || !attraction) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
                <View style={styles.errorContainer}>
                    <Mountain size={48} color={colors.text.tertiary} />
                    <Text style={[styles.errorText, { color: colors.text.secondary }]}>
                        No se pudo cargar la información de la atracción
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
                {attraction.coverImage && (
                    <ImageCarousel images={[attraction.coverImage]} aspectRatio={16 / 9} maxHeight={280} />
                )}

                <Pressable
                    style={({ pressed }) => [styles.backButton, { backgroundColor: colors.background.primary, opacity: pressed ? 0.7 : 1 }]}
                    onPress={handleClose}
                >
                    <ArrowLeft size={24} color={colors.text.primary} />
                </Pressable>

                <View style={styles.contentContainer}>
                    <View style={styles.mainContent}>
                        <AttractionHeader
                            name={attraction.name}
                            description={attraction.description}
                            categoryIds={attraction.categoryIds}
                            categoryNames={attraction.categoryNames}
                            rating={attraction.rating}
                            reviewCount={attraction.reviewCount}
                            locationLabel={attraction.locationLabel}
                            latitude={attraction.latitude}
                            longitude={attraction.longitude}
                            onOpenMaps={handleOpenMaps}
                        />

                        {attraction.authorName && (
                            <Text style={[styles.authorText, { color: colors.text.tertiary }]}>
                                Publicado por {attraction.authorName}
                            </Text>
                        )}

                        {attraction.galleryImages.length > 0 && (
                            <BusinessGallery
                                images={attraction.galleryImages}
                                onImagePress={(imageUrl) => setExpandedImage(imageUrl)}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>

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

export default AttractionDetailScreen;
