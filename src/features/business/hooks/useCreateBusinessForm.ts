import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useCategories } from '@/hooks/useCategories';
import { useCreateBusiness } from './useCreateBusiness';
import type { CreateBusinessData } from '../services';

interface FormData {
    name: string;
    description: string;
    selectedCategoryIds: string[];
    country: string | null;      // Nombre del país
    province: string | null;     // Nombre de la provincia
    canton: string | null;       // Nombre del cantón
    district: string | null;     // Nombre del distrito
    address: string;
    coordinates: { latitude: number; longitude: number } | null;
    phone: string;
    email: string;
    website: string;
    facebook: string;
    instagram: string;
    tiktok: string;
    logoUri: string | null;
    coverUri: string | null;
    galleryUris: string[];
}

interface FormErrors {
    name?: string;
    categories?: string;
    location?: string;
}

const initialFormData: FormData = {
    name: '',
    description: '',
    selectedCategoryIds: [],
    country: null,
    province: null,
    canton: null,
    district: null,
    address: '',
    coordinates: null,
    phone: '',
    email: '',
    website: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    logoUri: null,
    coverUri: null,
    galleryUris: [],
};

export function useCreateBusinessForm() {
    const router = useRouter();
    const { data: categories = [], isLoading: loadingCategories } = useCategories();
    const createMutation = useCreateBusiness();

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});

    const hasChanges = useMemo(() => {
        return JSON.stringify(formData) !== JSON.stringify(initialFormData);
    }, [formData]);

    const updateField = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    }, [errors]);

    const handleLocationSelect = useCallback((location: any) => {
        // Validar que la ubicación tenga país y sea Costa Rica
        const country = location.country?.toLowerCase() || '';
        const isCostaRica = country.includes('costa rica') || country === 'cr';

        if (!isCostaRica && location.country) {
            // Si tiene país pero no es Costa Rica, rechazar
            Toast.show({
                type: 'error',
                text1: 'Ubicación no válida',
                text2: `La ubicación está en ${location.country}, debe estar en Costa Rica`,
                position: 'top',
                visibilityTime: 4000,
            });
            return;
        }

        setFormData((prev) => ({
            ...prev,
            country: location.country || 'Costa Rica',
            province: location.province || null,
            canton: location.canton || null,
            district: location.district || null,
            address: location.address || '',
            coordinates:
                location.latitude && location.longitude
                    ? { latitude: location.latitude, longitude: location.longitude }
                    : null,
        }));
        if (errors.location) {
            setErrors((prev) => ({ ...prev, location: undefined }));
        }
    }, [errors.location]);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es obligatorio';
        }

        if (formData.selectedCategoryIds.length === 0) {
            newErrors.categories = 'Selecciona al menos una categoría';
        }

        if (!formData.coordinates) {
            newErrors.location = 'Selecciona una ubicación en el mapa';
        } else if (!formData.country || !formData.province || !formData.canton || !formData.district) {
            newErrors.location = 'Ubicación incompleta. Mueve el pin a una ciudad, distrito o pueblo específico';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = useCallback(async () => {
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
            const data: CreateBusinessData = {
                name: formData.name.trim(),
                description: formData.description.trim() || undefined,
                categoryIds: formData.selectedCategoryIds,
                country: formData.country!,
                province: formData.province!,
                canton: formData.canton!,
                district: formData.district!,
                address: formData.address.trim() || undefined,
                latitude: formData.coordinates!.latitude,
                longitude: formData.coordinates!.longitude,
                phone: formData.phone.trim() || undefined,
                email: formData.email.trim() || undefined,
                website: formData.website.trim() || undefined,
                logoUri: formData.logoUri,
                coverUri: formData.coverUri,
                galleryUris: formData.galleryUris,
            };

            await createMutation.mutateAsync(data);
            Toast.show({
                type: 'success',
                text1: '¡Comercio creado!',
                text2: 'Tu negocio ha sido creado exitosamente',
                position: 'top',
                visibilityTime: 2000,
            });

            setTimeout(() => {
                router.replace('/(app)/(tabs)/manage/businesses');
            }, 500);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error al crear el comercio',
                text2: 'Por favor intenta de nuevo o contacta soporte',
                position: 'top',
                visibilityTime: 4000,
            });
        }
    }, [formData, createMutation, router]);

    return {
        categories,
        loadingCategories,
        formData,
        errors,
        updateField,
        handleSubmit,
        handleLocationSelect,
        isSubmitting: createMutation.isPending,
        hasChanges,
    };
}
