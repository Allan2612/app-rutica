import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useCategories } from '@/hooks/useCategories';
import { useCreateAttraction } from './useCreateAttraction';
import type { CreateAttractionData } from '../services/createAttraction.service';

interface FormData {
    name: string;
    description: string;
    selectedCategoryIds: string[];
    coverUri: string | null;
    galleryUris: string[];
    country: string | null;      // Nombre del país
    province: string | null;     // Nombre de la provincia
    canton: string | null;       // Nombre del cantón
    district: string | null;     // Nombre del distrito
    address: string | null;
    coordinates: { latitude: number; longitude: number } | null;
    phone: string;
    email: string;
    website: string;
    facebook: string;
    instagram: string;
    tiktok: string;
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
    coverUri: null,
    galleryUris: [],
    country: null,
    province: null,
    canton: null,
    district: null,
    address: null,
    coordinates: null,
    phone: '',
    email: '',
    website: '',
    facebook: '',
    instagram: '',
    tiktok: '',
};

export function useCreateAttractionForm() {
    const router = useRouter();
    const { data: categories = [], isLoading: loadingCategories } = useCategories();
    const createMutation = useCreateAttraction();

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});

    const hasChanges = useMemo(() => {
        return JSON.stringify(formData) !== JSON.stringify(initialFormData);
    }, [formData]);

    const updateField = useCallback(
        <K extends keyof FormData>(field: K, value: FormData[K]) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            if (errors[field as keyof FormErrors]) {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        },
        [errors]
    );

    const handleLocationSelect = useCallback(
        (location: any) => {
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
                address: location.address || null,
                coordinates:
                    location.latitude && location.longitude
                        ? { latitude: location.latitude, longitude: location.longitude }
                        : null,
            }));
            if (errors.location) {
                setErrors((prev) => ({ ...prev, location: undefined }));
            }
        },
        [errors.location]
    );

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
                text1: 'Formulario incompleto',
                text2: 'Por favor completa todos los campos requeridos',
                position: 'top',
                visibilityTime: 3000,
            });
            return;
        }

        try {
            const attractionData: CreateAttractionData = {
                name: formData.name,
                description: formData.description || null,
                categoryIds: formData.selectedCategoryIds,
                coverUri: formData.coverUri,
                galleryUris: formData.galleryUris,
                country: formData.country!,
                province: formData.province!,
                canton: formData.canton!,
                district: formData.district!,
                address: formData.address,
                latitude: formData.coordinates!.latitude,
                longitude: formData.coordinates!.longitude,
            };

            await createMutation.mutateAsync(attractionData);

            Toast.show({
                type: 'success',
                text1: 'Atracción creada',
                text2: 'Tu atracción ha sido creada y está pendiente de aprobación',
                position: 'top',
                visibilityTime: 3000,
            });

            router.push('/(app)/(tabs)/manage/attractions');
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo crear la atracción. Intenta de nuevo.',
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
