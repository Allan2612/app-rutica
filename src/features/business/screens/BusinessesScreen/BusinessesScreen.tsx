import { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export const BusinessesScreen = memo(function BusinessesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏪 Comercios</Text>
      <Text style={styles.subtitle}>Lista de comercios</Text>
    </View>
  );
});
