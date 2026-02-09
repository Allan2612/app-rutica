import { memo } from 'react';
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
interface BusinessFormData {
  name: string;
  description: string;
  selectedCategoryIds: string[];
  districtId: string | null;
  address: string;
  coordinates: { latitude: number; longitude: number } | null;
  phone: string;
  email: string;
  website: string;
  logoUri: string | null;
  coverUri: string | null;
  galleryUris: string[];
  facebook: string;
  instagram: string;
  tiktok: string;
  isActive: boolean;
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
  categories: CategoryOption[];
  loadingCategories: boolean;
  isSubmitting: boolean;
  hasChanges: boolean;
  submitLabel: string;
  onFieldChange: (field: keyof BusinessFormData, value: any) => void;
  onLocationSelect: (location: any) => void;
  onCancel: () => void;
  onSubmit: () => void;
  maxGalleryImages?: number;
  galleryHelperText?: string;
  /** Mostrar banner de upsell para galería premium */
  showGalleryPremiumUpsell?: boolean;
  /** Callback cuando se presiona el botón de comprar premium */
  onGalleryPremiumPress?: () => void;
  /** Nombre del paquete premium para el upsell (ej: 'Galería Empresa') */
  premiumPackageName?: string;
  /** Mensaje personalizado para el banner de upsell */
  upsellMessage?: string;
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
  onFieldChange,
  onLocationSelect,
  onCancel,
  onSubmit,
  maxGalleryImages = 3,
  galleryHelperText,
  showGalleryPremiumUpsell = false,
  onGalleryPremiumPress,
  premiumPackageName = 'Galería Empresa',
  upsellMessage,
}: BusinessFormViewProps) {
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
        maxGalleryImages={maxGalleryImages}
        galleryHelperText={galleryHelperText}
        showGalleryPremiumUpsell={showGalleryPremiumUpsell}
        onGalleryPremiumPress={onGalleryPremiumPress}
        premiumPackageName={premiumPackageName}
        upsellMessage={upsellMessage}
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
        helperText="Controla si tu negocio es visible para los usuarios"
      />

      <SocialLinksSection
        facebook={formData.facebook}
        instagram={formData.instagram}
        tiktok={formData.tiktok}
        onFacebookChange={(text) => onFieldChange('facebook', text)}
        onInstagramChange={(text) => onFieldChange('instagram', text)}
        onTiktokChange={(text) => onFieldChange('tiktok', text)}
      />
    </GenericFormView>
  );
});
