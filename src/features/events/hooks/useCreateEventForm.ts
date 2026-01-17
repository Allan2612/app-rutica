import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useCategories } from '@/hooks/useCategories';
import { useCreateEvent } from './useCreateEvent';
import type { CreateEventData } from '../services/createEvent.service';

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
    startDate: Date;
    endDate: Date;
    isFree: boolean;
    price: string;
    capacity: string;
    phone: string;
    email: string;
    website: string;
    ticketUrl: string;
    facebook: string;
    instagram: string;
    tiktok: string;
}

interface FormErrors {
    name?: string;
    categories?: string;
    location?: string;
    endDate?: string;
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
    startDate: new Date(),
    endDate: new Date(Date.now() + 86400000), // +1 día
    isFree: true,
    price: '',
    capacity: '',
    phone: '',
    email: '',
    website: '',
    ticketUrl: '',
    facebook: '',
    instagram: '',
    tiktok: '',
};

export function useCreateEventForm() {
    const router = useRouter();
    const { data: categories = [], isLoading: loadingCategories } = useCategories();
    const createMutation = useCreateEvent();

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});

    const hasChanges = useMemo(() => {
        return JSON.stringify(formData) !== JSON.stringify(initialFormData);
    }, [formData]);

    const updateField = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (field === 'isFree' && value === true) {
            setFormData((prev) => ({ ...prev, price: '' }));
        }
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    }, [errors]);

    const handleLocationSelect = useCallback((location: any) => {
        setFormData((prev) => ({
            ...prev,
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
        }

        if (formData.startDate >= formData.endDate) {
            newErrors.endDate = 'La fecha de fin debe ser posterior a la de inicio';
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
            const data: CreateEventData = {
                name: formData.name.trim(),
                description: formData.description.trim() || undefined,
                categoryIds: formData.selectedCategoryIds,
                startDate: formData.startDate,
                endDate: formData.endDate,
                isFree: formData.isFree,
                price: !formData.isFree && formData.price ? parseFloat(formData.price) : undefined,
                currency: !formData.isFree && formData.price ? 'CRC' : undefined,
                capacity: formData.capacity ? parseInt(formData.capacity, 10) : undefined,
                province: formData.province ?? undefined,
                canton: formData.canton ?? undefined,
                district: formData.district ?? undefined,
                address: formData.address?.trim() ?? undefined,
                latitude: formData.coordinates!.latitude,
                longitude: formData.coordinates!.longitude,
                phone: formData.phone.trim() || undefined,
                email: formData.email.trim() || undefined,
                website: formData.website.trim() || undefined,
                ticketUrl: formData.ticketUrl.trim() || undefined,
                facebook: formData.facebook.trim() || undefined,
                instagram: formData.instagram.trim() || undefined,
                tiktok: formData.tiktok.trim() || undefined,
                coverUri: formData.coverUri,
                galleryUris: formData.galleryUris,
            };

            await createMutation.mutateAsync(data);
            Toast.show({
                type: 'success',
                text1: '¡Evento creado!',
                text2: 'Tu evento ha sido creado exitosamente',
                position: 'top',
                visibilityTime: 2000,
            });

            setTimeout(() => {
                router.replace('/(app)/(tabs)/manage/events');
            }, 500);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error al crear el evento',
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
