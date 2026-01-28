import { memo, useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Plus, Tag, AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useThemedColors } from '@/hooks';
import { useUserPromotions, useDeletePromotion } from '@/features/promotions/hooks';
import { UserPromotionCard } from '@/components/promotions';
import { ConfirmDeleteDialog } from '@/components/manage';
import { BackButton } from '@/components/ui';
import { styles } from './styles';

export const ManagePromotionsScreen = memo(function ManagePromotionsScreen() {
  const colors = useThemedColors();
  const router = useRouter();
  const { data: promotions = [], isLoading, error } = useUserPromotions();
  const deleteMutation = useDeletePromotion();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ id: string; title: string } | null>(
    null
  );

  const handleAddPromotion = useCallback(() => {
    router.push('/(app)/(tabs)/manage/promotions/create');
  }, [router]);

  const handleEditPromotion = useCallback(
    (promotionId: string) => {
      router.push(`/(app)/(tabs)/manage/promotions/${promotionId}/edit`);
    },
    [router]
  );

  const handleDeletePromotion = useCallback((promotionId: string, title: string) => {
    setDeleteDialog({ id: promotionId, title });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteDialog) return;

    try {
      setDeletingId(deleteDialog.id);
      await deleteMutation.mutateAsync(deleteDialog.id);
      Toast.show({
        type: 'success',
        text1: 'Promoción eliminada',
        text2: `"${deleteDialog.title}" ha sido eliminada correctamente`,
        position: 'top',
        visibilityTime: 3000,
      });
      setDeleteDialog(null);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al eliminar',
        text2: 'No se pudo eliminar la promoción. Intenta de nuevo.',
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
          <Text
            style={[styles.emptyDescription, { color: colors.text.secondary, marginTop: 16 }]}
          >
            Cargando promociones...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
        <View style={styles.errorContainer}>
          <AlertCircle size={40} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.text.primary }]}>
            Error al cargar promociones
          </Text>
          <Text style={[styles.errorSubtext, { color: colors.text.secondary }]}>
            {error.message}
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
              Mis Promociones
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
              Administra tus promociones activas. Puedes crear nuevas promociones o eliminar
              las existentes.
            </Text>
          </View>
        </View>

        {/* Botón Agregar */}
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: colors.primary[500], opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={handleAddPromotion}
        >
          <Plus color="#fff" size={20} strokeWidth={2.5} />
          <Text style={[styles.addButtonText, { color: '#fff' }]}>Nueva Promoción</Text>
        </Pressable>

        {/* Lista */}
        {promotions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIconWrapper,
                { backgroundColor: colors.background.tertiary },
              ]}
            >
              <Tag color={colors.text.tertiary} size={40} strokeWidth={1.5} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
              No tienes promociones
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
              Crea tu primera promoción para destacar tus productos y atraer más clientes.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {promotions.map((promotion: any) => (
              <UserPromotionCard
                key={promotion.id}
                title={promotion.title}
                description={promotion.description}
                scope={promotion.scope}
                discountType={promotion.discountType}
                discountValue={promotion.discountValue}
                comboItems={promotion.comboItems}
                startAt={promotion.startAt}
                endAt={promotion.endAt}
                businessName={promotion.businessName}
                imageUrl={promotion.imageUrl}
                moderationStatus={promotion.moderationStatus}
                paymentState={promotion.paymentState}
                onEdit={() => handleEditPromotion(promotion.id)}
                onDelete={() => handleDeletePromotion(promotion.id, promotion.title)}
                isDeleting={deletingId === promotion.id}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <ConfirmDeleteDialog
        visible={!!deleteDialog}
        entityName={deleteDialog?.title || ''}
        entityType="promoción"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialog(null)}
        isDeleting={!!deletingId}
      />
    </View>
  );
});
