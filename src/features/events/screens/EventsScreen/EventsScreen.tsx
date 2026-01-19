import { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export const EventsScreen = memo(function EventsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos</Text>
      <Text style={styles.subtitle}>Pantalla en construcción</Text>
    </View>
  );
});
