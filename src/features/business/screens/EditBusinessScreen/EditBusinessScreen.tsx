import { memo, useMemo, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemedColors, useBusinessGalleryQuota } from '@/hooks';
import { useBusinessForm } from '@/features/business/hooks/useBusinessForm';
import { useProfile } from '@/features/user/hooks';
import { BusinessFormView } from '@/components/business';
import { PremiumModal } from '@/components/user';
import { styles } from '@/components/business/BusinessFormView/styles';

export const EditBusinessScreen = memo(function EditBusinessScreen() {
    const colors = useThemedColors();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    // Estado para el modal premium
    const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);

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

    // Obtener perfil del usuario para el rol
    const { profile } = useProfile();

    // Obtener cuota de galería para este negocio
    const { quotaInfo: galleryQuota, invalidateQuota } = useBusinessGalleryQuota(id ?? '', !!id);

    // Calcular límite máximo de imágenes de galería
    // El hook ya devuelve totalQuota que es freeLimit + premiumQuota
    const maxGalleryImages = galleryQuota?.totalQuota ?? 3;

    // Mostrar upsell cuando: no tiene premium Y las fotos en el form >= límite gratis (3)
    const showGalleryPremiumUpsell = useMemo(() => {
        if (!galleryQuota) return false;
        const { hasPremium, freeQuota } = galleryQuota;
        // Mostrar si no tiene premium y ya tiene 3+ fotos en el formulario
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
        // Invalidar la cuota para que se actualice cuando el admin apruebe
        invalidateQuota();
    }, [invalidateQuota]);

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
        <>
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
