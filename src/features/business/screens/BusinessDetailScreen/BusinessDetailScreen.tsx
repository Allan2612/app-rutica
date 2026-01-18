import { memo, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Store } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useBusinessDetail } from '@/features/business/hooks/useBusinessDetail';
import {
    BusinessHeader,
    BusinessGallery,
    ContactSection,
    SocialLinksSection,
    CoverImage,
    ImageViewerModal
} from '@/components/business';
import { styles } from './styles';

export const BusinessDetailScreen = memo(function BusinessDetailScreen() {
    const colors = useThemedColors();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const { data: business, isLoading, error } = useBusinessDetail(id);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleOpenLink = (url: string) => {
        if (url) {
            Linking.openURL(url).catch(err => {});
        }
    };

    const handleClose = () => {
        router.push('/(app)/(tabs)/businesses');
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

    if (error || !business) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
                <View style={styles.errorContainer}>
                    <Store size={48} color={colors.text.tertiary} />
                    <Text style={[styles.errorText, { color: colors.text.secondary }]}>
                        No se pudo cargar la información del negocio
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Cover Image with Logo */}
                <CoverImage
                    coverImage={business.coverImageUrl}
                    logoImage={business.logoUrl}
                    rating={business.rating}
                    reviewCount={business.reviewCount}
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
                        {/* Business Header */}
                        <BusinessHeader
                            name={business.name}
                            description={business.description}
                            categoryIds={business.categoryIds}
                            categoryNames={business.categoryNames}
                            locationLabel={business.locationLabel}
                            isApproved={business.isApproved}
                        />

                        {/* Gallery */}
                        {business.galleryImages && business.galleryImages.length > 0 && (
                            <BusinessGallery
                                images={business.galleryImages}
                                onImagePress={setSelectedImage}
                            />
                        )}

                        {/* Contact Section */}
                        <ContactSection
                            phone={business.contactPhone}
                            email={business.contactEmail}
                            website={business.website}
                            onContactPress={handleOpenLink}
                        />

                        {/* Social Links */}
                        <SocialLinksSection
                            facebook={business.socialLinks.facebook}
                            instagram={business.socialLinks.instagram}
                            tiktok={business.socialLinks.tiktok}
                            onSocialPress={handleOpenLink}
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
