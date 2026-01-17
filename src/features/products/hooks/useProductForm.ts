import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useCreateProduct } from './useBusinessProducts';

interface ProductFormErrors {
    name?: string;
    price?: string;
    categories?: string;
}

export function useProductForm(businessId: string) {
    const router = useRouter();
    const createMutation = useCreateProduct(businessId);

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

        try {
            await createMutation.mutateAsync({
                name: name.trim(),
                description: description.trim() || undefined,
                price: parseFloat(price),
                currency,
                categoryIds: selectedCategoryIds,
                images,
            });

            Toast.show({
                type: 'success',
                text1: 'Producto creado',
                text2: `"${name}" ha sido agregado correctamente`,
                position: 'top',
                visibilityTime: 3000,
            });

            router.back();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error al crear producto',
                text2: 'No se pudo crear el producto. Intenta de nuevo.',
                position: 'top',
                visibilityTime: 4000,
            });
        }
    }, [validateForm, createMutation, name, description, price, currency, selectedCategoryIds, images, router]);

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
