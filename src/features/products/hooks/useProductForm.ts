import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/store/authStore';
import { useProductQuota } from '@/hooks/useResourceQuota';
import { incrementUsage } from '@/services/subscriptionQuota.service';
import { useCreateProduct } from './useBusinessProducts';

interface ProductFormErrors {
    name?: string;
    price?: string;
    categories?: string;
}

export function useProductForm(businessId: string) {
    const router = useRouter();
    const { user } = useAuthStore();
    const createMutation = useCreateProduct(businessId);
    const { quotaInfo, invalidateQuota } = useProductQuota(businessId);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('CRC');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [errors, setErrors] = useState<ProductFormErrors>({});

    const validateForm = useCallback(() => {
        const newErrors: ProductFormErrors = {};

        if (!name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!price.trim()) {
            newErrors.price = 'El precio es requerido';
        } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            newErrors.price = 'Ingresa un precio válido mayor a 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [name, price]);

    const handleSubmit = useCallback(async () => {
        if (!validateForm()) {
            Toast.show({
                type: 'error',
                text1: 'Formulario incompleto',
                text2: 'Por favor completa todos los campos requeridos',
                position: 'top',
                visibilityTime: 3000,
            });
            return;
        }

        // Verificar cuota ANTES de crear
        if (!quotaInfo?.canAdd) {
            Toast.show({
                type: 'info',
                text1: 'Límite alcanzado',
                text2: quotaInfo?.hasPremium
                    ? 'Has usado toda tu cuota. Adquiere otro paquete para continuar.'
                    : `Has alcanzado el límite de ${quotaInfo?.freeQuota} productos gratuitos. Adquiere un paquete para añadir más.`,
                position: 'top',
                visibilityTime: 5000,
            });
            return;
        }

        try {
            await createMutation.mutateAsync({
                name: name.trim(),
                description: description.trim() || undefined,
                price: parseFloat(price),
                currency,
                categoryIds: selectedCategoryIds,
                images,
            });

            // Incrementar el contador de uso SOLO si está usando cuota premium
            if (user?.id && quotaInfo?.hasPremium && quotaInfo.usedCount >= quotaInfo.freeQuota) {
                try {
                    await incrementUsage(user.id, 'product', businessId, 'business');
                    console.log('✅ Usage incremented successfully');
                } catch (usageError: any) {
                    console.error('❌ Error incrementing usage:', usageError);
                    console.error('Error details:', JSON.stringify(usageError, null, 2));
                    // Mostrar advertencia específica
                    Toast.show({
                        type: 'warning',
                        text1: 'Advertencia',
                        text2: usageError.message || 'No se pudo actualizar el contador de uso premium.',
                        position: 'top',
                        visibilityTime: 5000,
                    });
                }
            }

            // Invalidar query de cuota para refrescar el contador
            invalidateQuota();

            Toast.show({
                type: 'success',
                text1: 'Producto creado',
                text2: `"${name}" ha sido agregado correctamente`,
                position: 'top',
                visibilityTime: 3000,
            });

            router.back();
        } catch (error) {
            console.error('Error creating product:', error);
            Toast.show({
                type: 'error',
                text1: 'Error al crear producto',
                text2: 'No se pudo crear el producto. Intenta de nuevo.',
                position: 'top',
                visibilityTime: 4000,
            });
        }
    }, [validateForm, createMutation, name, description, price, currency, selectedCategoryIds, images, router, quotaInfo, user, businessId, invalidateQuota]);

    const handleCancel = useCallback(() => {
        router.back();
    }, [router]);

    return {
        formState: {
            name,
            description,
            price,
            currency,
            selectedCategoryIds,
            images,
            errors,
        },
        formActions: {
            setName,
            setDescription,
            setPrice,
            setCurrency,
            setSelectedCategoryIds,
            setImages,
        },
        handlers: {
            handleSubmit,
            handleCancel,
        },
        isSubmitting: createMutation.isPending,
    };
}
