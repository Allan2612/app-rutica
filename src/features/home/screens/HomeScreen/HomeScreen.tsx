import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export const HomeScreen = memo(function HomeScreen() {
  const colors = useThemedColors();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <Text style={[styles.title, { color: colors.text.primary }]}>Home</Text>
      <Text style={[styles.subtitle, { color: colors.text.secondary }]}>Pantalla principal</Text>
    </View>
  );
});
