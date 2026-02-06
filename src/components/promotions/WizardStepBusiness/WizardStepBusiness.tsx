import { memo, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Building2, Check, AlertCircle, Store, Star, Tag } from 'lucide-react-native';
import { useThemedColors, usePromotionQuota } from '@/hooks';
import { useUserBusinesses } from '@/features/business/hooks';
import { useProfile } from '@/features/user/hooks';
import { PremiumModal } from '@/components/user';
import { formSectionStyles } from '@/styles/form-section-styles';
import type { PromotionWizardFormData, PromotionWizardErrors } from '@/types/entities';
import { styles } from './styles';

interface WizardStepBusinessProps {
  formData: PromotionWizardFormData;
  errors: PromotionWizardErrors;
  onBusinessChange: (businessId: string) => void;
}

export const WizardStepBusiness = memo(function WizardStepBusiness({
  formData,
  errors,
  onBusinessChange,
}: WizardStepBusinessProps) {
  const colors = useThemedColors();
  const { data: businesses = [], isLoading } = useUserBusinesses();
  const { profile } = useProfile();
  const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);

  // Obtener cuota de promociones para el negocio seleccionado
  const { quotaInfo, invalidateQuota } = usePromotionQuota(
    formData.businessId || '',
    !!formData.businessId
  );

  const handleOpenPremiumModal = useCallback(() => {
    setIsPremiumModalVisible(true);
  }, []);

  const handleClosePremiumModal = useCallback(() => {
    setIsPremiumModalVisible(false);
  }, []);

  const handlePremiumSuccess = useCallback(() => {
    setIsPremiumModalVisible(false);
    invalidateQuota();
  }, [invalidateQuota]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
          Cargando negocios...
        </Text>
      </View>
    );
  }

  if (businesses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Store size={48} color={colors.text.tertiary} />
        <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
          No tienes negocios registrados
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
          Debes crear un negocio antes de poder crear una promoción.
        </Text>
      </View>
    );
  }

  // Verificar si el negocio seleccionado puede agregar más promociones
  const canAddPromotion = quotaInfo?.canAdd ?? true;
  const showQuotaLimitBanner = formData.businessId && quotaInfo && !quotaInfo.canAdd;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={formSectionStyles.section}>
          <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
            Selecciona un negocio <Text style={formSectionStyles.required}>*</Text>
          </Text>

          <ScrollView style={styles.businessScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.businessGrid}>
              {businesses.map((business: any) => {
                const isSelected = formData.businessId === business.id;

                return (
                  <Pressable
                    key={business.id}
                    style={[
                      styles.businessCard,
                      {
                        backgroundColor: isSelected
                          ? colors.primary[500]
                          : colors.background.secondary,
                        borderColor: isSelected ? colors.primary[500] : colors.border.medium,
                      },
                    ]}
                    onPress={() => onBusinessChange(business.id)}
                  >
                    <View style={styles.businessCardContent}>
                      <Building2
                        size={20}
                        color={isSelected ? '#FFFFFF' : colors.text.tertiary}
                      />
                      <Text
                        style={[
                          styles.businessName,
                          { color: isSelected ? '#FFFFFF' : colors.text.primary },
                        ]}
                        numberOfLines={1}
                      >
                        {business.name}
                      </Text>
                      {isSelected && (
                        <Check size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Información de cuota cuando hay un negocio seleccionado */}
          {formData.businessId && quotaInfo && (
            <View style={{
              marginTop: 12,
              padding: 12,
              backgroundColor: quotaInfo.hasPremium ? colors.primary[50] : colors.background.tertiary,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: quotaInfo.hasPremium ? colors.primary[200] : colors.border.light,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Tag size={16} color={quotaInfo.hasPremium ? colors.primary[600] : colors.text.secondary} />
                <Text style={{
                  marginLeft: 8,
                  fontSize: 14,
                  color: colors.text.secondary,
                }}>
                  {quotaInfo.hasPremium
                    ? `Promociones Premium: ${quotaInfo.usedCount}/${quotaInfo.totalQuota} usadas (${quotaInfo.availableCount} disponibles)`
                    : `Promociones: ${quotaInfo.usedCount}/${quotaInfo.freeQuota} gratuitas usadas`
                  }
                </Text>
              </View>
            </View>
          )}

          {/* Banner de límite alcanzado */}
          {showQuotaLimitBanner && (
            <View style={{
              marginTop: 12,
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
                  Límite de promociones alcanzado
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                color: colors.text.secondary,
                marginBottom: 12,
                lineHeight: 20,
              }}>
                Ya usaste tus {quotaInfo?.freeQuota} promociones gratuitas para este negocio.
                Con el paquete{' '}
                <Text style={{ fontWeight: '600', color: colors.primary[600] }}>
                  Promociones
                </Text>{' '}
                puedes añadir 10 promociones más.
              </Text>
              <Pressable
                onPress={handleOpenPremiumModal}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? colors.primary[600] : colors.primary[500],
                  borderRadius: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                })}
              >
                <Star size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>
                  Comprar Paquete Promociones
                </Text>
              </Pressable>
            </View>
          )}

          {errors.businessId && (
            <View style={styles.errorContainer}>
              <AlertCircle size={14} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.businessId}
              </Text>
            </View>
          )}
        </View>
      </View>

      <PremiumModal
        visible={isPremiumModalVisible}
        onClose={handleClosePremiumModal}
        onSuccess={handlePremiumSuccess}
        userRole={profile?.role_prf || null}
        initialPlan="promotions"
        preSelectedBusinessId={formData.businessId || undefined}
        preSelectedBusinessName={businesses.find((b: any) => b.id === formData.businessId)?.name}
      />
    </View>
  );
});




