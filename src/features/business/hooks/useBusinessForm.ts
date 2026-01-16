import { useState, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useCategories } from '@/features/business/hooks/useCategories';
import { useBusinessById, useUpdateBusiness } from '@/features/business/hooks/useUserBusinesses';
import type { UpdateBusinessData } from '@/features/business/services';

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
        facebook: '',
        instagram: '',
        tiktok: '',
        logoUri: null as string | null,
        coverUri: null as string | null,
        galleryUris: [] as string[],
        province: '',
        canton: '',
        district: '',
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
                facebook: business.facebook || '',
                instagram: business.instagram || '',
                tiktok: business.tiktok || '',
                logoUri: business.logoUrl,
                coverUri: business.coverUrl,
                galleryUris: business.galleryUrls,
                province: business.province || '',
                canton: business.canton || '',
                district: business.district || '',
                address: business.address || '',
                coordinates: { latitude: business.latitude, longitude: business.longitude },
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

        try {
            const data: UpdateBusinessData = {
                name: formData.name.trim(),
                description: formData.description.trim() || undefined,
                categoryIds: formData.selectedCategoryIds,
                province: formData.province || undefined,
                canton: formData.canton || undefined,
                district: formData.district || undefined,
                address: formData.address.trim() || undefined,
                latitude: formData.coordinates!.latitude,
                longitude: formData.coordinates!.longitude,
                phone: formData.phone.trim() || undefined,
                email: formData.email.trim() || undefined,
                website: formData.website.trim() || undefined,
                facebook: formData.facebook.trim() || undefined,
                instagram: formData.instagram.trim() || undefined,
                tiktok: formData.tiktok.trim() || undefined,
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
            console.error('Error updating business:', error);
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
        if (location.province) updateField('province', location.province);
        if (location.canton) updateField('canton', location.canton);
        if (location.district) updateField('district', location.district);
        if (location.address) updateField('address', location.address);
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
