import { memo } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Tag, Check, AlertCircle } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { formSectionStyles } from '@/styles/form-section-styles';
import { styles } from './styles';

interface Category {
  id: string;
  name: string;
}

interface CategorySelectionProps {
  categories: Category[];
  selectedCategoryIds: string[];
  isLoading: boolean;
  onToggleCategory: (categoryId: string) => void;
  error?: string;
}

export const CategorySelection = memo(function CategorySelection({
  categories,
  selectedCategoryIds,
  isLoading,
  onToggleCategory,
  error,
}: CategorySelectionProps) {
  const colors = useThemedColors();
  const selectedCount = selectedCategoryIds.length;

  return (
    <View style={formSectionStyles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
          Categorías de productos <Text style={formSectionStyles.required}>*</Text>
        </Text>
        {selectedCount > 0 && (
          <View style={[styles.countBadge, { backgroundColor: colors.primary[500] }]}>
            <Text style={styles.countText}>{selectedCount}</Text>
          </View>
        )}
      </View>

      <Text style={[styles.helperText, { color: colors.text.secondary }]}>
        La promoción aplicará a todos los productos que pertenezcan a estas categorías
      </Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary[500]} />
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Cargando categorías...
          </Text>
        </View>
      ) : categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Tag size={24} color={colors.text.tertiary} />
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
            No hay categorías en los productos del negocio
          </Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {categories.map((category) => {
            const isSelected = selectedCategoryIds.includes(category.id);

            return (
              <Pressable
                key={category.id}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? colors.primary[500] : colors.background.secondary,
                    borderColor: isSelected ? colors.primary[500] : colors.border.medium,
                  },
                ]}
                onPress={() => onToggleCategory(category.id)}
              >
                {isSelected && <Check size={14} color="#FFFFFF" />}
                <Text
                  style={[
                    styles.chipLabel,
                    { color: isSelected ? '#FFFFFF' : colors.text.primary },
                  ]}
                >
                  {category.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={14} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}
    </View>
  );
});
