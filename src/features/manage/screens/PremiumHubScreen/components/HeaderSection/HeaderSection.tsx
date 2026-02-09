import { memo } from 'react';
import { View, Text } from 'react-native';
import { Crown } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { BackButton } from '@/components/ui';
import { styles } from './styles';

export const HeaderSection = memo(function HeaderSection() {
  const colors = useThemedColors();

  return (
    <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
      <View style={styles.headerRow}>
        <BackButton href="/(app)/(tabs)/manage" />
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Crown color="#f59e0b" size={24} strokeWidth={2} />
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Mi Premium</Text>
          </View>
          <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
            Gestiona tus suscripciones y consulta el uso de cada paquete.
          </Text>
        </View>
      </View>
    </View>
  );
});
