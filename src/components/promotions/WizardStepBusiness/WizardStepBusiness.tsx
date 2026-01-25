import { memo } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Building2, Check, AlertCircle, Store } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useUserBusinesses } from '@/features/business/hooks';
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
    </View>
  );
});




