import { memo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useProductForm } from '@/features/products/hooks';
import { useCategories } from '@/hooks/useCategories';
import {
  GenericFormView,
  BasicInfoSection,
  CategorySection,
  ImageSection,
  ActiveToggleSection,
} from '@/components/manage';

export const AddProductScreen = memo(function AddProductScreen() {
  const { id: businessId } = useLocalSearchParams<{ id: string }>();

  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const { formState, formActions, handlers, isSubmitting } = useProductForm(businessId || '');

  // Determinar si hay cambios para habilitar el botón de guardar
  const hasChanges = Boolean(
    formState.name.trim() ||
    formState.description.trim() ||
    formState.price.trim() ||
    formState.selectedCategoryIds.length > 0 ||
    formState.images.length > 0,
  );

  return (
    <GenericFormView
      title="Agregar Producto"
      subtitle="Completa la información de tu producto"
      isSubmitting={isSubmitting}
      hasChanges={hasChanges}
      submitLabel="Crear Producto"
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
