import { View, Text } from 'react-native';
import styles from './styles';

export default function SupportScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Soporte</Text>
      <Text>Ventana simple de soporte.</Text>
    </View>
  );
}
