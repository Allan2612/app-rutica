import { memo, useState, useEffect } from 'react';
import { ActivityIndicator, Text, View, useWindowDimensions, Pressable } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { router } from 'expo-router';
import { TabSelector, TabOption, SearchFilterModal, SearchFilters } from '@/components/ui';
import { useBusinessCategories } from '@/features/business/hooks/useBusinessCategories';
import { useBusinesses } from '@/features/business/hooks/useBusinesses';
import { usePromotions } from '@/features/promotions/hooks';
import { useThemedColors } from '@/hooks';
import { useLocationStore } from '@/store';
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
  const { location } = useLocationStore();
  
  // Filtros para comercios
  const [commerceFilters, setCommerceFilters] = useState<SearchFilters>({
    searchText: '',
    categoryIds: [],
    location: null,
  });
  
  // Filtros para promociones
  const [promotionFilters, setPromotionFilters] = useState<SearchFilters>({
    searchText: '',
    categoryIds: [],
    location: null,
  });

  // Sincronizar filtros con ubicación del store al cambiar
  useEffect(() => {
    const locationFilter = location ? {
      province: location.province,
      canton: location.canton,
      district: location.district,
    } : null;
    
    setCommerceFilters(prev => ({ ...prev, location: locationFilter }));
    setPromotionFilters(prev => ({ ...prev, location: locationFilter }));
  }, [location?.province, location?.canton, location?.district]);
  
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
    province: commerceFilters.location?.province || undefined,
    canton: commerceFilters.location?.canton || undefined,
    district: commerceFilters.location?.district || undefined,
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
    province: promotionFilters.location?.province || undefined,
    canton: promotionFilters.location?.canton || undefined,
    district: promotionFilters.location?.district || undefined,
    enabled: activeTab === 'promotions',
  });

  const currentFilters = activeTab === 'commerces' ? commerceFilters : promotionFilters;
  const hasActiveFilters = 
    currentFilters.searchText !== '' || 
    currentFilters.categoryIds.length > 0 ||
    Boolean(currentFilters.location?.province || currentFilters.location?.canton || currentFilters.location?.district);

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
