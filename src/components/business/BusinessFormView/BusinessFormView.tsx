import { memo } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useThemedColors } from '@/hooks';
import {
    BasicInfoSection,
    CategorySection,
    ImageSection,
    LocationSection,
    ContactSection,
    SocialLinksSection,
    FormActions,
} from '@/components/manage';
import { styles } from './styles';
import type { CategoryItem } from '@/features/business/services/categories.service';

interface BusinessFormData {
    name: string;
    description: string;
    selectedCategoryIds: string[];
    province: string | null;
    canton: string | null;
    district: string | null;
    address: string;
    coordinates: { latitude: number; longitude: number } | null;
    phone: string;
    email: string;
    website: string;
    facebook: string;
    instagram: string;
    tiktok: string;
    logoUri: string | null;
    coverUri: string | null;
    galleryUris: string[];
}

interface BusinessFormErrors {
    name?: string;
    categories?: string;
    location?: string;
}

interface BusinessFormViewProps {
    title: string;
    subtitle: string;
    formData: BusinessFormData;
    errors: BusinessFormErrors;
    categories: CategoryItem[];
    loadingCategories: boolean;
    isSubmitting: boolean;
    hasChanges: boolean;
    submitLabel: string;
    loadingLabel: string;
    onFieldChange: (field: keyof BusinessFormData, value: any) => void;
    onLocationSelect: (location: any) => void;
    onCancel: () => void;
    onSubmit: () => void;
}

export const BusinessFormView = memo(function BusinessFormView({
    title,
    subtitle,
    formData,
    errors,
    categories,
    loadingCategories,
    isSubmitting,
    hasChanges,
    submitLabel,
    loadingLabel,
    onFieldChange,
    onLocationSelect,
    onCancel,
    onSubmit,
}: BusinessFormViewProps) {
    const colors = useThemedColors();

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background.secondary }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
                    <Text style={[styles.title, { color: colors.text.primary }]}>
                        {title}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                        {subtitle}
                    </Text>
                </View>

                <View
                    style={[
                        styles.formCard,
                        {
                            backgroundColor: colors.background.primary,
                            borderColor: colors.border.light,
                        },
                    ]}
                >
                    <BasicInfoSection
                        name={formData.name}
                        description={formData.description}
                        onNameChange={(text) => onFieldChange('name', text)}
                        onDescriptionChange={(text) => onFieldChange('description', text)}
                        errors={errors}
                    />

                    <CategorySection
                        categories={categories}
                        selectedIds={formData.selectedCategoryIds}
                        onSelectionChange={(ids) => onFieldChange('selectedCategoryIds', ids)}
                        isLoading={loadingCategories}
                        error={errors.categories}
                    />

                    <ImageSection
                        logoUri={formData.logoUri}
                        coverUri={formData.coverUri}
                        galleryUris={formData.galleryUris}
                        onLogoChange={(uri) => onFieldChange('logoUri', uri)}
                        onCoverChange={(uri) => onFieldChange('coverUri', uri)}
                        onGalleryChange={(uris) => onFieldChange('galleryUris', uris)}
                    />

                    <LocationSection
                        onLocationSelect={onLocationSelect}
                        initialLatitude={formData.coordinates?.latitude}
                        initialLongitude={formData.coordinates?.longitude}
                        error={errors.location}
                    />

                    <ContactSection
                        phone={formData.phone}
                        email={formData.email}
                        website={formData.website}
                        onPhoneChange={(text) => onFieldChange('phone', text)}
                        onEmailChange={(text) => onFieldChange('email', text)}
                        onWebsiteChange={(text) => onFieldChange('website', text)}
                    />

                    <SocialLinksSection
                        facebook={formData.facebook}
                        instagram={formData.instagram}
                        tiktok={formData.tiktok}
                        onFacebookChange={(text) => onFieldChange('facebook', text)}
                        onInstagramChange={(text) => onFieldChange('instagram', text)}
                        onTiktokChange={(text) => onFieldChange('tiktok', text)}
                    />

                    <FormActions
                        onCancel={onCancel}
                        onSubmit={onSubmit}
                        isSubmitting={isSubmitting}
                        submitLabel={submitLabel}
                        hasChanges={hasChanges}
                    />
                </View>
            </ScrollView>

            {isSubmitting && (
                <View style={[styles.loadingOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                    <View
                        style={[
                            styles.loadingCard,
                            { backgroundColor: colors.background.primary },
                        ]}
                    >
                        <ActivityIndicator size="large" color={colors.primary[500]} />
                        <Text style={[styles.loadingText, { color: colors.text.primary }]}>
                            {loadingLabel}
                        </Text>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    );
});
