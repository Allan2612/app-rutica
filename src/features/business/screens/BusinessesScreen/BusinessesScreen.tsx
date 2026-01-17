import { memo, useState } from 'react';
import { ActivityIndicator, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { TabSelector, TabOption, CategorySearchBar } from '@/components/ui';
import { useBusinessCategories } from '@/features/business/hooks/useBusinessCategories';
import { useBusinesses } from '@/features/business/hooks/useBusinesses';
import { useThemedColors } from '@/hooks';
import { useBusinessesStyles } from './styles';
import { BusinessesList } from '@/components/business/BusinessesList';

const BUSINESS_TABS: TabOption[] = [
  { id: 'commerces', label: 'Comercios' },
  { id: 'promotions', label: 'Promociones' },
];

export const BusinessesScreen = memo(function BusinessesScreen() {
  const [activeTab, setActiveTab] = useState('commerces');
  const [searchText, setSearchText] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const { width } = useWindowDimensions();
  const colors = useThemedColors();
  const styles = useBusinessesStyles();

  // Calcular número de columnas según el ancho
  const numColumns = width > 768 ? 3 : width > 600 ? 2 : 1;
  // Key para forzar re-render al cambiar numColumns
  const listKey = `businesses-${numColumns}-columns`;

  const { data: categories = [], isLoading } = useBusinessCategories();
  const {
    data: businesses = [],
    isLoading: isBusinessesLoading,
  } = useBusinesses({
    searchText,
    categoryIds: selectedCategoryIds,
    enabled: activeTab === 'commerces',
  });

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Category Search - solo para Comercios */}
      {activeTab === 'commerces' && (
        <CategorySearchBar
          placeholder="Buscar comercios..."
          categories={categories}
          selectedCategoryIds={selectedCategoryIds}
          onCategoryToggle={toggleCategory}
          onSearchChange={setSearchText}
          searchText={searchText}
          isLoading={isLoading}
        />
      )}

      {/* Search simple para Promociones */}
      {activeTab === 'promotions' && (
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.border.dark,
              borderRadius: 8,
              backgroundColor: colors.background.primary,
              paddingHorizontal: 12,
            }}
          >
            <TextInput
              placeholder="Buscar promociones..."
              placeholderTextColor={colors.text.tertiary}
              value={searchText}
              onChangeText={setSearchText}
              style={{
                paddingVertical: 10,
                fontSize: 14,
                color: colors.text.primary,
              }}
            />
          </View>
        </View>
      )}

      {/* Tabs debajo del search */}
      <TabSelector tabs={BUSINESS_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Contenido */}
      <View style={[styles.content, { backgroundColor: colors.background.secondary }]}>
        {activeTab === 'commerces' ? (
          isBusinessesLoading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" color={colors.primary[600]} />
            </View>
          ) : (
            <BusinessesList
              data={businesses}
              numColumns={numColumns}
              listKey={listKey}
            />
          )
        ) : (
          <View style={styles.placeholder}>
            <Text style={[styles.placeholderTitle, { color: colors.text.primary }]}>Explora las promociones pronto</Text>
            <Text style={[styles.placeholderSubtitle, { color: colors.text.secondary }]}>
              Estamos preparando las mejores ofertas para ti.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});
