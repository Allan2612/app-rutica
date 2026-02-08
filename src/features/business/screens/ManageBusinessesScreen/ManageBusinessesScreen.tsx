import { memo, useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Plus, Store } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useThemedColors, useRefreshOnFocus } from '@/hooks';
import { useUserBusinesses, useDeleteBusiness } from '@/features/business/hooks/useUserBusinesses';
import { UserBusinessCard } from '@/components/business/UserBusinessCard';
import { ConfirmDeleteDialog } from '@/components/manage';
import { BackButton } from '@/components/ui';
import { styles } from './styles';

export const ManageBusinessesScreen = memo(function ManageBusinessesScreen() {
    const colors = useThemedColors();
    const router = useRouter();
    const { data: businesses = [] as any[], isLoading, refetch, error } = useUserBusinesses();
    const deleteMutation = useDeleteBusiness();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ id: string; name: string } | null>(null);

    // Refrescar datos cuando la pantalla recibe foco
    useRefreshOnFocus(refetch);

    const handleAddBusiness = useCallback(() => {
        router.push('/(app)/(tabs)/manage/businesses/add');
    }, [router]);

    const handleEditBusiness = useCallback(
        (businessId: string) => {
            router.push(`/(app)/(tabs)/manage/businesses/${businessId}/edit`);
        },
        [router]
    );

    const handleProducts = useCallback(
        (businessId: string, businessName: string) => {
            router.push({
                pathname: `/(app)/(tabs)/manage/businesses/${businessId}/products`,
                params: { name: businessName }
            });
        },
        [router]
    );

    const handleDeleteBusiness = useCallback(
        (businessId: string, businessName: string) => {
            setDeleteDialog({ id: businessId, name: businessName });
        },
        []
    );

    const handleConfirmDelete = useCallback(
        async () => {
            if (!deleteDialog) return;

            try {
                setDeletingId(deleteDialog.id);
                await deleteMutation.mutateAsync(deleteDialog.id);
                Toast.show({
                    type: 'success',
                    text1: 'Negocio eliminado',
                    text2: `"${deleteDialog.name}" ha sido eliminado correctamente`,
                    position: 'top',
                    visibilityTime: 3000,
                });
                setDeleteDialog(null);
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error al eliminar',
                    text2: 'No se pudo eliminar el negocio. Intenta de nuevo.',
                    position: 'top',
                    visibilityTime: 4000,
                });
            } finally {
                setDeletingId(null);
            }
        },
        [deleteDialog, deleteMutation]
    );

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[500]} />
                    <Text style={[styles.emptyDescription, { color: colors.text.secondary, marginTop: 16 }]}>
                        Cargando negocios...
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
                    <BackButton href="/(app)/(tabs)/manage" />
                    <View style={styles.headerContent}>
                        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                            Mis Negocios
                        </Text>
                        <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                            Administra tus negocios publicados. Puedes crear, editar y eliminar tus comercios.
                        </Text>
                    </View>
                </View>

                {/* Botón Agregar */}
                <Pressable
                    style={({ pressed }) => [
                        styles.addButton,
                        { backgroundColor: colors.primary[500], opacity: pressed ? 0.8 : 1 },
                    ]}
                    onPress={handleAddBusiness}
                >
                    <Plus color="#fff" size={20} strokeWidth={2.5} />
                    <Text style={[styles.addButtonText, { color: '#fff' }]}>Agregar Negocio</Text>
                </Pressable>

                {/* Lista */}
                {businesses.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View
                            style={[
                                styles.emptyIconWrapper,
                                { backgroundColor: colors.background.tertiary },
                            ]}
                        >
                            <Store color={colors.text.tertiary} size={40} strokeWidth={1.5} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                            No tienes negocios
                        </Text>
                        <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
                            Comienza agregando tu primer negocio para que los usuarios puedan encontrarte y
                            conocer tus productos o servicios.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.list}>
                        {businesses.map((business) => (
                            <UserBusinessCard
                                key={business.id}
                                name={business.name}
                                description={business.description}
                                categoryNames={business.categoryNames}
                                categoryIds={business.categoryIds}
                                locationLabel={business.locationLabel}
                                imageUrl={business.imageUrl}
                                logoUrl={business.logoUrl}
                                moderationStatus={business.moderationStatus}
                                isActive={business.isActive}
                                onProducts={() => handleProducts(business.id, business.name)}
                                onEdit={() => handleEditBusiness(business.id)}
                                onDelete={() => handleDeleteBusiness(business.id, business.name)}
                                isDeleting={deletingId === business.id}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            <ConfirmDeleteDialog
                visible={!!deleteDialog}
                entityName={deleteDialog?.name || ''}
                entityType="negocio"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteDialog(null)}
                isDeleting={!!deletingId}
            />
        </View>
    );
});
