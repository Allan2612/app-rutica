import { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export const PromotionsListScreen = memo(function PromotionsListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Promociones</Text>
      <Text style={styles.subtitle}>Lista de promociones</Text>
    </View>
  );
});
