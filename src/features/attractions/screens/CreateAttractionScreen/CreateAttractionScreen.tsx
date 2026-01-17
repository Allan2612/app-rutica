import { memo } from 'react';
import { useRouter } from 'expo-router';
import { useCreateAttractionForm } from '@/features/attractions/hooks';
import { AttractionFormView } from '@/components/attractions/AttractionFormView/AttractionFormView';

export const CreateAttractionScreen = memo(function CreateAttractionScreen() {
    const router = useRouter();
    const {
        categories,
        loadingCategories,
        formData,
        errors,
        updateField,
        handleSubmit,
        handleLocationSelect,
        isSubmitting,
        hasChanges,
    } = useCreateAttractionForm();

    return (
        <AttractionFormView
            title="Crear Atracción"
            subtitle="Completa la información para crear una nueva atracción turística"
            formData={formData}
            errors={errors}
            categories={categories}
            loadingCategories={loadingCategories}
            isSubmitting={isSubmitting}
            hasChanges={hasChanges}
            submitLabel="Crear Atracción"
            onFieldChange={updateField}
            onLocationSelect={handleLocationSelect}
            onCancel={() => router.push('/(app)/(tabs)/manage/attractions')}
            onSubmit={handleSubmit}
        />
    );
});
