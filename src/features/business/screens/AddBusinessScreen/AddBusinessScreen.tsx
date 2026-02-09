import { memo } from 'react';
import { useRouter } from 'expo-router';
import { useCreateBusinessForm } from '@/features/business/hooks';
import { BusinessFormView } from '@/components/business';

export const AddBusinessScreen = memo(function AddBusinessScreen() {
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
  } = useCreateBusinessForm();

  return (
    <BusinessFormView
      title="Agregar Negocio"
      subtitle="Completa la información para agregar un nuevo negocio"
      formData={formData}
      errors={errors}
      categories={categories}
      loadingCategories={loadingCategories}
      isSubmitting={isSubmitting}
      hasChanges={hasChanges}
      submitLabel="Crear Negocio"
      onFieldChange={updateField}
      onLocationSelect={handleLocationSelect}
      onCancel={() => router.push('/(app)/(tabs)/manage/businesses')}
      onSubmit={handleSubmit}
    />
  );
});
