import { useState, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useCategories } from '@/hooks/useCategories';
import { useBusinessById, useUpdateBusiness } from '@/features/business/hooks/useUserBusinesses';
import type { UpdateBusinessData } from '@/features/business/services/updateBusiness.service';

interface UseBusinessFormProps {
    businessId: string;
}

export function useBusinessForm(businessId: string) {
    const router = useRouter();
    const { data: categories = [], isLoading: loadingCategories } = useCategories();
    const { data: business, isLoading: loadingBusiness, error } = useBusinessById(businessId);
    const updateMutation = useUpdateBusiness();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        selectedCategoryIds: [] as string[],
        phone: '',
        email: '',
        website: '',
        logoUri: null as string | null,
        coverUri: null as string | null,
        galleryUris: [] as string[],
        districtId: null as string | null,
        address: '',
        coordinates: null as { latitude: number; longitude: number } | null,
    });

    const [originalData, setOriginalData] = useState(formData);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const hasChanges = useMemo(() => {
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    }, [formData, originalData]);

    useEffect(() => {
        if (business) {
            const loadedData = {
                name: business.name,
                description: business.description || '',
                selectedCategoryIds: business.categoryIds,
                phone: business.phone || '',
                email: business.email || '',
                website: business.website || '',
                logoUri: business.logoUrl,
                coverUri: business.coverUrl,
                galleryUris: business.galleryUrls,
                districtId: business.districtId,
                address: business.address || '',
                coordinates: (business.latitude && business.longitude)
                    ? { latitude: business.latitude, longitude: business.longitude }
                    : null,
            };
            setFormData(loadedData);
            setOriginalData(loadedData);
        }
    }, [business]);

    const updateField = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
        if (formData.selectedCategoryIds.length === 0) newErrors.categories = 'Selecciona al menos una categoría';
        if (!formData.coordinates) newErrors.location = 'Selecciona una ubicación en el mapa';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            Toast.show({
                type: 'error',
                text1: 'Campos incompletos',
                text2: 'Por favor completa todos los campos obligatorios',
                position: 'top',
                visibilityTime: 3000,
            });
            return;
        }

        if (!formData.districtId) {
            Toast.show({
                type: 'error',
                text1: 'Ubicación incompleta',
                text2: 'Por favor selecciona un distrito válido',
                position: 'top',
                visibilityTime: 3000,
            });
            return;
        }

        try {
            const data: UpdateBusinessData = {
                name: formData.name.trim(),
                description: formData.description.trim() || null,
                categoryIds: formData.selectedCategoryIds,
                districtId: formData.districtId,
                address: formData.address.trim() || null,
                latitude: formData.coordinates!.latitude,
                longitude: formData.coordinates!.longitude,
                phone: formData.phone.trim() || null,
                email: formData.email.trim() || null,
                website: formData.website.trim() || null,
                facebook: null,
                instagram: null,
                tiktok: null,
                logoUri: formData.logoUri,
                coverUri: formData.coverUri,
                galleryUris: formData.galleryUris,
            };

            await updateMutation.mutateAsync({ businessId, data });
            Toast.show({
                type: 'success',
                text1: '¡Comercio actualizado!',
                text2: 'Los cambios se guardaron exitosamente',
                position: 'top',
                visibilityTime: 2000,
            });

            // Redirigir después de un breve delay para que se vea el toast
            setTimeout(() => {
                router.replace('/(app)/(tabs)/manage/businesses');
            }, 500);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error al actualizar el comercio',
                text2: 'Por favor intenta de nuevo o contacta soporte',
                position: 'top',
                visibilityTime: 4000,
            });
        }
    };

    const handleLocationSelect = (location: any) => {
        // Solo guardar coordenadas, la validación se hace al guardar
        if (location.latitude && location.longitude) {
            updateField('coordinates', { latitude: location.latitude, longitude: location.longitude });
        }
    };

    return {
        categories,
        business,
        loadingCategories,
        loadingBusiness,
        formData,
        errors,
        updateField,
        handleSubmit,
        handleLocationSelect,
        isSubmitting: updateMutation.isPending,
        hasChanges,
        router,
    };
}
