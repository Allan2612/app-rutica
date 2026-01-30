import { memo, useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useThemedColors } from '@/hooks';
import { useBusinessProducts, useDeleteProduct } from '@/features/products/hooks';
import { ConfirmDeleteDialog } from '@/components/manage';
import { BackButton } from '@/components/ui';
import { UserProductCard } from '@/components/manage';
import { styles } from './styles';

interface DeleteDialogState {
    id: string;
    name: string;
}

export const ManageProductsScreen = memo(function ManageProductsScreen() {
    const colors = useThemedColors();
    const router = useRouter();
    const { id: businessId } = useLocalSearchParams<{ id: string }>();

    const { data: products = [], isLoading } = useBusinessProducts(businessId || '');
    const deleteMutation = useDeleteProduct(businessId || '');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState | null>(null);

    const handleAddProduct = useCallback(() => {
        router.push(`/(app)/(tabs)/manage/businesses/${businessId}/products/add`);
    }, [router, businessId]);

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

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[500]} />
                    <Text style={[styles.emptyDescription, { color: colors.text.secondary, marginTop: 16 }]}>
                        Cargando productos...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
                    <BackButton />
                    <View style={styles.headerContent}>
                        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                            Mis Productos
                        </Text>
                        <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                            Administra los productos de tu negocio. Puedes crear, editar y eliminar productos.
                        </Text>
                    </View>
                </View>

                {/* Add Button */}
                <Pressable
                    style={({ pressed }) => [
                        styles.addButton,
                        { backgroundColor: colors.primary[500], opacity: pressed ? 0.8 : 1 },
                    ]}
                    onPress={handleAddProduct}
                >
                    <Plus color="#fff" size={20} strokeWidth={2.5} />
                    <Text style={[styles.addButtonText, { color: '#fff' }]}>Agregar Producto</Text>
                </Pressable>

                {/* Products List */}
                {products.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                            No tienes productos
                        </Text>
                        <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
                            Comienza agregando tu primer producto para que los usuarios puedan ver lo que ofreces.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.list}>
                        {products.map((product) => (
                            <UserProductCard
                                key={product.id}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                currency={product.currency}
                                categoryNames={product.categoryNames}
                                categoryIds={product.categoryIds}
                                imageUrl={product.mainImageUrl}
                                isActive={product.isActive}
                                onEdit={() => handleEditProduct(product.id)}
                                onDelete={() => handleDeleteProduct(product.id, product.name)}
                                isDeleting={deletingId === product.id}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            <ConfirmDeleteDialog
                visible={!!deleteDialog}
                entityName={deleteDialog?.name || ''}
                entityType="producto"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteDialog(null)}
                isDeleting={!!deletingId}
            />
        </View>
    );
});
