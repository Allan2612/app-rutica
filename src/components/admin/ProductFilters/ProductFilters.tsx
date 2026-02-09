import { memo } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Filter, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { ProductsFilters } from '@/types/entities/product';
import { styles } from './styles';

interface ProductFiltersProps {
  filters: ProductsFilters;
  onFiltersChange: (filters: ProductsFilters) => void;
}

const STATUS_OPTIONS = [
  { value: undefined, label: 'Todos' },
  { value: true, label: 'Activos' },
  { value: false, label: 'Inactivos' },
];

const RATING_OPTIONS = [
  { value: undefined, label: 'Todas' },
  { value: 5, label: '5 ⭐' },
  { value: 4, label: '4+ ⭐' },
  { value: 3, label: '3+ ⭐' },
  { value: 2, label: '2+ ⭐' },
  { value: 1, label: '1+ ⭐' },
];

export const ProductFilters = memo<ProductFiltersProps>(function ProductFilters({
  filters,
  onFiltersChange,
}) {
  const colors = useThemedColors();

  const handleStatusChange = (isActive: boolean | undefined) => {
    onFiltersChange({
      ...filters,
      isActive,
    });
  };

  const handleRatingChange = (rating: number | undefined) => {
    onFiltersChange({
      ...filters,
      minRating: rating,
    });
  };

  const handleBusinessNameChange = (text: string) => {
    onFiltersChange({
      ...filters,
      businessName: text || undefined,
    });
  };

  const handleProductNameChange = (text: string) => {
    onFiltersChange({
      ...filters,
      productName: text || undefined,
    });
  };

  const handleCategoryChange = (text: string) => {
    onFiltersChange({
      ...filters,
      category: text || undefined,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.isActive !== undefined ||
    filters.minRating ||
    filters.businessName ||
    filters.productName ||
    filters.category;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Filter color={colors.text.primary} size={20} strokeWidth={2} />
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Filtros</Text>
        </View>
        {hasActiveFilters && (
          <Pressable
            style={({ pressed }) => [
              styles.clearButton,
              {
                backgroundColor: colors.background.tertiary,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={handleClearFilters}
          >
            <X color={colors.text.secondary} size={16} strokeWidth={2} />
            <Text style={[styles.clearText, { color: colors.text.secondary }]}>Limpiar</Text>
          </Pressable>
        )}
      </View>

      {/* Search Bars */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
          Buscar por negocio
        </Text>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.medium,
              color: colors.text.primary,
            },
          ]}
          placeholder="Nombre del negocio..."
          placeholderTextColor={colors.text.tertiary}
          value={filters.businessName ?? ''}
          onChangeText={handleBusinessNameChange}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
          Buscar por producto
        </Text>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.medium,
              color: colors.text.primary,
            },
          ]}
          placeholder="Nombre del producto..."
          placeholderTextColor={colors.text.tertiary}
          value={filters.productName ?? ''}
          onChangeText={handleProductNameChange}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
          Buscar por categoría
        </Text>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.medium,
              color: colors.text.primary,
            },
          ]}
          placeholder="Categoría..."
          placeholderTextColor={colors.text.tertiary}
          value={filters.category ?? ''}
          onChangeText={handleCategoryChange}
        />
      </View>

      {/* Status Filter */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>Estado</Text>
        <View style={styles.chipContainer}>
          {STATUS_OPTIONS.map((option) => {
            const isSelected = option.value === filters.isActive;

            return (
              <Pressable
                key={String(option.value)}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor: isSelected ? colors.primary[500] : colors.background.secondary,
                    borderColor: isSelected ? colors.primary[500] : colors.border.medium,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={() => handleStatusChange(option.value)}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: isSelected ? colors.text.inverse : colors.text.secondary,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Rating Filter */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>Rating mínimo</Text>
        <View style={styles.chipContainer}>
          {RATING_OPTIONS.map((rating) => {
            const isSelected = rating.value === filters.minRating;

            return (
              <Pressable
                key={String(rating.value)}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor: isSelected ? colors.primary[500] : colors.background.secondary,
                    borderColor: isSelected ? colors.primary[500] : colors.border.medium,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={() => handleRatingChange(rating.value)}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: isSelected ? colors.text.inverse : colors.text.secondary,
                    },
                  ]}
                >
                  {rating.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
});
