import { memo, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useCreateAttractionForm } from '@/features/attractions/hooks';
import { AttractionFormView } from '@/components/attractions/AttractionFormView/AttractionFormView';
import { PremiumModal } from '@/components/user';

// Límite gratuito de fotos de galería
const FREE_GALLERY_LIMIT = 3;

export const CreateAttractionScreen = memo(function CreateAttractionScreen() {
  const router = useRouter();
  const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);

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

  // Mostrar upsell cuando el usuario alcanza el límite gratuito
  const showGalleryPremiumUpsell = useMemo(() => {
    return formData.galleryUris.length >= FREE_GALLERY_LIMIT;
  }, [formData.galleryUris.length]);

  const galleryHelperText = useMemo(() => {
    return `Hasta ${FREE_GALLERY_LIMIT} imágenes adicionales (Plan gratuito)`;
  }, []);

  const handleOpenPremiumModal = useCallback(() => {
    setIsPremiumModalVisible(true);
  }, []);

  const handleClosePremiumModal = useCallback(() => {
    setIsPremiumModalVisible(false);
  }, []);

  const handlePremiumSuccess = useCallback(() => {
    setIsPremiumModalVisible(false);
    // Mostrar toast informativo
    setTimeout(() => {
      Toast.show({
        type: 'info',
        text1: 'Primero crea la atracción',
        text2: 'Podrás comprar el paquete de galería después de crear la atracción.',
        position: 'top',
        visibilityTime: 4000,
        topOffset: 60,
      });
    }, 300);
  }, []);

  return (
    <>
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
        maxGalleryImages={FREE_GALLERY_LIMIT}
        galleryHelperText={galleryHelperText}
        showGalleryPremiumUpsell={showGalleryPremiumUpsell}
        onGalleryPremiumPress={handleOpenPremiumModal}
      />
      <PremiumModal
        visible={isPremiumModalVisible}
        onClose={handleClosePremiumModal}
        onSubscribed={handlePremiumSuccess}
        initialPlan="gallery_attractions"
      />
    </>
  );
});
