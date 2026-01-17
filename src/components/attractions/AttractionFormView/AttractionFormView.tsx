import { memo } from 'react';
import {
    BasicInfoSection,
    CategorySection,
    ImageSection,
    LocationSection,
} from '@/components/manage';
import { GenericFormView } from '@/components/manage/GenericFormView/GenericFormView';
import type { CategoryItem } from '@/features/business/services/categories.service';

interface AttractionFormData {
    name: string;
    description: string;
    selectedCategoryIds: string[];
    province: string | null;
    canton: string | null;
    district: string | null;
    address: string | null;
    coordinates: { latitude: number; longitude: number } | null;
    coverUri: string | null;
    galleryUris: string[];
}

interface AttractionFormErrors {
    name?: string;
    categories?: string;
    location?: string;
}

interface AttractionFormViewProps {
    title: string;
    subtitle: string;
    formData: AttractionFormData;
    errors: AttractionFormErrors;
    categories: CategoryItem[];
    loadingCategories: boolean;
    isSubmitting: boolean;
    hasChanges: boolean;
    submitLabel: string;
    onFieldChange: (field: keyof AttractionFormData, value: any) => void;
    onLocationSelect: (location: any) => void;
    onCancel: () => void;
    onSubmit: () => void;
}

export const AttractionFormView = memo(function AttractionFormView({
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
}: AttractionFormViewProps) {
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
                nameLabel="Nombre de la Atracción"
                namePlaceholder="Ej: Volcán Arenal, Parque Manuel Antonio"
                descriptionPlaceholder="Describe la atracción (opcional)"
            />

            <CategorySection
                categories={categories}
                selectedIds={formData.selectedCategoryIds}
                onSelectionChange={(ids) => onFieldChange('selectedCategoryIds', ids)}
                isLoading={loadingCategories}
                error={errors.categories}
            />

            <LocationSection
                onLocationSelect={onLocationSelect}
                initialLatitude={formData.coordinates?.latitude}
                initialLongitude={formData.coordinates?.longitude}
                error={errors.location}
            />

            <ImageSection
                coverUri={formData.coverUri}
                galleryUris={formData.galleryUris}
                onCoverChange={(uri) => onFieldChange('coverUri', uri)}
                onGalleryChange={(uris) => onFieldChange('galleryUris', uris)}
                showLogo={false}
                sectionTitle="Imágenes de la Atracción"
                coverHelperText="Esta imagen se mostrará como principal de la atracción"
                galleryHelperText="Agrega hasta 3 imágenes adicionales de la atracción"
            />
        </GenericFormView>
    );
});
