/**
 * HomeSearchHeader — encabezado del inicio ("buscar primero").
 * Saludo con la zona, buscador que abre Comercios con la búsqueda hecha y accesos por
 * categoría tomados de los comercios que ya cargó el inicio (nunca llevan a una lista vacía).
 */

import { memo, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Search, MapPin } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useLocationStore } from '@/store';
import { getLocationDisplayName } from '@/utils/splitItemsByLocation';
import { spacing, typography } from '@/styles/theme';

interface CategoryChip {
  id: string;
  name: string;
}

interface HomeSearchHeaderProps {
  /** Categorías presentes en los comercios destacados */
  categories: CategoryChip[];
}

function greeting(hour: number) {
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export const HomeSearchHeader = memo(function HomeSearchHeader({
  categories,
}: HomeSearchHeaderProps) {
  const colors = useThemedColors();
  const location = useLocationStore((s) => s.location);
  const zone = getLocationDisplayName(location ?? null) || 'Costa Rica';
  const [query, setQuery] = useState('');
  const hello = useMemo(() => greeting(new Date().getHours()), []);

  const search = () => {
    const q = query.trim();
    router.push(
      q ? `/(app)/(tabs)/businesses?q=${encodeURIComponent(q)}` : '/(app)/(tabs)/businesses',
    );
  };

  return (
    <View
      style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm }}
    >
      <View style={{ gap: spacing.md }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
            {hello}
          </Text>
          <Text
            accessibilityRole="header"
            style={{
              fontSize: typography.sizes['2xl'],
              fontWeight: '700',
              color: colors.text.primary,
            }}
          >
            ¿Qué hacemos hoy?
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MapPin size={14} color={colors.primary[500]} />
            <Text style={{ fontSize: typography.sizes.sm, color: colors.primary[600] }}>
              {zone}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            maxWidth: 640,
            alignItems: 'center',
            gap: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: colors.border.medium,
            backgroundColor: colors.background.primary,
          }}
        >
          <Search size={18} color={colors.text.tertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={search}
            returnKeyType="search"
            placeholder="Buscar comercios…"
            placeholderTextColor={colors.text.tertiary}
            accessibilityLabel="Buscar comercios"
            autoCorrect={false}
            style={{
              flex: 1,
              paddingVertical: 12,
              fontSize: typography.sizes.base,
              color: colors.text.primary,
            }}
          />
          <Pressable
            onPress={search}
            accessibilityRole="button"
            accessibilityLabel="Buscar"
            hitSlop={8}
            style={({ pressed }) => ({
              paddingHorizontal: spacing.md,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: colors.primary[500],
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                color: colors.text.inverse,
                fontWeight: '600',
                fontSize: typography.sizes.sm,
              }}
            >
              Buscar
            </Text>
          </Pressable>
        </View>

        {categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.sm }}
          >
            {categories.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => router.push(`/(app)/(tabs)/businesses?cat=${c.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`Ver comercios de ${c.name}`}
                style={({ pressed }) => ({
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: colors.border.light,
                  backgroundColor: pressed ? colors.background.tertiary : colors.background.primary,
                })}
              >
                <Text style={{ fontSize: typography.sizes.sm, color: colors.text.primary }}>
                  {c.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
});
