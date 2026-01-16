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
    EventBasicInfoSection,
    EventDateSection,
    EventPricingSection,
    EventImageSection,
} from '@/components/events';
import {
    CategorySection,
    LocationSection,
    ContactSection,
    SocialLinksSection,
    FormActions,
} from '@/components/manage';
import { styles } from './styles';
import type { CategoryItem } from '@/features/business/services/categories.service';

interface EventFormData {
    name: string;
    description: string;
    selectedCategoryIds: string[];
    startDate: Date;
    endDate: Date;
    isFree: boolean;
    price: string;
    capacity: string;
    province: string | null;
    canton: string | null;
    district: string | null;
    address: string | null;
    coordinates: { latitude: number; longitude: number } | null;
    phone: string;
    email: string;
    website: string;
    ticketUrl: string;
    facebook: string;
    instagram: string;
    tiktok: string;
    coverUri: string | null;
    galleryUris: string[];
}

interface EventFormErrors {
    name?: string;
    categories?: string;
    location?: string;
    dates?: string;
    startDate?: string;
    endDate?: string;
}

interface EventFormViewProps {
    title: string;
    subtitle: string;
    formData: EventFormData;
    errors: EventFormErrors;
    categories: CategoryItem[];
    loadingCategories: boolean;
    isSubmitting: boolean;
    hasChanges: boolean;
    submitLabel: string;
    loadingLabel: string;
    onFieldChange: (field: keyof EventFormData, value: any) => void;
    onLocationSelect: (location: any) => void;
    onCancel: () => void;
    onSubmit: () => void;
}

export const EventFormView = memo(function EventFormView({
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
}: EventFormViewProps) {
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
                    <EventBasicInfoSection
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

                    <EventDateSection
                        startDate={formData.startDate}
                        endDate={formData.endDate}
                        onStartDateChange={(date) => onFieldChange('startDate', date)}
                        onEndDateChange={(date) => onFieldChange('endDate', date)}
                        errors={errors}
                    />

                    <EventPricingSection
                        isFree={formData.isFree}
                        price={formData.price}
                        capacity={formData.capacity}
                        onIsFreeChange={(value) => onFieldChange('isFree', value)}
                        onPriceChange={(text) => onFieldChange('price', text)}
                        onCapacityChange={(text) => onFieldChange('capacity', text)}
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

                    <EventImageSection
                        coverUri={formData.coverUri}
                        galleryUris={formData.galleryUris}
                        onCoverChange={(uri) => onFieldChange('coverUri', uri)}
                        onGalleryChange={(uris) => onFieldChange('galleryUris', uris)}
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
