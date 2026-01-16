import { memo } from 'react';
import { useRouter } from 'expo-router';
import { useCreateEventForm } from '@/features/events/hooks';
import { EventFormView } from '@/components/events';

export const CreateEventScreen = memo(function CreateEventScreen() {
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
    } = useCreateEventForm();

    return (
        <EventFormView
            title="Crear Evento"
            subtitle="Completa la información para crear un nuevo evento"
            formData={formData}
            errors={errors}
            categories={categories}
            loadingCategories={loadingCategories}
            isSubmitting={isSubmitting}
            hasChanges={hasChanges}
            submitLabel="Crear Evento"
            onFieldChange={updateField}
            onLocationSelect={handleLocationSelect}
            onCancel={() => router.push('/(app)/(tabs)/manage/events')}
            onSubmit={handleSubmit}
        />
    );
});
