import { memo } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEditProductForm } from '@/features/products/hooks';
import { useCategories } from '@/hooks/useCategories';
import {
    GenericFormView,
    BasicInfoSection,
    CategorySection,
    ImageSection,
    ActiveToggleSection,
} from '@/components/manage';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export const EditProductScreen = memo(function EditProductScreen() {
    const { id: businessId, productId } = useLocalSearchParams<{ 
        id: string; 
        productId: string 
    }>();

    const colors = useThemedColors();
    const { data: categories = [], isLoading: loadingCategories } = useCategories();
    const { 
        formState, 
        formActions, 
        handlers, 
        isLoading,
        isSubmitting,
        loadError 
    } = useEditProductForm(businessId || '', productId || '');

    // Mostrar loading mientras se cargan los datos del producto
    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background.secondary }]}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
                <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                    Cargando producto...
                </Text>
            </View>
        );
    }

    // Mostrar error si no se pudo cargar el producto
    if (loadError) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background.secondary }]}>
                <Text style={[styles.errorText, { color: colors.error[600] }]}>
                    Error al cargar el producto
                </Text>
                <Text style={[styles.errorSubtext, { color: colors.text.secondary }]}>
                    {loadError instanceof Error ? loadError.message : 'Intenta de nuevo'}
                </Text>
            </View>
        );
    }

    // Determinar si hay cambios para habilitar el botón de guardar
    const hasChanges = Boolean(
        formState.name.trim() ||
        formState.description.trim() ||
        formState.price.trim() ||
        formState.selectedCategoryIds.length > 0 ||
        formState.images.length > 0
    );

    return (
        <GenericFormView
            title="Editar Producto"
            subtitle="Modifica la información de tu producto"
            isSubmitting={isSubmitting}
            hasChanges={hasChanges}
            submitLabel="Guardar Cambios"
            onCancel={handlers.handleCancel}
            onSubmit={handlers.handleSubmit}
        >
            <BasicInfoSection
                name={formState.name}
                description={formState.description}
                onNameChange={formActions.setName}
                onDescriptionChange={formActions.setDescription}
                errors={formState.errors}
                nameLabel="Nombre del Producto"
                namePlaceholder="Ej: Hamburguesa Clásica"
                descriptionPlaceholder="Describe tu producto..."
                // Props de precio y moneda para productos
                showPrice
                price={formState.price}
                onPriceChange={formActions.setPrice}
                priceLabel="Precio"
                pricePlaceholder="Ej: 5000"
                showCurrency
                currency={formState.currency}
                onCurrencyChange={formActions.setCurrency}
            />

            <CategorySection
                categories={categories}
                selectedIds={formState.selectedCategoryIds}
                onSelectionChange={formActions.setSelectedCategoryIds}
                isLoading={loadingCategories}
            />

            <ActiveToggleSection
                isActive={formState.isActive}
                onToggle={formActions.setIsActive}
                helperText="Cuando está inactivo, el producto no aparecerá en búsquedas ni será visible para otros usuarios"
            />

            <ImageSection
                galleryUris={formState.images}
                onGalleryChange={formActions.setImages}
                showLogo={false}
                showCover={false}
                sectionTitle="Imágenes del Producto"
                galleryLabel="Fotos del Producto (Opcional)"
                galleryHelperText="Máximo 2 imágenes que muestren tu producto"
                maxGalleryImages={2}
            />
        </GenericFormView>
    );
});
