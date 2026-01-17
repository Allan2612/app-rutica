import { memo, useState } from 'react';
import { View, TextInput, Text, ActivityIndicator } from 'react-native';
import { TabSelector, TabOption, CategorySearchBar } from '@/components/ui';
import { AttractionsList } from '@/components/attractions';
import { useThemedColors } from '@/hooks';
import { useCategories } from '@/hooks/useCategories';
import { useAttractions } from '@/features/attractions/hooks/useAttractions';
import { styles } from './styles';

const ATTRACTION_TABS: TabOption[] = [
  { id: 'attractions', label: 'Atracciones' },
  { id: 'events', label: 'Eventos' },
];

export const AttractionsScreen = memo(function AttractionsScreen() {
  const [activeTab, setActiveTab] = useState('attractions');
  const [searchText, setSearchText] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const colors = useThemedColors();

  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const {
    data: attractions = [],
    isLoading: isAttractionsLoading,
  } = useAttractions({
    searchText,
    categoryIds: selectedCategoryIds,
    enabled: activeTab === 'attractions',
  });

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Category Search - solo para Atracciones */}
      {activeTab === 'attractions' && (
        <CategorySearchBar
          placeholder="Buscar atracciones..."
          categories={categories}
          selectedCategoryIds={selectedCategoryIds}
          onCategoryToggle={toggleCategory}
          onSearchChange={setSearchText}
          searchText={searchText}
          isLoading={isCategoriesLoading}
        />
      )}

      {/* Search simple para Eventos */}
      {activeTab === 'events' && (
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.border.dark,
              borderRadius: 8,
              backgroundColor: colors.background.secondary,
              paddingHorizontal: 12,
            }}
          >
            <TextInput
              placeholder="Buscar eventos..."
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
      <TabSelector tabs={ATTRACTION_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Contenido */}
      <View style={[styles.content, { backgroundColor: colors.background.secondary }]}>
        {activeTab === 'attractions' ? (
          isAttractionsLoading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" color={colors.primary[600]} />
            </View>
          ) : (
            <AttractionsList data={attractions} />
          )
        ) : (
          <View style={styles.placeholder}>
            <Text style={[styles.placeholderTitle, { color: colors.text.primary }]}>
              Explora los eventos pronto
            </Text>
            <Text style={[styles.placeholderSubtitle, { color: colors.text.secondary }]}>
              Estamos preparando los mejores eventos para ti.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});
