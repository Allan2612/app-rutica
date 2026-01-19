import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useCategories } from '@/hooks/useCategories';
import { useCreateAttraction } from './useCreateAttraction';
import { useAttractionById, useUpdateAttraction } from './useUpdateAttraction';
import type { CreateAttractionData } from '../services/createAttraction.service';

interface FormErrors {
    name?: string;
    categories?: string;
    location?: string;
}

interface FormData {
    name: string;
    description: string;
    selectedCategoryIds: string[];
    coverUri: string | null;
    galleryUris: string[];
    province: string | null;
    canton: string | null;
    district: string | null;
    address: string | null;
    coordinates: { latitude: number; longitude: number } | null;
    phone: string;
    email: string;
    website: string;
    facebook: string;
    instagram: string;
    tiktok: string;
}

const initialFormData: FormData = {
    name: '',
    description: '',
    selectedCategoryIds: [],
    coverUri: null,
    galleryUris: [],
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

export function useAttractionForm(attractionId?: string) {
    const router = useRouter();
    const { data: categories = [], isLoading: loadingCategories } = useCategories();
    const { data: attraction, isLoading: loadingAttraction } = useAttractionById(attractionId || '');
    const createMutation = useCreateAttraction();
    const updateMutation = useUpdateAttraction();

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [originalData, setOriginalData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Detectar si hay cambios en el formulario
    const hasChanges = useMemo(() => {
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    }, [formData, originalData]);

    // Cargar datos de la atracción cuando estemos en modo edición
    useEffect(() => {
        if (attraction && attractionId) {
            const loadedData: FormData = {
                name: attraction.name,
                description: attraction.description || '',
                selectedCategoryIds: attraction.categoryIds,
                coverUri: attraction.coverUrl,
                galleryUris: attraction.galleryUrls,
                province: attraction.province,
                canton: attraction.canton,
                district: attraction.district,
                address: attraction.address,
                coordinates: {
                    latitude: attraction.latitude,
                    longitude: attraction.longitude,
                },
                phone: '',
                email: '',
                website: '',
                facebook: '',
                instagram: '',
                tiktok: '',
            };
            setFormData(loadedData);
            setOriginalData(loadedData);
        }
    }, [attraction, attractionId]);

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
        (locationData: {
            latitude?: number;
            longitude?: number;
        }) => {
            // Solo guardar coordenadas, la validación se hace al guardar
            setFormData((prev) => ({
                ...prev,
                coordinates:
                    locationData.latitude && locationData.longitude
                        ? {
                              latitude: locationData.latitude,
                              longitude: locationData.longitude,
                          }
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
            newErrors.name = 'El nombre es requerido';
        }

        if (formData.selectedCategoryIds.length === 0) {
            newErrors.categories = 'Selecciona al menos una categoría';
        }

        if (!formData.coordinates) {
            newErrors.location = 'Selecciona una ubicación';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = useCallback(async () => {
        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const attractionData: CreateAttractionData = {
                name: formData.name,
                description: formData.description || null,
                categoryIds: formData.selectedCategoryIds,
                coverUri: formData.coverUri,
                galleryUris: formData.galleryUris,
                province: formData.province,
                canton: formData.canton,
                district: formData.district,
                address: formData.address,
                latitude: formData.coordinates!.latitude,
                longitude: formData.coordinates!.longitude,
            };

            if (attractionId) {
                // Para actualización, necesitamos convertir a UpdateAttractionData
                const updateData = {
                    name: formData.name,
                    description: formData.description || null,
                    categoryIds: formData.selectedCategoryIds,
                    province: formData.province,
                    canton: formData.canton,
                    district: formData.district,
                    address: formData.address,
                    latitude: formData.coordinates!.latitude,
                    longitude: formData.coordinates!.longitude,
                    coverImage: formData.coverUri,
                    galleryImages: formData.galleryUris,
                };
                await updateMutation.mutateAsync({ attractionId, data: updateData });
            } else {
                await createMutation.mutateAsync(attractionData);
            }

            router.push('/(app)/(tabs)/manage/attractions');
        } catch (error) {
            // Error silencioso - ya manejado por el mutation
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, attractionId, createMutation, updateMutation, router]);

    return {
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
        router,
    };
}
