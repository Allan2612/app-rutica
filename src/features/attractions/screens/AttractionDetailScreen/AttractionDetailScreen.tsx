/**
 * Pantalla de detalle de atracción
 */
import { memo, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Mountain } from 'lucide-react-native';
import { useThemedColors, useRefreshOnFocus } from '@/hooks';
import { useAttractionDetail } from '@/features/attractions/hooks';
import { BusinessGallery, CoverImage, ImageViewerModal, BusinessMap } from '@/components/business';
import { AttractionHeader, AttractionReviewsSection } from '@/components/attractions';
import { styles } from '@/features/attractions/screens/AttractionDetailScreen/styles';

export const AttractionDetailScreen = memo(function AttractionDetailScreen() {
  const colors = useThemedColors();
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const { data: attraction, isLoading, error, refetch } = useAttractionDetail(id);
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
          <Pressable
            style={[styles.retryButton, { backgroundColor: colors.primary[500] }]}
            onPress={handleClose}
          >
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
          coverImage={attraction.coverImage}
          rating={attraction.rating}
          reviewCount={attraction.reviewCount}
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
            <AttractionHeader
              name={attraction.name}
              description={attraction.description}
              categoryIds={attraction.categoryIds}
              categoryNames={attraction.categoryNames}
              locationLabel={attraction.locationLabel}
              isApproved={attraction.isApproved}
              authorName={attraction.authorName}
            />

            {/* Gallery */}
            {attraction.galleryImages.length > 0 && (
              <BusinessGallery images={attraction.galleryImages} onImagePress={setSelectedImage} />
            )}

            {/* Map Section */}
            {attraction.latitude && attraction.longitude && (
              <BusinessMap
                latitude={attraction.latitude}
                longitude={attraction.longitude}
                businessName={attraction.name}
              />
            )}

            {/* Reviews Section */}
            <AttractionReviewsSection
              attractionId={id}
              attractionName={attraction.name}
              attractionImage={attraction.coverImage ?? undefined}
              ownerId={attraction.createdBy}
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

export default AttractionDetailScreen;
