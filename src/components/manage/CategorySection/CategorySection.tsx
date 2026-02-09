import { memo, useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { CategoryOption, HierarchicalCategoryOption } from '@/types/entities';
import { CategorySelectionModal } from '../CategorySelectionModal';
import { CategoryChip } from '@/components/ui';
import { formSectionStyles as baseStyles } from '@/styles/form-section-styles';
import { styles } from './styles';

interface CategorySectionProps {
  categories: CategoryOption[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  isLoading?: boolean;
  error?: string;
}

export const CategorySection = memo(function CategorySection({
  categories,
  selectedIds,
  onSelectionChange,
  isLoading = false,
  error,
}: CategorySectionProps) {
  const colors = useThemedColors();
  const [modalVisible, setModalVisible] = useState(false);

  // Convertir CategoryOption[] a HierarchicalCategoryOption[]
  const hierarchicalCategories = useMemo<HierarchicalCategoryOption[]>(() => {
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      parentId: cat.parentId || null,
    }));
  }, [categories]);

  // Obtener nombres de categorías seleccionadas
  const selectedCategories = useMemo(() => {
    return categories.filter((cat) => selectedIds.includes(cat.id));
  }, [categories, selectedIds]);

  const handleRemoveCategory = (id: string) => {
    onSelectionChange(selectedIds.filter((catId) => catId !== id));
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleConfirm = (newSelectedIds: string[]) => {
    onSelectionChange(newSelectedIds);
  };

  return (
    <View style={baseStyles.section}>
      <View style={styles.header}>
        <Text style={[baseStyles.label, { color: colors.text.primary }]}>
          Categorías <Text style={baseStyles.required}>*</Text>
        </Text>
        <Pressable
          onPress={handleOpenModal}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.selectButton,
            {
              backgroundColor: colors.primary[500],
              opacity: pressed || isLoading ? 0.7 : 1,
            },
          ]}
        >
          <Plus size={16} color="#fff" strokeWidth={2.5} />
          <Text style={styles.selectButtonText}>
            {selectedCategories.length > 0 ? 'Editar' : 'Seleccionar'}
          </Text>
        </Pressable>
      </View>

      {/* Chips de categorías seleccionadas */}
      {selectedCategories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {selectedCategories.map((cat) => (
            <CategoryChip
              key={cat.id}
              categoryId={cat.id}
              categoryName={cat.name}
              parentId={cat.parentId}
              variant="default"
              removable={true}
              onRemove={() => handleRemoveCategory(cat.id)}
            />
          ))}
        </ScrollView>
      )}

      {/* Placeholder cuando no hay selección */}
      {selectedCategories.length === 0 && !isLoading && (
        <View style={[styles.placeholder, { backgroundColor: colors.background.tertiary }]}>
          <Text style={[styles.placeholderText, { color: colors.text.tertiary }]}>
            No has seleccionado categorías
          </Text>
        </View>
      )}

      {/* Loading state */}
      {isLoading && (
        <View style={[styles.placeholder, { backgroundColor: colors.background.tertiary }]}>
          <Text style={[styles.placeholderText, { color: colors.text.tertiary }]}>
            Cargando categorías...
          </Text>
        </View>
      )}

      {/* Error */}
      {error && <Text style={baseStyles.error}>{error}</Text>}

      {/* Modal de selección */}
      <CategorySelectionModal
        visible={modalVisible}
        categories={hierarchicalCategories}
        selectedIds={selectedIds}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </View>
  );
});
