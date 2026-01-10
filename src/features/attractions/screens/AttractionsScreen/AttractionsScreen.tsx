import { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export const AttractionsScreen = memo(function AttractionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏞️ Atracciones</Text>
      <Text style={styles.subtitle}>Pantalla en construcción</Text>
    </View>
  );
});
