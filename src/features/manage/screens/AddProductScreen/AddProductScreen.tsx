import { memo } from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { useProductForm } from '@/features/products/hooks';
import { useCategories } from '@/features/business/hooks';
import {
    AddProductHeader,
    ProductBasicInfo,
    ProductCurrencySelector,
    CategorySection,
    ProductImagesSection,
    FormActions,
} from '@/components/manage';
import { styles } from './styles';

export const AddProductScreen = memo(function AddProductScreen() {
    const colors = useThemedColors();
    const { id: businessId } = useLocalSearchParams<{ id: string }>();

    const { data: categories = [], isLoading: loadingCategories } = useCategories();
    const { formState, formActions, handlers, isSubmitting } = useProductForm(businessId || '');

    return (
        <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <AddProductHeader
                    title="Agregar Producto"
                    subtitle="Completa la información de tu producto"
                />

                <ProductBasicInfo
                    name={formState.name}
                    description={formState.description}
                    price={formState.price}
                    onNameChange={formActions.setName}
                    onDescriptionChange={formActions.setDescription}
                    onPriceChange={formActions.setPrice}
                    errors={formState.errors}
                />

                <ProductCurrencySelector
                    currency={formState.currency}
                    onCurrencyChange={formActions.setCurrency}
                />

                <CategorySection
                    categories={categories}
                    selectedIds={formState.selectedCategoryIds}
                    onSelectionChange={formActions.setSelectedCategoryIds}
                    isLoading={loadingCategories}
                />

                <ProductImagesSection
                    images={formState.images}
                    onImagesChange={formActions.setImages}
                />
            </ScrollView>

            <FormActions
                onCancel={handlers.handleCancel}
                onSubmit={handlers.handleSubmit}
                isSubmitting={isSubmitting}
                submitLabel="Crear Producto"
            />
        </View>
    );
});
