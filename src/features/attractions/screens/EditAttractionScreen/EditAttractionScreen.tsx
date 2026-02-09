import { memo, useMemo, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useThemedColors, useAttractionGalleryQuota, useRefreshOnFocus } from '@/hooks';
import { useAttractionForm } from '@/features/attractions/hooks/useAttractionForm';
import { AttractionFormView } from '@/components/attractions/AttractionFormView/AttractionFormView';
import { PremiumModal } from '@/components/user';
import { formViewStyles as styles } from '@/styles/form-view-styles';

export const EditAttractionScreen = memo(function EditAttractionScreen() {
  const colors = useThemedColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Estado para el modal premium
  const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);

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

  // Obtener cuota de galería para esta atracción
  const {
    quotaInfo: galleryQuota,
    invalidateQuota,
    refetch: refetchQuota,
  } = useAttractionGalleryQuota(id ?? '', !!id);

  // Refrescar cuota de galería cuando la pantalla recibe foco
  useRefreshOnFocus(refetchQuota);

  // Calcular límite máximo de imágenes de galería
  const maxGalleryImages = galleryQuota?.totalQuota ?? 3;

  // Mostrar upsell cuando: no tiene premium Y fotos >= límite gratis, O tiene premium Y fotos >= totalQuota
  const showGalleryPremiumUpsell = useMemo(() => {
    if (!galleryQuota) return false;
    const { hasPremium, freeQuota, totalQuota } = galleryQuota;
    const currentCount = formData.galleryUris.length;
    if (!hasPremium) {
      return currentCount >= freeQuota;
    }
    // Mostrar upsell cuando el usuario premium agotó su cuota
    return currentCount >= totalQuota;
  }, [galleryQuota, formData.galleryUris.length]);

  // Mensaje de upsell personalizado
  const upsellMessage = useMemo(() => {
    if (!galleryQuota) return undefined;
    const { hasPremium } = galleryQuota;
    if (hasPremium) {
      return '¡Usaste todas las fotos de tu paquete! Compra otro paquete Galería Atracciones para añadir 10 fotos más.';
    }
    return 'Ya usaste tus 3 fotos gratuitas. Con el paquete Galería Atracciones puedes añadir 10 fotos más a tu galería.';
  }, [galleryQuota]);

  // Texto de ayuda con información de cuota
  const galleryHelperText = useMemo(() => {
    if (!galleryQuota) return `Hasta ${maxGalleryImages} imágenes adicionales`;
    const { hasPremium, totalQuota } = galleryQuota;
    const currentCount = formData.galleryUris.length;
    const remaining = Math.max(0, totalQuota - currentCount);
    if (hasPremium) {
      return `Galería Premium: ${currentCount}/${totalQuota} fotos usadas (${remaining} disponibles)`;
    }
    return `Hasta ${totalQuota} imágenes adicionales (Plan gratuito)`;
  }, [galleryQuota, maxGalleryImages, formData.galleryUris.length]);

  // Handlers para el modal premium
  const handleOpenPremiumModal = useCallback(() => {
    setIsPremiumModalVisible(true);
  }, []);

  const handleClosePremiumModal = useCallback(() => {
    setIsPremiumModalVisible(false);
  }, []);

  const handlePremiumSuccess = useCallback(() => {
    setIsPremiumModalVisible(false);
    invalidateQuota();
    // Mostrar toast después de cerrar el modal
    setTimeout(() => {
      Toast.show({
        type: 'success',
        text1: '¡Solicitud enviada!',
        text2: 'Podrás añadir más fotos cuando tu pago sea aprobado.',
        position: 'top',
        visibilityTime: 4000,
        topOffset: 60,
      });
    }, 300);
  }, [invalidateQuota]);

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
    <>
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
        maxGalleryImages={maxGalleryImages}
        galleryHelperText={galleryHelperText}
        showGalleryPremiumUpsell={showGalleryPremiumUpsell}
        onGalleryPremiumPress={handleOpenPremiumModal}
        premiumPackageName="Galería Atracciones"
        upsellMessage={upsellMessage}
      />
      <PremiumModal
        visible={isPremiumModalVisible}
        onClose={handleClosePremiumModal}
        onSubscribed={handlePremiumSuccess}
        initialPlan="gallery_attractions"
        preSelectedEntityId={id}
        preSelectedEntityType="attraction"
        preSelectedEntityName={attraction?.name ?? ''}
      />
    </>
  );
});
