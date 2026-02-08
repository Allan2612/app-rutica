import { memo } from 'react';
import {
    EventDateSection,
    EventPricingSection,
} from '@/components/events';
import {
    BasicInfoSection,
    CategorySection,
    ImageSection,
    LocationSection,
    ContactSection,
    SocialLinksSection,
    ActiveToggleSection,
} from '@/components/manage';
import { GenericFormView } from '@/components/manage/GenericFormView/GenericFormView';
import type { CategoryOption } from '@/types/entities';

interface EventFormData {
    name: string;
    description: string;
    selectedCategoryIds: string[];
    startDate: Date;
    endDate: Date;
    isFree: boolean;
    price: string;
    capacity: string;
    country: string | null;
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
    isActive: boolean;
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
    categories: CategoryOption[];
    loadingCategories: boolean;
    isSubmitting: boolean;
    hasChanges: boolean;
    submitLabel: string;
    onFieldChange: (field: keyof EventFormData, value: any) => void;
    onLocationSelect: (location: any) => void;
    onCancel: () => void;
    onSubmit: () => void;
    // Props opcionales para cuota de galería premium
    maxGalleryImages?: number;
    galleryHelperText?: string;
    showGalleryPremiumUpsell?: boolean;
    onGalleryPremiumPress?: () => void;
    /** Nombre del paquete premium para el upsell (ej: 'Galería Eventos') */
    premiumPackageName?: string;
    /** Mensaje personalizado para el banner de upsell */
    upsellMessage?: string;
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
    onFieldChange,
    onLocationSelect,
    onCancel,
    onSubmit,
    maxGalleryImages = 3,
    galleryHelperText,
    showGalleryPremiumUpsell = false,
    onGalleryPremiumPress,
    premiumPackageName = 'Galería Eventos',
    upsellMessage,
}: EventFormViewProps) {
    return (
        <GenericFormView
            title={title}
            subtitle={subtitle}
            isSubmitting={isSubmitting}
            hasChanges={hasChanges}
            submitLabel={submitLabel}
            onCancel={onCancel}
            onSubmit={onSubmit}
        >
            <BasicInfoSection
                name={formData.name}
                description={formData.description}
                onNameChange={(text) => onFieldChange('name', text)}
                onDescriptionChange={(text) => onFieldChange('description', text)}
                errors={errors}
                nameLabel="Nombre del Evento"
                namePlaceholder="Ej: Festival de Música 2026"
                descriptionPlaceholder="Describe el evento (opcional)"
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

            <ActiveToggleSection
                isActive={formData.isActive}
                onToggle={(value) => onFieldChange('isActive', value)}
                helperText="Cuando está inactivo, el evento no aparecerá en búsquedas ni será visible para otros usuarios"
            />

            <SocialLinksSection
                facebook={formData.facebook}
                instagram={formData.instagram}
                tiktok={formData.tiktok}
                onFacebookChange={(text) => onFieldChange('facebook', text)}
                onInstagramChange={(text) => onFieldChange('instagram', text)}
                onTiktokChange={(text) => onFieldChange('tiktok', text)}
            />

            <ImageSection
                coverUri={formData.coverUri}
                galleryUris={formData.galleryUris}
                onCoverChange={(uri) => onFieldChange('coverUri', uri)}
                onGalleryChange={(uris) => onFieldChange('galleryUris', uris)}
                showLogo={false}
                sectionTitle="Imágenes del Evento"
                coverHelperText="Esta imagen se mostrará como principal del evento"
                galleryHelperText={galleryHelperText || `Agrega hasta ${maxGalleryImages} imágenes adicionales del evento`}
                maxGalleryImages={maxGalleryImages}
                showPremiumUpsell={showGalleryPremiumUpsell}
                onPremiumPress={onGalleryPremiumPress}
                premiumPackageName={premiumPackageName}
                upsellMessage={upsellMessage}
            />
        </GenericFormView>
    );
});
