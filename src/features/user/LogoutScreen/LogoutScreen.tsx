import { View, Text } from 'react-native';
import styles from './styles';

export default function LogoutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cerrar sesión</Text>
      <Text>¿Seguro que quieres cerrar sesión?</Text>
    </View>
  );
}
