import { memo } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

export const LogoutScreen = memo(function LogoutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cerrar sesión</Text>
      <Text>¿Seguro que quieres cerrar sesión?</Text>
    </View>
  );
});
