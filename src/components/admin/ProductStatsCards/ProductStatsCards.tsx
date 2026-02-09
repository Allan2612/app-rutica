import { memo } from 'react';
import { View, Text } from 'react-native';
import { Package, DollarSign, Eye, EyeOff } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface ProductStatsCardsProps {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  averagePrice: number;
}

export const ProductStatsCards = memo<ProductStatsCardsProps>(function ProductStatsCards({
  totalProducts,
  activeProducts,
  inactiveProducts,
  averagePrice,
}) {
  const colors = useThemedColors();

  return (
    <View style={styles.container}>
      {/* Total Products Card */}
      <View
        style={[
          styles.statCard,
          {
            backgroundColor: colors.background.primary,
            borderColor: colors.border.medium,
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.info + '15' }]}>
          <Package color={colors.info} size={20} strokeWidth={2} />
        </View>
        <View style={styles.statContent}>
          <Text style={[styles.statValue, { color: colors.text.primary }]}>
            {totalProducts.toLocaleString()}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Total productos</Text>
        </View>
      </View>

      {/* Active Products Card */}
      <View
        style={[
          styles.statCard,
          {
            backgroundColor: colors.background.primary,
            borderColor: colors.border.medium,
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.success + '15' }]}>
          <Eye color={colors.success} size={20} strokeWidth={2} />
        </View>
        <View style={styles.statContent}>
          <Text style={[styles.statValue, { color: colors.text.primary }]}>
            {activeProducts.toLocaleString()}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Activos</Text>
        </View>
      </View>

      {/* Inactive Products Card */}
      <View
        style={[
          styles.statCard,
          {
            backgroundColor: colors.background.primary,
            borderColor: colors.border.medium,
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.error + '15' }]}>
          <EyeOff color={colors.error} size={20} strokeWidth={2} />
        </View>
        <View style={styles.statContent}>
          <Text style={[styles.statValue, { color: colors.text.primary }]}>
            {inactiveProducts.toLocaleString()}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Inactivos</Text>
        </View>
      </View>

      {/* Average Price Card */}
      <View
        style={[
          styles.statCard,
          {
            backgroundColor: colors.background.primary,
            borderColor: colors.border.medium,
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.primary[500] + '15' }]}>
          <DollarSign color={colors.primary[500]} size={20} strokeWidth={2} />
        </View>
        <View style={styles.statContent}>
          <Text style={[styles.statValue, { color: colors.text.primary }]}>
            ₡{averagePrice.toLocaleString()}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Precio promedio</Text>
        </View>
      </View>
    </View>
  );
});
