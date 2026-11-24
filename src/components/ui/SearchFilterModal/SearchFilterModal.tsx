import { useState, useEffect, useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  View,
  Text,
  Modal,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from 'react-native';
import { ChevronDown, ChevronUp, MapPin, Search, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useLocationStore } from '@/store';
import type { SearchFilters, HierarchicalCategoryOption } from '@/types/entities';
import { getLocationDisplayName } from '@/utils/splitItemsByLocation';
import { spacing, typography } from '@/styles/theme';
import { CategoryPicker } from '../CategoryPicker';
import { styles } from './styles';
import { LocationFilterTab } from './LocationFilterTab';
import { FooterActions } from './FooterActions';

/**
 * Props del SearchFilterModal
 */
export interface SearchFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: SearchFilters) => void;
  categories: HierarchicalCategoryOption[];
  initialSearchText?: string;
  initialCategoryIds?: string[];
  placeholder?: string;
  title?: string;
  showLocationTab?: boolean;
}

// Re-exportar tipos para mantener compatibilidad
export type { SearchFilters, HierarchicalCategoryOption };

/**
 * Modal de búsqueda y filtros: una sola hoja con búsqueda, categorías (agrupadas, todas a la
 * vista) y zona. Antes eran tres pestañas que no dejaban ver los filtros juntos.
 */
export function SearchFilterModal({
  visible,
  onClose,
  onApply,
  categories,
  initialSearchText = '',
  initialCategoryIds = [],
  placeholder = 'Buscar…',
  title = 'Buscar y Filtrar',
  showLocationTab = true,
}: SearchFilterModalProps) {
  const colors = useThemedColors();
  const { location, clearLocation } = useLocationStore(
    useShallow((s) => ({ location: s.location, clearLocation: s.clearLocation })),
  );

  const [showZone, setShowZone] = useState(false);

  // Estados de filtros
  const [searchText, setSearchText] = useState(initialSearchText);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(initialCategoryIds);

  // Reset solo cuando se ABRE el modal (visible cambia a true)
  useEffect(() => {
    if (visible) {
      setSearchText(initialSearchText);
      setSelectedCategoryIds(initialCategoryIds);
      setShowZone(false);
    }
    // Solo cuando visible cambia - no cuando cambian los valores iniciales mientras está abierto
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Convertir categorías planas a jerárquicas si es necesario
  const hierarchicalCategories = useMemo((): HierarchicalCategoryOption[] => {
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      parentId: cat.parentId ?? null,
    }));
  }, [categories]);

  const handleApply = useCallback(() => {
    onApply({
      searchText: searchText.trim(),
      categoryIds: selectedCategoryIds,
      location: location
        ? {
            province: location.province,
            canton: location.canton,
            district: location.district,
          }
        : null,
    });
    onClose();
  }, [searchText, selectedCategoryIds, location, onApply, onClose]);

  const handleClear = useCallback(() => {
    setSearchText('');
    setSelectedCategoryIds([]);
    clearLocation();
  }, [clearLocation]);

  const hasFilters = useMemo(() => {
    return (
      searchText.trim() !== '' ||
      selectedCategoryIds.length > 0 ||
      Boolean(location?.province || location?.canton || location?.district)
    );
  }, [searchText, selectedCategoryIds, location]);

  const zoneName = getLocationDisplayName(location ?? null) || 'Todo Costa Rica';
  const activeCount =
    (searchText.trim() ? 1 : 0) +
    selectedCategoryIds.length +
    (location?.province || location?.canton || location?.district ? 1 : 0);

  const sectionTitle = (text: string, extra?: string) => (
    <Text
      accessibilityRole="header"
      style={{ fontSize: typography.sizes.base, fontWeight: '700', color: colors.text.primary }}
    >
      {text}
      {extra ? (
        <Text style={{ fontWeight: '400', color: colors.text.secondary }}>{`  ${extra}`}</Text>
      ) : null}
    </Text>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
            <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar"
              onPress={onClose}
              style={styles.closeButton}
            >
              <X size={24} color={colors.text.secondary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
                paddingHorizontal: spacing.md,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border.medium,
              }}
            >
              <Search size={18} color={colors.text.tertiary} />
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleApply}
                returnKeyType="search"
                placeholder={placeholder}
                placeholderTextColor={colors.text.tertiary}
                accessibilityLabel="Buscar por nombre o descripción"
                autoCorrect={false}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  fontSize: typography.sizes.base,
                  color: colors.text.primary,
                }}
              />
              {searchText ? (
                <Pressable
                  onPress={() => setSearchText('')}
                  accessibilityRole="button"
                  accessibilityLabel="Borrar búsqueda"
                  hitSlop={8}
                >
                  <X size={18} color={colors.text.tertiary} />
                </Pressable>
              ) : null}
            </View>

            {showLocationTab && (
              <View style={{ gap: spacing.md }}>
                {sectionTitle('Zona')}
                <Pressable
                  onPress={() => setShowZone((v) => !v)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: showZone }}
                  accessibilityLabel={`Zona: ${zoneName}. Cambiar`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.sm,
                    padding: spacing.md,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border.light,
                  }}
                >
                  <MapPin size={18} color={colors.primary[500]} />
                  <Text
                    style={{ flex: 1, color: colors.text.primary, fontSize: typography.sizes.sm }}
                  >
                    {zoneName}
                  </Text>
                  <Text style={{ color: colors.primary[600], fontSize: typography.sizes.sm }}>
                    Cambiar
                  </Text>
                  {showZone ? (
                    <ChevronUp size={16} color={colors.primary[600]} />
                  ) : (
                    <ChevronDown size={16} color={colors.primary[600]} />
                  )}
                </Pressable>
                {showZone && <LocationFilterTab />}
              </View>
            )}
            <View style={{ gap: spacing.md }}>
              {sectionTitle(
                'Categorías',
                selectedCategoryIds.length ? `${selectedCategoryIds.length} elegidas` : undefined,
              )}
              <CategoryPicker
                categories={hierarchicalCategories}
                selectedIds={selectedCategoryIds}
                onChange={setSelectedCategoryIds}
              />
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <FooterActions
            hasFilters={hasFilters}
            activeCount={activeCount}
            onClear={handleClear}
            onApply={handleApply}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
