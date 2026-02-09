import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Smartphone, CreditCard } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface PaymentMethodSelectorProps {
  selectedMethod: 'sinpe' | 'transfer';
  onSelectMethod: (method: 'sinpe' | 'transfer') => void;
}

export const PaymentMethodSelector = memo(function PaymentMethodSelector({
  selectedMethod,
  onSelectMethod,
}: PaymentMethodSelectorProps) {
  const colors = useThemedColors();

  return (
    <View style={styles.paymentMethodSection}>
      <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>Método de pago</Text>
      <View style={styles.paymentMethodButtons}>
        <Pressable
          style={[
            styles.paymentMethodButton,
            selectedMethod === 'sinpe' && styles.paymentMethodButtonActive,
            {
              backgroundColor:
                selectedMethod === 'sinpe' ? colors.primary[500] + '15' : colors.background.primary,
              borderColor: selectedMethod === 'sinpe' ? colors.primary[500] : colors.border.light,
            },
          ]}
          onPress={() => onSelectMethod('sinpe')}
        >
          <Smartphone
            size={20}
            color={selectedMethod === 'sinpe' ? colors.primary[500] : colors.text.secondary}
          />
          <Text
            style={[
              styles.paymentMethodText,
              {
                color: selectedMethod === 'sinpe' ? colors.primary[500] : colors.text.primary,
              },
            ]}
          >
            SINPE Móvil
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.paymentMethodButton,
            selectedMethod === 'transfer' && styles.paymentMethodButtonActive,
            {
              backgroundColor:
                selectedMethod === 'transfer'
                  ? colors.primary[500] + '15'
                  : colors.background.primary,
              borderColor:
                selectedMethod === 'transfer' ? colors.primary[500] : colors.border.light,
            },
          ]}
          onPress={() => onSelectMethod('transfer')}
        >
          <CreditCard
            size={20}
            color={selectedMethod === 'transfer' ? colors.primary[500] : colors.text.secondary}
          />
          <Text
            style={[
              styles.paymentMethodText,
              {
                color: selectedMethod === 'transfer' ? colors.primary[500] : colors.text.primary,
              },
            ]}
          >
            Transferencia
          </Text>
        </Pressable>
      </View>
    </View>
  );
});
