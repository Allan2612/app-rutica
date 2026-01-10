import { memo } from 'react';
import { View, Text } from 'react-native';
import { Wrench } from 'lucide-react-native';
import { styles } from './styles';

export const ManageScreen = memo(function ManageScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Wrench color="#10b981" size={48} strokeWidth={2} />
      </View>
      <Text style={styles.title}>Gestionar</Text>
      <Text style={styles.subtitle}>
        Publicar negocios, atracciones, eventos{'\n'}y dashboard de administrador
      </Text>
      <Text style={styles.comingSoon}>Próximamente</Text>
    </View>
  );
});
