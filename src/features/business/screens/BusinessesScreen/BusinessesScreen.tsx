import { memo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, View } from 'react-native';
import { BusinessCard } from '@/components/business';
import { TabSelector, TabOption, CategorySearchBar } from '@/components/ui';
import { useBusinessCategories } from '@/features/business/hooks/useBusinessCategories';
import { useBusinesses } from '@/features/business/hooks/useBusinesses';
import { colors } from '@/styles/theme/colors';
import { styles } from './styles';

const BUSINESS_TABS: TabOption[] = [
  { id: 'commerces', label: 'Comercios' },
  { id: 'promotions', label: 'Promociones' },
];

export const BusinessesScreen = memo(function BusinessesScreen() {
  const [activeTab, setActiveTab] = useState('commerces');
  const [searchText, setSearchText] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

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
    <View style={styles.container}>
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
              value={searchText}
              onChangeText={setSearchText}
              style={{
                paddingVertical: 10,
                fontSize: 14,
              }}
            />
          </View>
        </View>
      )}

      {/* Tabs debajo del search */}
      <TabSelector tabs={BUSINESS_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Contenido */}
      <View style={styles.content}>
        {activeTab === 'commerces' ? (
          isBusinessesLoading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" color={colors.primary[600]} />
            </View>
          ) : (
            <FlatList
              data={businesses}
              keyExtractor={(item) => item.id}
              numColumns={3}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.cardWrapper}>
                  <BusinessCard
                    name={item.name}
                    description={item.description}
                    categoryName={item.categoryName}
                    categoryId={item.categoryId}
                    locationLabel={item.locationLabel}
                    imageUrl={item.imageUrl ?? undefined}
                    logoUrl={item.logoUrl ?? undefined}
                    rating={item.rating}
                    reviewCount={item.reviewCount}
                  />
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No hay comercios disponibles</Text>
                  <Text style={styles.emptySubtitle}>
                    Prueba ajustando la búsqueda o selecciona otra categoría.
                  </Text>
                </View>
              }
            />
          )
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderTitle}>Explora las promociones pronto</Text>
            <Text style={styles.placeholderSubtitle}>
              Estamos preparando las mejores ofertas para ti.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});
