import { memo, useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Search, X, Store, CalendarDays, Landmark, Tag } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { VerificationEntityType } from '@/features/admin/services/verification.service';
import type { ModerationStatus } from '@/types/enums';
import { styles } from './styles';

export interface VerificationFiltersProps {
  selectedType: VerificationEntityType | 'all';
  selectedStatus: ModerationStatus | 'all';
  searchQuery: string;
  pendingCounts?: {
    business: number;
    event: number;
    attraction: number;
    promotion: number;
  };
  onTypeChange: (type: VerificationEntityType | 'all') => void;
  onStatusChange: (status: ModerationStatus | 'all') => void;
  onSearchChange: (query: string) => void;
}

type FilterOption = {
  key: VerificationEntityType | 'all';
  label: string;
  icon?: typeof Store;
};

const TYPE_OPTIONS: FilterOption[] = [
  { key: 'all', label: 'Todos' },
  { key: 'business', label: 'Negocios', icon: Store },
  { key: 'event', label: 'Eventos', icon: CalendarDays },
  { key: 'attraction', label: 'Atracciones', icon: Landmark },
  { key: 'promotion', label: 'Promociones', icon: Tag },
];

const STATUS_OPTIONS: { key: ModerationStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'approved', label: 'Aprobados' },
  { key: 'rejected', label: 'Rechazados' },
];

export const VerificationFilters = memo(function VerificationFilters({
  selectedType,
  selectedStatus,
  searchQuery,
  pendingCounts,
  onTypeChange,
  onStatusChange,
  onSearchChange,
}: VerificationFiltersProps) {
  const colors = useThemedColors();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = useCallback(() => {
    onSearchChange(localSearch.trim());
  }, [localSearch, onSearchChange]);

  const handleClearSearch = useCallback(() => {
    setLocalSearch('');
    onSearchChange('');
  }, [onSearchChange]);

  return (
    <View style={styles.container}>
      {/* Search */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.background.primary,
            borderColor: colors.border.medium,
          },
        ]}
      >
        <Search color={colors.text.tertiary} size={18} strokeWidth={2} />
        <TextInput
          style={[styles.searchInput, { color: colors.text.primary }]}
          placeholder="Buscar por nombre..."
          placeholderTextColor={colors.text.tertiary}
          value={localSearch}
          onChangeText={setLocalSearch}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
        {localSearch.length > 0 && (
          <Pressable onPress={handleClearSearch} style={styles.clearButton}>
            <X color={colors.text.tertiary} size={18} strokeWidth={2} />
          </Pressable>
        )}
      </View>

      {/* Type Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {TYPE_OPTIONS.map((option) => {
          const isActive = selectedType === option.key;
          const Icon = option.icon;
          const count =
            option.key !== 'all' && pendingCounts
              ? pendingCounts[option.key as VerificationEntityType]
              : null;

          return (
            <Pressable
              key={option.key}
              style={[
                styles.filterButton,
                {
                  backgroundColor: isActive ? colors.primary[500] : colors.background.primary,
                  borderColor: isActive ? colors.primary[500] : colors.border.medium,
                },
                isActive && styles.filterButtonActive,
              ]}
              onPress={() => onTypeChange(option.key)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                {Icon && (
                  <Icon
                    color={isActive ? '#fff' : colors.text.secondary}
                    size={14}
                    strokeWidth={2}
                  />
                )}
                <Text
                  style={[
                    styles.filterText,
                    { color: isActive ? '#fff' : colors.text.secondary },
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {option.label}
                  {count !== null && count > 0 && ` (${count})`}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Status Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {STATUS_OPTIONS.map((option) => {
          const isActive = selectedStatus === option.key;
          return (
            <Pressable
              key={option.key}
              style={[
                styles.filterButton,
                {
                  backgroundColor: isActive ? colors.primary[100] : colors.background.primary,
                  borderColor: isActive ? colors.primary[500] : colors.border.light,
                },
              ]}
              onPress={() => onStatusChange(option.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: isActive ? colors.primary[700] : colors.text.tertiary },
                  isActive && styles.filterTextActive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
});
