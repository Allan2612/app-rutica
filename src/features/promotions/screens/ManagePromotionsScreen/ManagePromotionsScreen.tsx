import { memo, useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Plus, Tag, AlertCircle, Crown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useThemedColors, useRefreshOnFocus } from '@/hooks';
import { useUserPromotions, useDeletePromotion } from '@/features/promotions/hooks';
import { useUserBusinesses } from '@/features/business/hooks';
import { useProfile } from '@/features/user/hooks';
import { UserPromotionCard } from '@/components/promotions';
import { ConfirmDeleteDialog } from '@/components/manage';
import { PremiumModal } from '@/components/user';
import { BackButton } from '@/components/ui';
import { DEFAULT_RESOURCE_LIMITS } from '@/types/entities/subscription';
import { styles } from './styles';

export const ManagePromotionsScreen = memo(function ManagePromotionsScreen() {
  const colors = useThemedColors();
  const router = useRouter();
  const { data: promotions = [], isLoading, error, refetch } = useUserPromotions();
  const { data: businesses = [], isLoading: isLoadingBusinesses, refetch: refetchBusinesses } = useUserBusinesses();
  const { profile } = useProfile();
  const deleteMutation = useDeletePromotion();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ id: string; title: string } | null>(
    null
  );
  const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);

  // Refrescar datos cuando la pantalla recibe foco
  useRefreshOnFocus(refetch);
  useRefreshOnFocus(refetchBusinesses);

  // Límite gratuito de promociones por negocio
  const FREE_LIMIT = DEFAULT_RESOURCE_LIMITS.promotion.freeLimit;

  // Agrupar promociones por negocio y calcular cuotas
  const quotaByBusiness = useMemo(() => {
    const quotaMap: Record<string, { businessId: string; businessName: string; count: number; limit: number }> = {};

    // Inicializar todos los negocios con count 0
    businesses.forEach((business: any) => {
      quotaMap[business.id] = {
        businessId: business.id,
        businessName: business.name,
        count: 0,
        limit: FREE_LIMIT,
      };
    });

    // Contar promociones por negocio
    promotions.forEach((promo: any) => {
      if (promo.businessId && quotaMap[promo.businessId]) {
        quotaMap[promo.businessId].count++;
      }
    });

    return Object.values(quotaMap);
  }, [businesses, promotions, FREE_LIMIT]);

  // Verificar si TODOS los negocios tienen cuota llena
  const allBusinessesAtLimit = useMemo(() => {
    if (businesses.length === 0) return false;
    return quotaByBusiness.every(q => q.count >= q.limit);
  }, [quotaByBusiness, businesses.length]);

  // Para un solo negocio, mostrar info específica
  const singleBusinessQuota = businesses.length === 1 ? quotaByBusiness[0] : null;

  const handleOpenPremiumModal = useCallback(() => {
    setIsPremiumModalVisible(true);
  }, []);

  const handleClosePremiumModal = useCallback(() => {
    setIsPremiumModalVisible(false);
  }, []);

  const handlePremiumSuccess = useCallback(() => {
    setIsPremiumModalVisible(false);
  }, []);

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

  if (isLoading || isLoadingBusinesses) {
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

        {/* Información de cuota para un solo negocio */}
        {singleBusinessQuota && (
          <View style={{
            marginBottom: 12,
            padding: 12,
            backgroundColor: colors.background.tertiary,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Tag size={16} color={colors.text.secondary} />
              <Text style={{
                marginLeft: 8,
                fontSize: 14,
                color: colors.text.secondary,
              }}>
                Promociones: {singleBusinessQuota.count}/{singleBusinessQuota.limit} gratuitas usadas
              </Text>
            </View>
          </View>
        )}

        {/* Banner de límite alcanzado */}
        {allBusinessesAtLimit && (
          <View style={{
            marginBottom: 16,
            backgroundColor: colors.warning + '15',
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.warning + '40',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <AlertCircle size={20} color={colors.warning} />
              <Text style={{
                fontSize: 15,
                fontWeight: '600',
                color: colors.warning,
                marginLeft: 8,
              }}>
                Has alcanzado tu límite de promociones
              </Text>
            </View>
            <Text style={{
              fontSize: 14,
              color: colors.text.secondary,
              marginBottom: 12,
              lineHeight: 20,
            }}>
              Ya usaste tus {FREE_LIMIT} promociones gratuitas.
              Adquiere el paquete Promociones para agregar hasta 10 promociones adicionales.
            </Text>
            <Pressable
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 12,
                borderRadius: 8,
                backgroundColor: colors.primary[500],
                opacity: pressed ? 0.8 : 1,
              })}
              onPress={handleOpenPremiumModal}
            >
              <Crown size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '600', marginLeft: 8 }}>
                Comprar Paquete Promociones
              </Text>
            </Pressable>
          </View>
        )}

        {/* Botón Agregar */}
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            {
              backgroundColor: allBusinessesAtLimit ? colors.text.tertiary : colors.primary[500],
              opacity: pressed && !allBusinessesAtLimit ? 0.8 : 1
            },
          ]}
          onPress={allBusinessesAtLimit ? undefined : handleAddPromotion}
          disabled={allBusinessesAtLimit}
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
                moderationNote={promotion.moderationNote}
                isActive={promotion.isActive ?? true}
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

      <PremiumModal
        visible={isPremiumModalVisible}
        onClose={handleClosePremiumModal}
        onSuccess={handlePremiumSuccess}
        userRole={profile?.role_prf || null}
        initialPlan="promotions"
        preSelectedBusinessId={singleBusinessQuota?.businessId}
        preSelectedBusinessName={singleBusinessQuota?.businessName}
      />
    </View>
  );
});
