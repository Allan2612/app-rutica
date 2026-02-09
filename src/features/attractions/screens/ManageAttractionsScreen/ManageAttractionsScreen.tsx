import { memo, useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Plus, Landmark } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useThemedColors, useRefreshOnFocus } from '@/hooks';
import { useUserAttractions, useDeleteAttraction } from '@/features/attractions/hooks';
import { UserAttractionCard } from '@/components/attractions';
import { ConfirmDeleteDialog } from '@/components/manage';
import { BackButton } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import { styles } from './styles';

const STORAGE_BUCKET = 'attractions-images';

function getImageUrl(path: string): string {
  if (!path) return '';
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export const ManageAttractionsScreen = memo(function ManageAttractionsScreen() {
  const colors = useThemedColors();
  const router = useRouter();
  const { data: attractions = [], isLoading, refetch } = useUserAttractions();
  const deleteMutation = useDeleteAttraction();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ id: string; name: string } | null>(null);

  // Refrescar datos cuando la pantalla recibe foco
  useRefreshOnFocus(refetch);

  const handleAddAttraction = useCallback(() => {
    router.push('/(app)/(tabs)/manage/attractions/add');
  }, [router]);

  const handleEditAttraction = useCallback(
    (attractionId: string) => {
      router.push(`/(app)/(tabs)/manage/attractions/${attractionId}/edit`);
    },
    [router],
  );

  const handleDeleteAttraction = useCallback((attractionId: string, attractionName: string) => {
    setDeleteDialog({ id: attractionId, name: attractionName });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteDialog) return;

    try {
      setDeletingId(deleteDialog.id);
      await deleteMutation.mutateAsync(deleteDialog.id);
      Toast.show({
        type: 'success',
        text1: 'Atracción eliminada',
        text2: `"${deleteDialog.name}" ha sido eliminada correctamente`,
        position: 'top',
        visibilityTime: 3000,
      });
      setDeleteDialog(null);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al eliminar',
        text2: 'No se pudo eliminar la atracción. Intenta de nuevo.',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setDeletingId(null);
    }
  }, [deleteDialog, deleteMutation]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={[styles.emptyDescription, { color: colors.text.secondary, marginTop: 16 }]}>
            Cargando atracciones...
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
              Mis Atracciones
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
              Administra tus atracciones publicadas. Puedes crear, editar y eliminar tus atracciones
              turísticas.
            </Text>
          </View>
        </View>

        {/* Botón Agregar */}
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: colors.primary[500], opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={handleAddAttraction}
        >
          <Plus color="#fff" size={20} strokeWidth={2.5} />
          <Text style={[styles.addButtonText, { color: '#fff' }]}>Agregar Atracción</Text>
        </Pressable>

        {/* Lista */}
        {attractions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View
              style={[styles.emptyIconWrapper, { backgroundColor: colors.background.tertiary }]}
            >
              <Landmark color={colors.text.tertiary} size={40} strokeWidth={1.5} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
              No tienes atracciones
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
              Comienza agregando tu primera atracción para que los usuarios puedan descubrir los
              lugares turísticos que compartes.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {attractions.map((attraction) => {
              const sortedImages = [...(attraction.attraction_images ?? [])].sort(
                (a, b) => (a?.sort_order_aim ?? 0) - (b?.sort_order_aim ?? 0),
              );
              const coverImage = sortedImages.find((img) => img.sort_order_aim === 0);
              // V3: Solo path_aim
              const imageUrl = coverImage?.path_aim ? getImageUrl(coverImage.path_aim) : null;

              // V3: Ubicación con jerarquía normalizada
              const location = attraction.locations;
              const districtData = location?.districts;
              const cantonData = districtData?.cantons;
              const locationParts = [cantonData?.name_ctn, districtData?.name_dst].filter(Boolean);
              const locationLabel = locationParts.length > 0 ? locationParts.join(', ') : null;

              const categoryNames = (attraction.attraction_category_map ?? [])
                .map((acm) => acm.categories?.name_cat)
                .filter((name): name is string => !!name);

              const categoryIds = (attraction.attraction_category_map ?? [])
                .map((acm) => acm.categories?.id_cat)
                .filter((id): id is string => !!id);

              return (
                <UserAttractionCard
                  key={attraction.id_atr}
                  name={attraction.name_atr}
                  description={attraction.description_atr}
                  categoryNames={categoryNames}
                  categoryIds={categoryIds}
                  locationLabel={locationLabel}
                  imageUrl={imageUrl}
                  moderationStatus={
                    attraction.moderation_status_atr as 'pending' | 'approved' | 'rejected'
                  }
                  moderationNote={attraction.moderation_note_atr}
                  isActive={attraction.is_active_atr}
                  onEdit={() => handleEditAttraction(attraction.id_atr)}
                  onDelete={() => handleDeleteAttraction(attraction.id_atr, attraction.name_atr)}
                  isDeleting={deletingId === attraction.id_atr}
                />
              );
            })}
          </View>
        )}
      </ScrollView>

      <ConfirmDeleteDialog
        visible={!!deleteDialog}
        entityName={deleteDialog?.name || ''}
        entityType="atracción"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialog(null)}
        isDeleting={!!deletingId}
      />
    </View>
  );
});
