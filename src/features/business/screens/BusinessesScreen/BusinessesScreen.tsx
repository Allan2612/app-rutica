import { memo, useState } from 'react';
import { ActivityIndicator, Text, View, useWindowDimensions, Pressable } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { router } from 'expo-router';
import { TabSelector, TabOption, SearchFilterModal, SearchFilters } from '@/components/ui';
import { useBusinessCategories } from '@/features/business/hooks/useBusinessCategories';
import { useBusinesses } from '@/features/business/hooks/useBusinesses';
import { usePromotions } from '@/features/promotions/hooks';
import { useThemedColors } from '@/hooks';
import { useBusinessesStyles } from './styles';
import { BusinessesList } from '@/components/business/BusinessesList';
import { PromotionsPublicList } from '@/components/promotions';

const BUSINESS_TABS: TabOption[] = [
  { id: 'commerces', label: 'Comercios' },
  { id: 'promotions', label: 'Promociones' },
];

export const BusinessesScreen = memo(function BusinessesScreen() {
  const [activeTab, setActiveTab] = useState('commerces');
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  
  // Filtros para comercios
  const [commerceFilters, setCommerceFilters] = useState<SearchFilters>({
    searchText: '',
    categoryIds: [],
  });
  
  // Filtros para promociones
  const [promotionFilters, setPromotionFilters] = useState<SearchFilters>({
    searchText: '',
    categoryIds: [],
  });
  
  const { width } = useWindowDimensions();
  const colors = useThemedColors();
  const styles = useBusinessesStyles();

  // Calcular número de columnas según el ancho
  const numColumns = width > 768 ? 3 : width > 600 ? 2 : 1;
  // Key para forzar re-render al cambiar numColumns
  const businessesListKey = `businesses-${numColumns}-columns`;
  const promotionsListKey = `promotions-${numColumns}-columns`;

  const { data: categories = [] } = useBusinessCategories();
  const {
    data: businesses = [],
    isLoading: isBusinessesLoading,
    refetch: refetchBusinesses,
    isRefetching: isBusinessesRefetching,
  } = useBusinesses({
    searchText: commerceFilters.searchText,
    categoryIds: commerceFilters.categoryIds,
    enabled: activeTab === 'commerces',
  });

  const {
    data: promotions = [],
    isLoading: isPromotionsLoading,
    refetch: refetchPromotions,
    isRefetching: isPromotionsRefetching,
  } = usePromotions({
    searchText: promotionFilters.searchText,
    categoryIds: promotionFilters.categoryIds,
    enabled: activeTab === 'promotions',
  });

  const currentFilters = activeTab === 'commerces' ? commerceFilters : promotionFilters;
  const hasActiveFilters = currentFilters.searchText !== '' || currentFilters.categoryIds.length > 0;

  const handleApplyFilters = (filters: SearchFilters) => {
    if (activeTab === 'commerces') {
      setCommerceFilters(filters);
    } else {
      setPromotionFilters(filters);
    }
  };

  const handlePromotionPress = (promotion: typeof promotions[0]) => {
    if (promotion.businessId) {
      router.push(`/(app)/(tabs)/businesses/${promotion.businessId}`);
    }
  };

  const SearchButton = (
    <Pressable
      onPress={() => setIsSearchModalVisible(true)}
      style={[
        styles.searchButton,
        { 
          backgroundColor: hasActiveFilters 
            ? colors.primary[500] 
            : colors.background.secondary,
        },
      ]}
    >
      {hasActiveFilters ? (
        <SlidersHorizontal size={18} color={colors.text.inverse} />
      ) : (
        <Search size={18} color={colors.text.secondary} />
      )}
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Tabs con botón de búsqueda a la derecha */}
      <TabSelector 
        tabs={BUSINESS_TABS} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        rightElement={SearchButton}
      />

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
              listKey={businessesListKey}
              isRefreshing={isBusinessesRefetching}
              onRefresh={() => refetchBusinesses()}
            />
          )
        ) : isPromotionsLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color={colors.primary[600]} />
          </View>
        ) : (
          <PromotionsPublicList
            data={promotions}
            numColumns={numColumns}
            listKey={promotionsListKey}
            isRefreshing={isPromotionsRefetching}
            onRefresh={() => refetchPromotions()}
            onPromotionPress={handlePromotionPress}
          />
        )}
      </View>

      {/* Modal de búsqueda y filtros */}
      <SearchFilterModal
        visible={isSearchModalVisible}
        onClose={() => setIsSearchModalVisible(false)}
        onApply={handleApplyFilters}
        categories={categories}
        initialSearchText={currentFilters.searchText}
        initialCategoryIds={currentFilters.categoryIds}
        placeholder={activeTab === 'commerces' ? 'Buscar comercios...' : 'Buscar promociones...'}
        title={activeTab === 'commerces' ? 'Buscar Comercios' : 'Buscar Promociones'}
      />
    </View>
  );
});
