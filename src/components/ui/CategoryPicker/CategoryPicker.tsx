/**
 * CategoryPicker — navegador de categorías pensado para cientos de ellas (hoy ~200 en 3 niveles).
 * Se recorre por niveles (como carpetas, con migas para volver), se busca sin tildes en todo el
 * árbol mostrando la ruta, y lo elegido queda arriba para quitarlo de un toque.
 *
 * cascade (filtros): elegir una categoría la incluye con todas sus subcategorías, que se ven
 * marcadas como "incluidas". Sin cascade (etiquetar un comercio) cada categoría es independiente.
 * Ocupa todo el alto del contenedor y tiene su propio scroll.
 */

import { memo, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Check, ChevronLeft, ChevronRight, Search, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { spacing, typography } from '@/styles/theme';
import type { HierarchicalCategoryOption } from '@/types/entities';
import { buildCategoryTree, normalizeForSearch } from '@/utils/categoryTree';

interface CategoryPickerProps {
  categories: HierarchicalCategoryOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  /** Elegir una categoría incluye sus subcategorías (para filtros). Por defecto: sí */
  cascade?: boolean;
}

type Cat = HierarchicalCategoryOption;

export const CategoryPicker = memo(function CategoryPicker({
  categories,
  selectedIds,
  onChange,
  cascade = true,
}: CategoryPickerProps) {
  const colors = useThemedColors();
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const [query, setQuery] = useState('');
  const [trail, setTrail] = useState<string[]>([]);
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);

  const currentId = trail[trail.length - 1] ?? null;
  const current = currentId ? tree.byId.get(currentId) : undefined;

  const coveringAncestor = (id: string) =>
    cascade ? tree.ancestorsOf(id).find((a) => selected.has(a.id)) : undefined;

  const toggle = (id: string) => {
    if (selected.has(id)) return onChange(selectedIds.filter((x) => x !== id));
    if (!cascade) return onChange([...selectedIds, id]);
    // Al elegir una categoría, sus subcategorías ya van incluidas: no repetirlas
    const inside = new Set(tree.descendantsOf(id));
    onChange([...selectedIds.filter((x) => !inside.has(x)), id]);
  };

  const open = (id: string) => {
    setQuery('');
    setTrail([...tree.ancestorsOf(id).map((a) => a.id), id]);
  };

  const pathText = (c: Cat) =>
    tree
      .ancestorsOf(c.id)
      .map((a) => a.name)
      .join(' › ');

  const q = normalizeForSearch(query);
  const matches = useMemo(
    () => (q ? categories.filter((c) => normalizeForSearch(c.name).includes(q)) : []),
    [q, categories],
  );

  const checkbox = (on: boolean, dim: boolean) => (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: on ? colors.primary[500] : colors.border.medium,
        backgroundColor: on ? colors.primary[500] : 'transparent',
        opacity: dim ? 0.45 : 1,
      }}
    >
      {on && <Check size={14} color={colors.text.inverse} strokeWidth={3} />}
    </View>
  );

  const row = (c: Cat, opts: { label?: string; subtitle?: string; drill?: boolean } = {}) => {
    const label = opts.label ?? c.name;
    const cover = selected.has(c.id) ? undefined : coveringAncestor(c.id);
    const on = selected.has(c.id) || !!cover;
    const kids = tree.childrenOf(c.id).length;
    const drill = (opts.drill ?? true) && kids > 0;
    const inside = drill ? tree.descendantsOf(c.id).filter((d) => selected.has(d)).length : 0;
    const subtitle = cover ? `Incluida en ${cover.name}` : opts.subtitle;
    const text = (
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={2}
          style={{
            fontSize: typography.sizes.base,
            color: colors.text.primary,
            fontWeight: on && !cover ? '600' : '400',
          }}
        >
          {label}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={{ fontSize: typography.sizes.xs, color: colors.text.secondary, marginTop: 2 }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    );

    return (
      <View
        key={`${c.id}-${opts.label ?? ''}`}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 52,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.light,
        }}
      >
        <Pressable
          onPress={() => toggle(c.id)}
          disabled={!!cover}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: on, disabled: !!cover }}
          accessibilityLabel={label}
          hitSlop={4}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            paddingVertical: 12,
            paddingRight: spacing.md,
            flex: drill ? undefined : 1,
          }}
        >
          {checkbox(on, !!cover)}
          {!drill && text}
        </Pressable>
        {drill && (
          <Pressable
            onPress={() => open(c.id)}
            accessibilityRole="button"
            accessibilityLabel={`Ver ${kids} subcategorías de ${c.name}`}
            style={({ pressed }) => ({
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
              paddingVertical: 12,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            {text}
            {inside > 0 && (
              <Text
                style={{
                  fontSize: typography.sizes.xs,
                  fontWeight: '600',
                  color: colors.text.inverse,
                  backgroundColor: colors.primary[500],
                  borderRadius: 999,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  overflow: 'hidden',
                }}
              >
                {inside}
              </Text>
            )}
            <Text style={{ fontSize: typography.sizes.xs, color: colors.text.tertiary }}>
              {kids}
            </Text>
            <ChevronRight size={18} color={colors.text.tertiary} />
          </Pressable>
        )}
      </View>
    );
  };

  const chosen = selectedIds.map((id) => tree.byId.get(id)).filter((c): c is Cat => !!c);
  const level = tree.childrenOf(currentId);

  return (
    <View style={{ flex: 1, gap: spacing.md }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: 12,
          backgroundColor: colors.background.secondary,
        }}
      >
        <Search size={18} color={colors.text.tertiary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={`Buscar entre ${categories.length} categorías…`}
          placeholderTextColor={colors.text.tertiary}
          accessibilityLabel="Buscar categoría"
          autoCorrect={false}
          style={{
            flex: 1,
            paddingVertical: 12,
            fontSize: typography.sizes.base,
            color: colors.text.primary,
          }}
        />
        {query ? (
          <Pressable
            onPress={() => setQuery('')}
            accessibilityRole="button"
            accessibilityLabel="Borrar búsqueda"
            hitSlop={8}
          >
            <X size={18} color={colors.text.tertiary} />
          </Pressable>
        ) : null}
      </View>

      {chosen.length > 0 && (
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontSize: typography.sizes.sm, color: colors.text.secondary }}>
              {chosen.length === 1 ? '1 elegida' : `${chosen.length} elegidas`}
            </Text>
            <Pressable onPress={() => onChange([])} accessibilityRole="button" hitSlop={8}>
              <Text style={{ fontSize: typography.sizes.sm, color: colors.primary[600] }}>
                Quitar todas
              </Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.sm }}
          >
            {chosen.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => toggle(c.id)}
                accessibilityRole="button"
                accessibilityLabel={`Quitar ${c.name}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  paddingLeft: 12,
                  paddingRight: 8,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: colors.primary[500],
                }}
              >
                <Text
                  style={{
                    fontSize: typography.sizes.sm,
                    color: colors.text.inverse,
                    fontWeight: '600',
                  }}
                >
                  {cascade && tree.childrenOf(c.id).length ? `Todo ${c.name}` : c.name}
                </Text>
                <X size={14} color={colors.text.inverse} />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {!q && current && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Pressable
            onPress={() => setTrail(trail.slice(0, -1))}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={8}
            style={{ padding: 4, marginLeft: -4 }}
          >
            <ChevronLeft size={22} color={colors.text.primary} />
          </Pressable>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {[null, ...trail].map((id, i) => {
                const last = i === trail.length;
                return (
                  <View key={id ?? 'root'} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {i > 0 && (
                      <Text style={{ color: colors.text.tertiary, marginHorizontal: 6 }}>›</Text>
                    )}
                    <Pressable
                      onPress={() => setTrail(trail.slice(0, i))}
                      disabled={last}
                      accessibilityRole="link"
                    >
                      <Text
                        style={{
                          fontSize: typography.sizes.sm,
                          fontWeight: last ? '700' : '400',
                          color: last ? colors.text.primary : colors.primary[600],
                        }}
                      >
                        {id ? tree.byId.get(id)?.name : 'Todas'}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}

      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.lg }}
      >
        {q ? (
          matches.length ? (
            matches.map((c) => row(c, { subtitle: pathText(c) || undefined }))
          ) : (
            <Text
              style={{
                paddingVertical: spacing.lg,
                textAlign: 'center',
                color: colors.text.secondary,
              }}
            >
              No hay categorías con “{query.trim()}”.
            </Text>
          )
        ) : (
          <>
            {current &&
              row(current, {
                label: cascade ? `Todo ${current.name}` : `${current.name} (en general)`,
                subtitle: cascade
                  ? `Incluye sus ${tree.descendantsOf(current.id).length} subcategorías`
                  : undefined,
                drill: false,
              })}
            {level.map((c) => row(c))}
          </>
        )}
      </ScrollView>
    </View>
  );
});
