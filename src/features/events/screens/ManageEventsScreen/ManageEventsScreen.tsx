import { memo, useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Plus, CalendarDays } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useThemedColors } from '@/hooks';
import { useUserEvents, useDeleteEvent } from '@/features/events/hooks';
import { UserEventCard } from '@/components/events';
import { ConfirmDeleteDialog } from '@/components/manage';
import { BackButton } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import { styles } from './styles';

function getImageUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

export const ManageEventsScreen = memo(function ManageEventsScreen() {
    const colors = useThemedColors();
    const router = useRouter();
    const { data: events = [], isLoading } = useUserEvents();
    const deleteMutation = useDeleteEvent();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ id: string; name: string } | null>(null);

    const handleAddEvent = useCallback(() => {
        router.push('/(app)/(tabs)/manage/events/add');
    }, [router]);

    const handleEditEvent = useCallback((eventId: string) => {
        router.push(`/(app)/(tabs)/manage/events/${eventId}/edit`);
    }, [router]);

    const handleDeleteEvent = useCallback(
        (eventId: string, eventName: string) => {
            setDeleteDialog({ id: eventId, name: eventName });
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
                    text1: 'Evento eliminado',
                    text2: `"${deleteDialog.name}" ha sido eliminado correctamente`,
                    position: 'top',
                    visibilityTime: 3000,
                });
                setDeleteDialog(null);
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error al eliminar',
                    text2: 'No se pudo eliminar el evento. Intenta de nuevo.',
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
                        Cargando eventos...
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
                            Mis Eventos
                        </Text>
                        <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                            Administra tus eventos publicados. Puedes crear, editar y eliminar tus eventos.
                        </Text>
                    </View>
                </View>

                {/* Botón Agregar */}
                <Pressable
                    style={({ pressed }) => [
                        styles.addButton,
                        { backgroundColor: colors.primary[500], opacity: pressed ? 0.8 : 1 },
                    ]}
                    onPress={handleAddEvent}
                >
                    <Plus color="#fff" size={20} strokeWidth={2.5} />
                    <Text style={[styles.addButtonText, { color: '#fff' }]}>Agregar Evento</Text>
                </Pressable>

                {/* Lista */}
                {events.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View
                            style={[
                                styles.emptyIconWrapper,
                                { backgroundColor: colors.background.tertiary },
                            ]}
                        >
                            <CalendarDays color={colors.text.tertiary} size={40} strokeWidth={1.5} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                            No tienes eventos
                        </Text>
                        <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
                            Comienza agregando tu primer evento para que los usuarios puedan descubrir
                            lo que organizas.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.list}>
                        {events.map((event) => {
                            const sortedImages = [...(event.event_images ?? [])].sort(
                                (a, b) => (a?.sort_order_eim ?? 0) - (b?.sort_order_eim ?? 0)
                            );
                            const coverImage = sortedImages.find(img => img.sort_order_eim === 0);
                            const imageUrl = coverImage?.bucket_eim && coverImage?.path_eim
                                ? getImageUrl(coverImage.bucket_eim, coverImage.path_eim)
                                : null;

                            const location = event.locations?.[0];
                            const locationParts = [location?.canton_loc, location?.district_loc].filter(Boolean);
                            const locationLabel = locationParts.length > 0 ? locationParts.join(', ') : null;

                            const categoryNames = (event.event_category_map ?? [])
                                .map((ecm) => ecm.categories?.name_cat)
                                .filter((name): name is string => !!name);

                            const categoryIds = (event.event_category_map ?? [])
                                .map((ecm) => ecm.categories?.id_cat)
                                .filter((id): id is string => !!id);

                            return (
                                <UserEventCard
                                    key={event.id_evt}
                                    name={event.name_evt}
                                    description={event.description_evt}
                                    categoryNames={categoryNames}
                                    categoryIds={categoryIds}
                                    startDate={event.start_at_evt}
                                    endDate={event.end_at_evt}
                                    locationLabel={locationLabel}
                                    imageUrl={imageUrl}
                                    isFree={event.is_free_evt}
                                    price={event.price_evt}
                                    currency={event.currency_evt}
                                    capacity={event.capacity_evt}
                                    moderationStatus={event.moderation_status_evt as 'pending' | 'approved' | 'rejected'}
                                    isActive={event.is_active_evt}
                                    onEdit={() => handleEditEvent(event.id_evt)}
                                    onDelete={() => handleDeleteEvent(event.id_evt, event.name_evt)}
                                    isDeleting={deletingId === event.id_evt}
                                />
                            );
                        })}
                    </View>
                )}
            </ScrollView>

            <ConfirmDeleteDialog
                visible={!!deleteDialog}
                entityName={deleteDialog?.name || ''}
                entityType="evento"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteDialog(null)}
                isDeleting={!!deletingId}
            />
        </View>
    );
});
