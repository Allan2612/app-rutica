import { memo } from 'react';
import { View, Text } from 'react-native';
import { Wrench } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export const ManageScreen = memo(function ManageScreen() {
  const colors = useThemedColors();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.background.primary }]}>
        <Wrench color={colors.primary[500]} size={48} strokeWidth={2} />
      </View>
      <Text style={[styles.title, { color: colors.text.primary }]}>Gestionar</Text>
      <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
        Publicar negocios, atracciones, eventos{'\n'}y dashboard de administrador
      </Text>
      <Text style={[
        styles.comingSoon,
        {
          color: colors.isDark ? colors.primary[400] : colors.primary[700],
          backgroundColor: colors.isDark ? colors.primary[900] : colors.primary[100],
        }
      ]}>Próximamente</Text>
    </View>
  );
});
