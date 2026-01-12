import { View, Text } from 'react-native';
import styles from './styles';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      <Text>Ventana simple de configuración.</Text>
    </View>
  );
}
