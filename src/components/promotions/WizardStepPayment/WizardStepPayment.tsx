import { memo } from 'react';
import { View, Text, TextInput } from 'react-native';
import {
  CreditCard,
  AlertCircle,
  Smartphone,
  Info,
} from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { formSectionStyles } from '@/styles/form-section-styles';
import type { PromotionWizardFormData, PromotionWizardErrors } from '@/types/entities';
import { styles } from './styles';

interface WizardStepPaymentProps {
  formData: PromotionWizardFormData;
  errors: PromotionWizardErrors;
  onFieldChange: <K extends keyof PromotionWizardFormData>(
    field: K,
    value: PromotionWizardFormData[K]
  ) => void;
}

// TODO: These should come from config/environment
const SINPE_NUMBER = '8888-8888';
const SINPE_NAME = 'Rutica CR';
const PROMOTION_PRICE = '₡5,000';

export const WizardStepPayment = memo(function WizardStepPayment({
  formData,
  errors,
  onFieldChange,
}: WizardStepPaymentProps) {
  const colors = useThemedColors();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Price Card */}
        <View
          style={[styles.priceCard, { backgroundColor: colors.background.tertiary }]}
        >
          <CreditCard size={20} color={colors.primary[500]} />
          <View style={styles.priceInfo}>
            <Text style={[styles.priceLabel, { color: colors.text.secondary }]}>
              Costo por promoción
            </Text>
            <Text style={[styles.priceValue, { color: colors.primary[500] }]}>
              {PROMOTION_PRICE}
            </Text>
          </View>
        </View>

        {/* SINPE Info */}
        <View
          style={[styles.sinpeCard, { borderColor: colors.border.light }]}
        >
          <View style={styles.sinpeHeader}>
            <Smartphone size={18} color={colors.primary[500]} />
            <Text style={[styles.sinpeTitle, { color: colors.text.primary }]}>
              SINPE Móvil
            </Text>
          </View>

          <View style={styles.sinpeDetails}>
            <View style={styles.sinpeRow}>
              <Text style={[styles.sinpeLabel, { color: colors.text.secondary }]}>
                Número:
              </Text>
              <Text style={[styles.sinpeValue, { color: colors.text.primary }]}>
                {SINPE_NUMBER}
              </Text>
            </View>
            <View style={styles.sinpeRow}>
              <Text style={[styles.sinpeLabel, { color: colors.text.secondary }]}>
                A nombre de:
              </Text>
              <Text style={[styles.sinpeValue, { color: colors.text.primary }]}>
                {SINPE_NAME}
              </Text>
            </View>
          </View>
        </View>

        {/* Reference Number Input */}
        <View style={formSectionStyles.section}>
          <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
            Número de referencia SINPE <Text style={formSectionStyles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              formSectionStyles.input,
              {
                backgroundColor: colors.background.primary,
                borderColor: errors.paymentReference ? colors.error : colors.border.medium,
                color: colors.text.primary,
              },
            ]}
            value={formData.paymentReference}
            onChangeText={(text) => onFieldChange('paymentReference', text)}
            placeholder="Ej: 123456789"
            placeholderTextColor={colors.text.tertiary}
            keyboardType="numeric"
          />
          {errors.paymentReference && (
            <View style={styles.errorContainer}>
              <AlertCircle size={14} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.paymentReference}
              </Text>
            </View>
          )}
        </View>

        {/* Important Notice */}
        <View
          style={[styles.noticeCard, { backgroundColor: colors.warning + '10' }]}
        >
          <Info size={16} color={colors.warning} />
          <Text style={[styles.noticeText, { color: colors.text.secondary }]}>
            Tu promoción será revisada y publicada una vez verificado el pago (hasta 24h).
          </Text>
        </View>
      </View>
    </View>
  );
});




