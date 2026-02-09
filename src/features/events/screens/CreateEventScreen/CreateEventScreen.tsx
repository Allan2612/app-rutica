import { memo, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useCreateEventForm } from '@/features/events/hooks';
import { EventFormView } from '@/components/events/EventFormView/EventFormView';
import { PremiumModal } from '@/components/user/PremiumModal/PremiumModal';

// Límite gratuito de fotos de galería
const FREE_GALLERY_LIMIT = 3;

export const CreateEventScreen = memo(function CreateEventScreen() {
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
  } = useCreateEventForm();

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
        text1: 'Primero crea el evento',
        text2: 'Podrás comprar el paquete de galería después de crear el evento.',
        position: 'top',
        visibilityTime: 4000,
        topOffset: 60,
      });
    }, 300);
  }, []);

  return (
    <>
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
        maxGalleryImages={FREE_GALLERY_LIMIT}
        galleryHelperText={galleryHelperText}
        showGalleryPremiumUpsell={showGalleryPremiumUpsell}
        onGalleryPremiumPress={handleOpenPremiumModal}
        premiumPackageName="Galería Eventos"
      />
      <PremiumModal
        visible={isPremiumModalVisible}
        onClose={handleClosePremiumModal}
        onSubscribed={handlePremiumSuccess}
        initialPlan="gallery_events"
      />
    </>
  );
});
