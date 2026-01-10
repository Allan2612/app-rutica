import { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export const HomeScreen = memo(function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Home</Text>
      <Text style={styles.subtitle}>Pantalla principal</Text>
    </View>
  );
});
