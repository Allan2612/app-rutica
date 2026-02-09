import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface ProductPriceProps {
  price: number;
  currency: string;
}

export const ProductPrice = memo(function ProductPrice({ price, currency }: ProductPriceProps) {
  const colors = useThemedColors();

  const formatPrice = (amount: number, curr: string) => {
    if (curr === 'CRC' || curr === '₡') {
      return `₡${amount.toLocaleString('es-CR')}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  return (
    <View style={styles.priceRow}>
      <Text style={[styles.price, { color: colors.primary[500] }]}>
        {formatPrice(price, currency)}
      </Text>
    </View>
  );
});
