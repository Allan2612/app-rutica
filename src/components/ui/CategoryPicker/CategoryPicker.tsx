/**
 * CategoryPicker — selector de categorías para filtros y formularios.
 * Todas las categorías a la vista, agrupadas por su categoría principal; un toque marca o
 * desmarca. Con muchas categorías aparece un buscador que muestra la ruta ("Salud › Dental").
 */

import { memo, useMemo, useState, type ReactNode } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Check, ChevronDown, ChevronUp, Search, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { spacing, typography } from '@/styles/theme';
import type { HierarchicalCategoryOption } from '@/types/entities';

interface CategoryPickerProps {
  categories: HierarchicalCategoryOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

/** A partir de cuántas categorías se muestra el buscador */
const SEARCH_THRESHOLD = 12;

export const CategoryPicker = memo(function CategoryPicker({
  categories,
  selectedIds,
  onChange,
}: CategoryPickerProps) {
  const colors = useThemedColors();
  const [query, setQuery] = useState('');
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);

  const { groups, pathOf } = useMemo(() => {
    const byId = new Map(categories.map((c) => [c.id, c]));
    const children = new Map<string | null, HierarchicalCategoryOption[]>();
    categories.forEach((c) => {
      const key = c.parentId && byId.has(c.parentId) ? c.parentId : null;
      children.set(key, [...(children.get(key) ?? []), c]);
    });
    const descendants = (id: string): HierarchicalCategoryOption[] =>
      (children.get(id) ?? []).flatMap((c) => [c, ...descendants(c.id)]);
    const roots = children.get(null) ?? [];
    const path = (c: HierarchicalCategoryOption): string => {
      const parent = c.parentId ? byId.get(c.parentId) : undefined;
      return parent ? `${path(parent)} › ${c.name}` : c.name;
    };
    return {
      groups: roots.map((root) => ({ root, items: descendants(root.id) })),
      pathOf: path,
    };
  }, [categories]);

  const toggle = (id: string) =>
    onChange(selected.has(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);

  const q = query.trim().toLowerCase();
  const matches = q ? categories.filter((c) => c.name.toLowerCase().includes(q)) : [];

  const chip = (c: HierarchicalCategoryOption, label: string) => {
    const on = selected.has(c.id);
    return (
      <Pressable
        key={c.id}
        onPress={() => toggle(c.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: on }}
        accessibilityLabel={label}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: on ? colors.primary[500] : colors.border.light,
          backgroundColor: on
            ? colors.primary[500]
            : pressed
              ? colors.background.tertiary
              : colors.background.primary,
        })}
      >
        {on && <Check size={14} color={colors.text.inverse} strokeWidth={3} />}
        <Text
          style={{
            fontSize: typography.sizes.sm,
            color: on ? colors.text.inverse : colors.text.primary,
            fontWeight: on ? '600' : '400',
          }}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  const chosen = categories.filter((c) => selected.has(c.id));

  return (
    <View style={{ gap: spacing.md }}>
      {chosen.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
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
                {c.name}
              </Text>
              <X size={14} color={colors.text.inverse} />
            </Pressable>
          ))}
        </View>
      )}
      {categories.length > SEARCH_THRESHOLD && (
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
          <Search size={16} color={colors.text.tertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar categoría…"
            placeholderTextColor={colors.text.tertiary}
            accessibilityLabel="Buscar categoría"
            autoCorrect={false}
            style={{
              flex: 1,
              paddingVertical: 10,
              fontSize: typography.sizes.sm,
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
              <X size={16} color={colors.text.tertiary} />
            </Pressable>
          ) : null}
        </View>
      )}

      {q ? (
        matches.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {matches.map((c) => chip(c, pathOf(c)))}
          </View>
        ) : (
          <Text style={{ color: colors.text.secondary, fontSize: typography.sizes.sm }}>
            No hay categorías con “{query.trim()}”.
          </Text>
        )
      ) : (
        groups.map(({ root, items }) => (
          <CategoryGroup
            key={root.id}
            title={root.name}
            count={items.length + 1}
            selectedCount={[root, ...items].filter((c) => selected.has(c.id)).length}
          >
            {chip(root, items.length ? `Todo ${root.name.toLowerCase()}` : root.name)}
            {items.map((c) => chip(c, c.name))}
          </CategoryGroup>
        ))
      )}
    </View>
  );
});

/** Grupo plegable: se abre solo si ya tiene categorías elegidas. */
function CategoryGroup({
  title,
  count,
  selectedCount,
  children,
}: {
  title: string;
  count: number;
  selectedCount: number;
  children: ReactNode;
}) {
  const colors = useThemedColors();
  const [open, setOpen] = useState(selectedCount > 0);
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.border.light,
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <Pressable
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${title}, ${count} categorías${selectedCount ? `, ${selectedCount} elegidas` : ''}`}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          paddingHorizontal: spacing.md,
          paddingVertical: 12,
          backgroundColor: pressed ? colors.background.tertiary : colors.background.primary,
        })}
      >
        <Text
          style={{
            flex: 1,
            fontSize: typography.sizes.sm,
            fontWeight: '600',
            color: colors.text.primary,
          }}
        >
          {title}
        </Text>
        {selectedCount > 0 && (
          <Text
            style={{
              fontSize: typography.sizes.xs,
              color: colors.text.inverse,
              backgroundColor: colors.primary[500],
              borderRadius: 999,
              paddingHorizontal: 8,
              paddingVertical: 2,
              overflow: 'hidden',
            }}
          >
            {selectedCount}
          </Text>
        )}
        <Text style={{ fontSize: typography.sizes.xs, color: colors.text.tertiary }}>{count}</Text>
        {open ? (
          <ChevronUp size={16} color={colors.text.tertiary} />
        ) : (
          <ChevronDown size={16} color={colors.text.tertiary} />
        )}
      </Pressable>
      {open && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing.sm,
            paddingHorizontal: spacing.md,
            paddingBottom: spacing.md,
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
}
