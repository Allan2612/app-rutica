import { memo } from 'react';
import { View, Text } from 'react-native';
import { MousePointerClick } from 'lucide-react-native';
import { styles } from './styles';
import type { ThemedColors } from '../../../../../../../../types/entities/premium';

interface ContactsEmptyStateProps {
  colors: ThemedColors;
}

export const ContactsEmptyState = memo(function ContactsEmptyState({
  colors,
}: ContactsEmptyStateProps) {
  return (
    <View
      style={[
        styles.emptyCard,
        { backgroundColor: colors.background.primary, borderColor: colors.border.light },
      ]}
    >
      <MousePointerClick color={colors.text.tertiary} size={40} strokeWidth={1.5} />
      <Text style={[styles.emptyTitle, { color: colors.text.secondary }]}>
        Sin clicks registrados
      </Text>
      <Text style={[styles.emptyDesc, { color: colors.text.tertiary }]}>
        Cuando los usuarios interactúen con tus datos de contacto, verás las estadísticas aquí.
      </Text>
    </View>
  );
});
