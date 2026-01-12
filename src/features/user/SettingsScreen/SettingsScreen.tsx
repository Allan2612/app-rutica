import { memo } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

export const SettingsScreen = memo(function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      <Text>Ventana simple de configuración.</Text>
    </View>
  );
});

export default SettingsScreen;
