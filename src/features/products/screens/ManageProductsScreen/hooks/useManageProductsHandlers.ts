import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useDeleteProduct } from '@/features/products/hooks';

interface DeleteDialogState {
    id: string;
    name: string;
}

interface UseManageProductsHandlersProps {
    businessId: string;
    canAddProduct: boolean;
    invalidateQuota: () => void;
}

export function useManageProductsHandlers({
    businessId,
    canAddProduct,
    invalidateQuota
}: UseManageProductsHandlersProps) {
    const router = useRouter();
    const deleteMutation = useDeleteProduct(businessId);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState | null>(null);
    const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);

    const handleAddProduct = useCallback(() => {
        if (!canAddProduct) {
            Toast.show({
                type: 'info',
                text1: 'Límite alcanzado',
                text2: 'Adquiere un paquete de productos para añadir más.',
                position: 'top',
                visibilityTime: 4000,
            });
            return;
        }
        router.push(`/(app)/(tabs)/manage/businesses/${businessId}/products/add`);
    }, [router, businessId, canAddProduct]);

    const handleBuyPackage = useCallback(() => {
        setIsPremiumModalVisible(true);
    }, []);

    const handleClosePremiumModal = useCallback(() => {
        setIsPremiumModalVisible(false);
    }, []);

    const handlePremiumSuccess = useCallback((planNames: string, planCount: number) => {
        invalidateQuota();
        Toast.show({
            type: 'success',
            text1: planCount > 1 ? '¡Planes Adquiridos con Éxito!' : '¡Plan Adquirido con Éxito!',
            text2: `${planNames} ${planCount > 1 ? 'han sido adquiridos' : 'ha sido adquirido'} correctamente.`,
            position: 'top',
            visibilityTime: 5000,
            topOffset: 50,
            autoHide: true,
        });
    }, [invalidateQuota]);

    const handleEditProduct = useCallback(
        (productId: string) => {
            router.push(`/(app)/(tabs)/manage/businesses/${businessId}/products/${productId}/edit`);
        },
        [router, businessId]
    );

    const handleDeleteProduct = useCallback(
        (productId: string, productName: string) => {
            setDeleteDialog({ id: productId, name: productName });
        },
        []
    );

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteDialog) return;

        try {
            setDeletingId(deleteDialog.id);
            await deleteMutation.mutateAsync(deleteDialog.id);
            Toast.show({
                type: 'success',
                text1: 'Producto eliminado',
                text2: `"${deleteDialog.name}" ha sido eliminado correctamente`,
                position: 'top',
                visibilityTime: 3000,
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error al eliminar',
                text2: 'No se pudo eliminar el producto. Intenta de nuevo.',
                position: 'top',
                visibilityTime: 4000,
            });
        } finally {
            setDeletingId(null);
            setDeleteDialog(null);
        }
    }, [deleteDialog, deleteMutation]);

    return {
        deletingId,
        deleteDialog,
        isPremiumModalVisible,
        setDeleteDialog,
        handleAddProduct,
        handleBuyPackage,
        handleClosePremiumModal,
        handlePremiumSuccess,
        handleEditProduct,
        handleDeleteProduct,
        handleConfirmDelete,
    };
}
