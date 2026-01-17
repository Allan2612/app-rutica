import { memo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { useBusinessForm } from '@/features/business/hooks/useBusinessForm';
import { BusinessFormView } from '@/components/business';
import { styles } from '@/components/business/BusinessFormView/styles';

export const EditBusinessScreen = memo(function EditBusinessScreen() {
    const colors = useThemedColors();
    const router = useRouter();
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
        hasChanges,
    } = useBusinessForm(id);

    if (loadingBusiness || loadingCategories) {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: colors.background.secondary },
                ]}
            >
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    if (!business) {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: colors.background.secondary },
                ]}
            >
                <Text style={[styles.title, { color: colors.text.primary }]}>
                    No se encontró el negocio
                </Text>
            </View>
        );
    }

    return (
        <BusinessFormView
            title="Editar Negocio"
            subtitle="Modifica la información de tu negocio"
            formData={formData}
            errors={errors}
            categories={categories}
            loadingCategories={loadingCategories}
            isSubmitting={isSubmitting}
            hasChanges={hasChanges}
            submitLabel="Guardar Cambios"
            onFieldChange={updateField}
            onLocationSelect={handleLocationSelect}
            onCancel={() => router.push('/(app)/(tabs)/manage/businesses')}
            onSubmit={handleSubmit}
        />
    );
});
