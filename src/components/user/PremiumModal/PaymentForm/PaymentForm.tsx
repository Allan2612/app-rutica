import { memo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { AlertCircle, Info } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface PaymentFormProps {
  paymentMethod: 'sinpe' | 'transfer';
  paymentReference: string;
  paymentNote: string;
  error: string | null;
  onReferenceChange: (value: string) => void;
  onNoteChange: (value: string) => void;
}

export const PaymentForm = memo(function PaymentForm({
  paymentMethod,
  paymentReference,
  paymentNote,
  error,
  onReferenceChange,
  onNoteChange,
}: PaymentFormProps) {
  const colors = useThemedColors();

  return (
    <>
      {/* Campo de referencia */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text.primary }]}>
          {paymentMethod === 'sinpe' ? 'Número de referencia SINPE' : 'Número de transferencia'}{' '}
          <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background.primary,
              borderColor: error && !paymentReference.trim()
                ? colors.error
                : colors.border.medium,
              color: colors.text.primary,
            },
          ]}
          value={paymentReference}
          onChangeText={onReferenceChange}
          placeholder="Ej: 123456789"
          placeholderTextColor={colors.text.tertiary}
          keyboardType="numeric"
        />
      </View>

      {/* Campo de nota (opcional) */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text.primary }]}>
          Nota adicional (opcional)
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: colors.background.primary,
              borderColor: colors.border.medium,
              color: colors.text.primary,
            },
          ]}
          value={paymentNote}
          onChangeText={onNoteChange}
          placeholder="Información adicional sobre el pago..."
          placeholderTextColor={colors.text.tertiary}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Aviso importante */}
      <View
        style={[styles.noticeCard, { backgroundColor: colors.warning + '10' }]}
      >
        <Info size={16} color={colors.warning} />
        <Text style={[styles.noticeText, { color: colors.text.secondary }]}>
          Tu suscripción será activada una vez verificado el pago (hasta 24h).
        </Text>
      </View>

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={14} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </View>
      )}
    </>
  );
});
