import { memo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { useBusinessForm } from '@/features/business/hooks/useBusinessForm';
import {
    BasicInfoSection,
    CategorySection,
    ImageSection,
    LocationSection,
    ContactSection,
    SocialLinksSection,
    FormActions,
} from '@/components/manage';
import { styles } from '../AddBusinessScreen/styles';

export const EditBusinessScreen = memo(function EditBusinessScreen() {
    const colors = useThemedColors();
    const { id } = useLocalSearchParams<{ id: string }>();

    const {
        categories,
        business,
        loadingCategories,
        loadingBusiness,
        formData,
        errors,
        updateField,
        handleSubmit,
        handleLocationSelect,
        isSubmitting,
        router,
    } = useBusinessForm(id);

    if (loadingBusiness || loadingCategories) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    if (!business) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
                <Text style={[styles.title, { color: colors.text.primary }]}>No se encontró el negocio</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background.secondary }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
                    <Text style={[styles.title, { color: colors.text.primary }]}>Editar Negocio</Text>
                    <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                        Modifica la información de tu negocio
                    </Text>
                </View>

                <BasicInfoSection
                    name={formData.name}
                    description={formData.description}
                    onNameChange={(text) => updateField('name', text)}
                    onDescriptionChange={(text) => updateField('description', text)}
                    errors={errors}
                />

                <CategorySection
                    categories={categories}
                    selectedIds={formData.selectedCategoryIds}
                    onSelectionChange={(ids) => updateField('selectedCategoryIds', ids)}
                    isLoading={loadingCategories}
                    error={errors.categories}
                />

                <ImageSection
                    logoUri={formData.logoUri}
                    coverUri={formData.coverUri}
                    galleryUris={formData.galleryUris}
                    onLogoChange={(uri) => updateField('logoUri', uri)}
                    onCoverChange={(uri) => updateField('coverUri', uri)}
                    onGalleryChange={(uris) => updateField('galleryUris', uris)}
                />

                <LocationSection
                    onLocationSelect={handleLocationSelect}
                    initialLatitude={formData.coordinates?.latitude}
                    initialLongitude={formData.coordinates?.longitude}
                    error={errors.location}
                />

                <ContactSection
                    phone={formData.phone}
                    email={formData.email}
                    website={formData.website}
                    onPhoneChange={(text) => updateField('phone', text)}
                    onEmailChange={(text) => updateField('email', text)}
                    onWebsiteChange={(text) => updateField('website', text)}
                />

                <SocialLinksSection
                    facebook={formData.facebook}
                    instagram={formData.instagram}
                    tiktok={formData.tiktok}
                    onFacebookChange={(text) => updateField('facebook', text)}
                    onInstagramChange={(text) => updateField('instagram', text)}
                    onTiktokChange={(text) => updateField('tiktok', text)}
                />

                <FormActions
                    onCancel={() => router.push('/(app)/(tabs)/manage/businesses')}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    submitLabel="Guardar Cambios"
                />
            </ScrollView>

            {isSubmitting && (
                <View style={styles.loadingOverlay}>
                    <View style={[styles.loadingCard, { backgroundColor: colors.background.primary }]}>
                        <ActivityIndicator size="large" color={colors.primary[500]} />
                        <Text style={[styles.loadingText, { color: colors.text.primary }]}>Actualizando negocio...</Text>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    );
});
