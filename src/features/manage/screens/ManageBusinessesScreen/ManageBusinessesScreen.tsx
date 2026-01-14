import { memo, useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Plus, Store, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { useUserBusinesses, useDeleteBusiness } from '@/features/business/hooks/useUserBusinesses';
import { UserBusinessCard } from '@/components/business/UserBusinessCard';
import { styles } from './styles';

export const ManageBusinessesScreen = memo(function ManageBusinessesScreen() {
    const colors = useThemedColors();
    const router = useRouter();
    const { data: businesses = [] as any[], isLoading, refetch, error } = useUserBusinesses();
    const deleteMutation = useDeleteBusiness();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleAddBusiness = useCallback(() => {
        router.push('/(app)/(tabs)/manage/businesses/add');
    }, [router]);

    const handleEditBusiness = useCallback(
        (businessId: string) => {
            router.push(`/(app)/(tabs)/manage/businesses/${businessId}/edit`);
        },
        [router]
    );

    const handleDeleteBusiness = useCallback(
        (businessId: string, businessName: string) => {
            Alert.alert(
                'Eliminar negocio',
                `¿Estás seguro de eliminar "${businessName}"? Esta acción no se puede deshacer.`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Eliminar',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                setDeletingId(businessId);
                                await deleteMutation.mutateAsync(businessId);
                                Alert.alert('Éxito', 'Negocio eliminado correctamente');
                            } catch (error) {
                                Alert.alert('Error', 'No se pudo eliminar el negocio');
                                console.error(error);
                            } finally {
                                setDeletingId(null);
                            }
                        },
                    },
                ]
            );
        },
        [deleteMutation]
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
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                        Mis Negocios
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                        Administra tus negocios publicados. Puedes crear, editar y eliminar tus comercios.
                    </Text>

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
                </View>

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
                                onEdit={() => handleEditBusiness(business.id)}
                                onDelete={() => handleDeleteBusiness(business.id, business.name)}
                                isDeleting={deletingId === business.id}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
});
