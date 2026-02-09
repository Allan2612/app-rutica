import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useProduct, useUpdateProduct } from './useBusinessProducts';

interface ProductFormErrors {
  name?: string;
  price?: string;
  categories?: string;
}

export function useEditProductForm(businessId: string, productId: string) {
  const router = useRouter();
  const { data: product, isLoading: isLoadingProduct, error: loadError } = useProduct(productId);
  const updateMutation = useUpdateProduct(businessId, productId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('CRC');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<ProductFormErrors>({});

  // Cargar datos del producto cuando se obtienen
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(product.price?.toString() || '');
      setCurrency(product.currency || 'CRC');
      setSelectedCategoryIds(product.categoryIds || []);
      setImages(product.images || []);
      setIsActive(product.isActive ?? true);
    }
  }, [product]);

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
      await updateMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        price: parseFloat(price),
        currency,
        categoryIds: selectedCategoryIds,
        images,
        isActive,
      });

      Toast.show({
        type: 'success',
        text1: 'Producto actualizado',
        text2: `"${name}" ha sido modificado correctamente`,
        position: 'top',
        visibilityTime: 3000,
      });

      router.back();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar producto',
        text2: 'No se pudo actualizar el producto. Intenta de nuevo.',
        position: 'top',
        visibilityTime: 4000,
      });
    }
  }, [
    validateForm,
    updateMutation,
    name,
    description,
    price,
    currency,
    selectedCategoryIds,
    images,
    isActive,
    router,
  ]);

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
      isActive,
      errors,
    },
    formActions: {
      setName,
      setDescription,
      setPrice,
      setCurrency,
      setSelectedCategoryIds,
      setImages,
      setIsActive,
    },
    handlers: {
      handleSubmit,
      handleCancel,
    },
    isLoading: isLoadingProduct,
    isSubmitting: updateMutation.isPending,
    loadError,
  };
}
