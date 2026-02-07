import { memo } from 'react';
import { View, Text } from 'react-native';
import { Smartphone, CreditCard } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface PaymentInfoProps {
  method: 'sinpe' | 'transfer';
  sinpeNumber: string;
  sinpeName: string;
  ibanAccount: string;
  transferName: string;
}

export const PaymentInfo = memo(function PaymentInfo({
  method,
  sinpeNumber,
  sinpeName,
  ibanAccount,
  transferName,
}: PaymentInfoProps) {
  const colors = useThemedColors();

  if (method === 'sinpe') {
    return (
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
              {sinpeNumber}
            </Text>
          </View>
          <View style={styles.sinpeRow}>
            <Text style={[styles.sinpeLabel, { color: colors.text.secondary }]}>
              A nombre de:
            </Text>
            <Text style={[styles.sinpeValue, { color: colors.text.primary }]}>
              {sinpeName}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.sinpeCard, { borderColor: colors.border.light }]}
    >
      <View style={styles.sinpeHeader}>
        <CreditCard size={18} color={colors.primary[500]} />
        <Text style={[styles.sinpeTitle, { color: colors.text.primary }]}>
          Transferencia Bancaria
        </Text>
      </View>

      <View style={styles.sinpeDetails}>
        <View style={styles.sinpeRow}>
          <Text style={[styles.sinpeLabel, { color: colors.text.secondary }]}>
            Cuenta IBAN:
          </Text>
          <Text style={[styles.sinpeValue, { color: colors.text.primary }]}>
            {ibanAccount}
          </Text>
        </View>
        <View style={styles.sinpeRow}>
          <Text style={[styles.sinpeLabel, { color: colors.text.secondary }]}>
            A nombre de:
          </Text>
          <Text style={[styles.sinpeValue, { color: colors.text.primary }]}>
            {transferName}
          </Text>
        </View>
      </View>
    </View>
  );
});
