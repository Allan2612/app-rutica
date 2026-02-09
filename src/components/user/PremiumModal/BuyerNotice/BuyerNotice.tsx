import { memo } from 'react';
import { View, Text } from 'react-native';
import { Info } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export const BuyerNotice = memo(function BuyerNotice() {
  const colors = useThemedColors();

  return (
    <View
      style={[
        styles.buyerNotice,
        {
          backgroundColor: colors.isDark ? colors.primary[900] + '20' : colors.primary[50],
          borderColor: colors.primary[500],
        },
      ]}
    >
      <Info size={20} color={colors.primary[500]} />
      <Text style={[styles.buyerNoticeText, { color: colors.text.primary }]}>
        Debes tener un perfil de negocio para poder adquirir estos planes premium
      </Text>
    </View>
  );
});
