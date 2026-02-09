import { memo } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Filter, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { ReviewType, ReviewFilters as ReviewFiltersType } from '@/features/admin/types';
import { styles } from './styles';

interface ReviewFiltersProps {
  filters: ReviewFiltersType;
  onFiltersChange: (filters: ReviewFiltersType) => void;
}

const REVIEW_TYPES: { value: ReviewType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'attraction', label: 'Atracciones' },
  { value: 'business', label: 'Negocios' },
  { value: 'event', label: 'Eventos' },
  { value: 'product', label: 'Productos' },
];

const RATING_OPTIONS = [
  { value: undefined, label: 'Todas' },
  { value: 5, label: '5 ⭐' },
  { value: 4, label: '4+ ⭐' },
  { value: 3, label: '3+ ⭐' },
  { value: 2, label: '2+ ⭐' },
  { value: 1, label: '1+ ⭐' },
];

export const ReviewFilters = memo<ReviewFiltersProps>(function ReviewFilters({
  filters,
  onFiltersChange,
}) {
  const colors = useThemedColors();

  const handleTypeChange = (type: ReviewType | 'all') => {
    onFiltersChange({
      ...filters,
      type: type === 'all' ? undefined : type,
    });
  };

  const handleRatingChange = (rating: number | undefined) => {
    onFiltersChange({
      ...filters,
      minRating: rating,
    });
  };

  const handleSearchChange = (text: string) => {
    onFiltersChange({
      ...filters,
      searchTerm: text,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.type || filters.minRating || filters.searchTerm;

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

      {/* Search Bar */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>Buscar</Text>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.medium,
              color: colors.text.primary,
            },
          ]}
          placeholder="Buscar por autor, título o contenido..."
          placeholderTextColor={colors.text.tertiary}
          value={filters.searchTerm ?? ''}
          onChangeText={handleSearchChange}
        />
      </View>

      {/* Type Filter */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
          Tipo de contenido
        </Text>
        <View style={styles.chipContainer}>
          {REVIEW_TYPES.map((type) => {
            const isSelected =
              (type.value === 'all' && !filters.type) || type.value === filters.type;

            return (
              <Pressable
                key={type.value}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor: isSelected ? colors.primary[500] : colors.background.secondary,
                    borderColor: isSelected ? colors.primary[500] : colors.border.medium,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={() => handleTypeChange(type.value)}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: isSelected ? colors.text.inverse : colors.text.secondary,
                    },
                  ]}
                >
                  {type.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Rating Filter */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
          Calificación mínima
        </Text>
        <View style={styles.chipContainer}>
          {RATING_OPTIONS.map((option) => {
            const isSelected =
              (option.value === undefined && filters.minRating === undefined) ||
              option.value === filters.minRating;

            return (
              <Pressable
                key={option.label}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor: isSelected ? colors.primary[500] : colors.background.secondary,
                    borderColor: isSelected ? colors.primary[500] : colors.border.medium,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={() => handleRatingChange(option.value)}
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
    </View>
  );
});
