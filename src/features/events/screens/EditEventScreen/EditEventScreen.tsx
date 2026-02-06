import { memo, useState, useCallback, useMemo } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from 'react-native-toast-message';
import { useThemedColors, useEventGalleryQuota } from "@/hooks";
import { useEventForm } from '@/features/events/hooks/useEventForm';
import { EventFormView } from '@/components/events/EventFormView/EventFormView';
import { PremiumModal } from '@/components/user/PremiumModal/PremiumModal';
import { styles } from "@/components/events/EventFormView/styles";

export const EditEventScreen = memo(function EditEventScreen() {
  const colors = useThemedColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Estado para el modal premium de galería
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const {
    categories,
    event,
    loadingCategories,
    loadingEvent,
    formData,
    errors,
    updateField,
    handleSubmit,
    handleLocationSelect,
    isSubmitting,
    hasChanges,
  } = useEventForm(id);

  // Cuota de galería del evento
  const { quotaInfo, invalidateQuota } = useEventGalleryQuota(id ?? '', !!id);

  // Calcular límite máximo de imágenes de galería
  const maxGalleryImages = quotaInfo?.totalQuota ?? 3;

  // Mostrar upsell cuando:
  // 1. No tiene premium Y las fotos en el form >= límite gratis (3)
  // 2. Tiene premium PERO las fotos en el form >= su cuota total
  const showGalleryPremiumUpsell = useMemo(() => {
    if (!quotaInfo) return false;
    const { hasPremium, freeQuota, totalQuota } = quotaInfo;
    const currentCount = formData.galleryUris.length;

    if (!hasPremium) {
      return currentCount >= freeQuota;
    }
    // Si tiene premium, mostrar cuando alcanzó su límite total
    return currentCount >= totalQuota;
  }, [quotaInfo, formData.galleryUris.length]);

  // Mensaje personalizado para el upsell
  const upsellMessage = useMemo(() => {
    if (!quotaInfo) return undefined;
    const { hasPremium } = quotaInfo;
    if (hasPremium) {
      return '¡Usaste todas las fotos de tu paquete! Compra otro paquete Galería Eventos para añadir 10 fotos más.';
    }
    return 'Ya usaste tus 3 fotos gratuitas. Con el paquete Galería Eventos puedes añadir 10 fotos más a tu galería.';
  }, [quotaInfo]);

  // Texto de ayuda con información de cuota
  const galleryHelperText = useMemo(() => {
    if (!quotaInfo) return `Hasta ${maxGalleryImages} imágenes adicionales`;
    const { hasPremium, totalQuota } = quotaInfo;
    const currentCount = formData.galleryUris.length;
    const remaining = Math.max(0, totalQuota - currentCount);
    if (hasPremium) {
      return `Galería Premium: ${currentCount}/${totalQuota} fotos usadas (${remaining} disponibles)`;
    }
    return `Hasta ${totalQuota} imágenes adicionales (Plan gratuito)`;
  }, [quotaInfo, maxGalleryImages, formData.galleryUris.length]);

  const handleGalleryPremiumPress = useCallback(() => {
    setShowPremiumModal(true);
  }, []);

  const handlePremiumModalClose = useCallback(() => {
    setShowPremiumModal(false);
  }, []);

  const handlePremiumSubscribed = useCallback(() => {
    setShowPremiumModal(false);
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

  if (loadingEvent || loadingCategories) {
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

  if (!event) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.secondary },
        ]}
      >
        <Text style={[styles.title, { color: colors.text.primary }]}>
          No se encontró el evento
        </Text>
      </View>
    );
  }

  return (
    <>
      <EventFormView
        title="Editar Evento"
        subtitle="Modifica la información de tu evento"
        formData={formData}
        errors={errors}
        categories={categories}
        loadingCategories={loadingCategories}
        isSubmitting={isSubmitting}
        hasChanges={hasChanges}
        submitLabel="Guardar Cambios"
        onFieldChange={updateField}
        onLocationSelect={handleLocationSelect}
        onCancel={() => router.push("/(app)/(tabs)/manage/events")}
        onSubmit={handleSubmit}
        maxGalleryImages={maxGalleryImages}
        galleryHelperText={galleryHelperText}
        showGalleryPremiumUpsell={showGalleryPremiumUpsell}
        onGalleryPremiumPress={handleGalleryPremiumPress}
        premiumPackageName="Galería Eventos"
        upsellMessage={upsellMessage}
      />
      <PremiumModal
        visible={showPremiumModal}
        onClose={handlePremiumModalClose}
        initialPlan="gallery_events"
        onSubscribed={handlePremiumSubscribed}
        preSelectedEntityId={id}
        preSelectedEntityType="event"
      />
    </>
  );
});
