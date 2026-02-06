import { memo, useMemo, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemedColors, useAttractionGalleryQuota } from '@/hooks';
import { useAttractionForm } from '@/features/attractions/hooks/useAttractionForm';
import { useProfile } from '@/features/user/hooks';
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

    // Obtener perfil del usuario para el rol
    const { profile } = useProfile();

    // Obtener cuota de galería para esta atracción
    const { quotaInfo: galleryQuota, invalidateQuota } = useAttractionGalleryQuota(id ?? '', !!id);

    // Calcular límite máximo de imágenes de galería
    const maxGalleryImages = galleryQuota?.totalQuota ?? 3;

    // Mostrar upsell cuando: no tiene premium Y las fotos en el form >= límite gratis (3)
    const showGalleryPremiumUpsell = useMemo(() => {
        if (!galleryQuota) return false;
        const { hasPremium, freeQuota } = galleryQuota;
        return !hasPremium && formData.galleryUris.length >= freeQuota;
    }, [galleryQuota, formData.galleryUris.length]);

    // Texto de ayuda con información de cuota
    const galleryHelperText = useMemo(() => {
        if (!galleryQuota) return `Hasta ${maxGalleryImages} imágenes adicionales`;
        const { hasPremium, totalQuota, usedCount, availableCount } = galleryQuota;
        if (hasPremium) {
            return `Galería Premium: ${usedCount}/${totalQuota} fotos usadas (${availableCount} disponibles)`;
        }
        return `Hasta ${totalQuota} imágenes adicionales (Plan gratuito)`;
    }, [galleryQuota, maxGalleryImages]);

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
            />
            <PremiumModal
                visible={isPremiumModalVisible}
                onClose={handleClosePremiumModal}
                onSuccess={handlePremiumSuccess}
                userRole={profile?.role_prf || null}
            />
        </>
    );
});
