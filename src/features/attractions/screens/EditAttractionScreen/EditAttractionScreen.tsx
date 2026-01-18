import { memo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { useAttractionForm } from '@/features/attractions/hooks/useAttractionForm';
import { AttractionFormView } from '@/components/attractions/AttractionFormView/AttractionFormView';
import { formViewStyles as styles } from '@/styles/form-view-styles';

export const EditAttractionScreen = memo(function EditAttractionScreen() {
    const colors = useThemedColors();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const {
        categories,
        attraction,
        loadingCategories,
        loadingAttraction,
        formData,
        errors,
        updateField,
        handleSubmit,
        handleLocationSelect,
        isSubmitting,
        hasChanges,
    } = useAttractionForm(id);

    if (loadingAttraction || loadingCategories) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    if (!attraction) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
                <Text style={[styles.title, { color: colors.text.primary }]}>
                    No se encontró la atracción
                </Text>
            </View>
        );
    }

    return (
        <AttractionFormView
            title="Editar Atracción"
            subtitle="Modifica la información de tu atracción turística"
            formData={formData}
            errors={errors}
            categories={categories}
            loadingCategories={loadingCategories}
            isSubmitting={isSubmitting}
            hasChanges={hasChanges}
            submitLabel="Guardar Cambios"
            onFieldChange={updateField}
            onLocationSelect={handleLocationSelect}
            onCancel={() => router.push('/(app)/(tabs)/manage/attractions')}
            onSubmit={handleSubmit}
        />
    );
});
