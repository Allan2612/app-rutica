import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useCategories } from '@/hooks/useCategories';
import { useCreateEvent } from './useCreateEvent';
import { useEventById, useUpdateEvent } from './useUpdateEvent';
import type { CreateEventData } from '../services/createEvent.service';
import type { UpdateEventData } from '../services/updateEvent.service';

interface FormErrors {
    name?: string;
    categories?: string;
    location?: string;
    dates?: string;
    pricing?: string;
}

interface FormData {
    name: string;
    description: string;
    selectedCategoryIds: string[];
    coverUri: string | null;
    galleryUris: string[];
    districtId: string | null;
    address: string | null;
    coordinates: { latitude: number; longitude: number } | null;
    startDate: Date;
    endDate: Date;
    isFree: boolean;
    price: string;
    currency: string;
    capacity: string;
    phone: string;
    email: string;
    website: string;
    ticketUrl: string;
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
    districtId: null,
    address: null,
    coordinates: null,
    startDate: new Date(),
    endDate: new Date(Date.now() + 3600000), // 1 hora después
    isFree: true,
    price: '',
    currency: 'CRC',
    capacity: '',
    phone: '',
    email: '',
    website: '',
    ticketUrl: '',
    facebook: '',
    instagram: '',
    tiktok: '',
};

export function useEventForm(eventId?: string) {
    const router = useRouter();
    const { data: categories = [], isLoading: loadingCategories } = useCategories();
    const { data: event, isLoading: loadingEvent } = useEventById(eventId || '');
    const createMutation = useCreateEvent();
    const updateMutation = useUpdateEvent();

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [originalData, setOriginalData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Detectar si hay cambios en el formulario
    const hasChanges = useMemo(() => {
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    }, [formData, originalData]);

    // Cargar datos del evento cuando estemos en modo edición
    useEffect(() => {
        if (event && eventId) {
            const loadedData = {
                name: event.name,
                description: event.description || '',
                selectedCategoryIds: event.categoryIds,
                coverUri: event.coverUrl,
                galleryUris: event.galleryUrls,
                districtId: event.districtId,
                address: event.address,
                coordinates: event.latitude && event.longitude ? {
                    latitude: event.latitude,
                    longitude: event.longitude,
                } : null,
                startDate: event.startDate,
                endDate: event.endDate,
                isFree: event.isFree,
                price: event.price?.toString() || '',
                currency: event.currency || 'CRC',
                capacity: event.capacity?.toString() || '',
                phone: event.phone || '',
                email: event.email || '',
                website: event.website || '',
                ticketUrl: event.ticketUrl || '',
                facebook: event.facebook || '',
                instagram: event.instagram || '',
                tiktok: event.tiktok || '',
            };
            setFormData(loadedData);
            setOriginalData(loadedData);
        }
    }, [event, eventId]);

    const updateField = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    }, [errors]);

    const handleLocationSelect = useCallback((locationData: {
        latitude?: number;
        longitude?: number;
    }) => {
        // Solo guardar coordenadas, la validación se hace al guardar
        setFormData((prev) => ({
            ...prev,
            coordinates: locationData.latitude && locationData.longitude ? {
                latitude: locationData.latitude,
                longitude: locationData.longitude,
            } : null,
        }));
        if (errors.location) {
            setErrors((prev) => ({ ...prev, location: undefined }));
        }
    }, [errors.location]);

    const handleDatesChange = useCallback((startDate: Date, endDate: Date) => {
        setFormData((prev) => ({ ...prev, startDate, endDate }));
        if (errors.dates) {
            setErrors((prev) => ({ ...prev, dates: undefined }));
        }
    }, [errors.dates]);

    const handlePricingChange = useCallback((isFree: boolean, price?: string, currency?: string) => {
        setFormData((prev) => ({
            ...prev,
            isFree,
            price: price || '',
            currency: currency || 'CRC',
        }));
        if (errors.pricing) {
            setErrors((prev) => ({ ...prev, pricing: undefined }));
        }
    }, [errors.pricing]);

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

        if (formData.startDate >= formData.endDate) {
            newErrors.dates = 'La fecha de inicio debe ser anterior a la fecha de fin';
        }

        if (!formData.isFree && (!formData.price || parseFloat(formData.price) <= 0)) {
            newErrors.pricing = 'El precio debe ser mayor a 0';
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
            const eventData: CreateEventData = {
                name: formData.name,
                description: formData.description || undefined,
                categoryIds: formData.selectedCategoryIds,
                coverUri: formData.coverUri,
                galleryUris: formData.galleryUris,
                districtId: formData.districtId!,
                address: formData.address ?? undefined,
                latitude: formData.coordinates!.latitude,
                longitude: formData.coordinates!.longitude,
                startDate: formData.startDate,
                endDate: formData.endDate,
                isFree: formData.isFree,
                price: formData.isFree ? undefined : (formData.price ? parseFloat(formData.price) : undefined),
                currency: formData.isFree ? undefined : formData.currency,
                capacity: formData.capacity ? parseInt(formData.capacity, 10) : undefined,
                phone: formData.phone || undefined,
                email: formData.email || undefined,
                website: formData.website || undefined,
                ticketUrl: formData.ticketUrl || undefined,
                facebook: formData.facebook || undefined,
                instagram: formData.instagram || undefined,
                tiktok: formData.tiktok || undefined,
            };

            if (eventId) {
                // Para actualización, necesitamos convertir a UpdateEventData
                const updateData: UpdateEventData = {
                    name: formData.name,
                    description: formData.description || null,
                    categoryIds: formData.selectedCategoryIds,
                    districtId: formData.districtId!,
                    address: formData.address,
                    latitude: formData.coordinates!.latitude,
                    longitude: formData.coordinates!.longitude,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    isFree: formData.isFree,
                    price: formData.isFree ? null : (formData.price ? parseFloat(formData.price) : null),
                    currency: formData.isFree ? null : formData.currency,
                    capacity: formData.capacity ? parseInt(formData.capacity, 10) : null,
                    phone: formData.phone || null,
                    email: formData.email || null,
                    website: formData.website || null,
                    ticketUrl: formData.ticketUrl || null,
                    facebook: formData.facebook || null,
                    instagram: formData.instagram || null,
                    tiktok: formData.tiktok || null,
                    coverImage: formData.coverUri,
                    galleryImages: formData.galleryUris,
                };
                await updateMutation.mutateAsync({ eventId, data: updateData });
            } else {
                await createMutation.mutateAsync(eventData);
            }

            router.push('/(app)/(tabs)/manage/events');
        } catch (error) {
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, eventId, createMutation, updateMutation, router]);

    return {
        categories,
        event,
        loadingCategories,
        loadingEvent,
        formData,
        errors,
        updateField,
        handleSubmit,
        handleLocationSelect,
        handleDatesChange,
        handlePricingChange,
        isSubmitting,
        hasChanges,
        router,
    };
}
