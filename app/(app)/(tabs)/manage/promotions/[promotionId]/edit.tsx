import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RequireRole } from '@/features/auth/guards/RequireRole';
import { BackButton } from '@/components/ui';
import { useThemedColors } from '@/hooks';

export default function EditPromotionRoute() {
  const colors = useThemedColors();
  const { promotionId } = useLocalSearchParams<{ promotionId: string }>();

  return (
    <RequireRole allowedRoles={['seller', 'admin']} redirectTo="/(app)/(tabs)/home">
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background.primary }]}
        edges={['top']}
      >
        <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
          <BackButton />
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Editar Promoción
          </Text>
          <View style={styles.spacer} />
        </View>
        <View style={styles.content}>
          <Text style={[styles.placeholder, { color: colors.text.secondary }]}>
            Editar promoción: {promotionId}
          </Text>
          <Text style={[styles.note, { color: colors.text.tertiary }]}>
            La funcionalidad de edición se implementará próximamente
          </Text>
        </View>
      </SafeAreaView>
    </RequireRole>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  spacer: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  placeholder: {
    fontSize: 16,
    fontWeight: '500',
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
  },
});
