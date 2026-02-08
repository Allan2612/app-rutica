import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { ActivityIndicator, ScrollView, RefreshControl, View, useWindowDimensions, Pressable, Text } from 'react-native';
import { Search, SlidersHorizontal, Store } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TabSelector, TabOption, SearchFilterModal, SearchFilters, LocationSectionHeader, NoLocalResultsPlaceholder } from '@/components/ui';
import { useBusinessCategories } from '@/features/business/hooks/useBusinessCategories';
import { useBusinesses, BusinessListItem } from '@/features/business/hooks/useBusinesses';
import { usePromotions } from '@/features/promotions/hooks';
import { useThemedColors } from '@/hooks';
import { useLocationStore } from '@/store';
import { splitItemsByLocation } from '@/utils/splitItemsByLocation';
import { useBusinessesStyles } from './styles';
import { BusinessesList } from '@/components/business/BusinessesList';
import { BusinessCard } from '@/components/business/BusinessCard';
import { PromotionsPublicList } from '@/components/promotions';
import { PromotionPublicCard } from '@/components/promotions/PromotionPublicCard';
import type { PromotionListItem } from '@/types/entities';
import { spacing } from '@/styles/theme';

const BUSINESS_TABS: TabOption[] = [
  { id: 'commerces', label: 'Comercios' },
  { id: 'promotions', label: 'Promociones' },
];

export const BusinessesScreen = memo(function BusinessesScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState(tab === 'promotions' ? 'promotions' : 'commerces');
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const { location } = useLocationStore();

  // Actualizar tab cuando cambia el parámetro
  useEffect(() => {
    if (tab === 'promotions' || tab === 'commerces') {
      setActiveTab(tab);
    }
  }, [tab]);

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
  const locationFilter = useMemo(() => {
    if (!location) return null;
    return {
      province: location.province,
      canton: location.canton,
      district: location.district,
    };
  }, [location?.province, location?.canton, location?.district]);

  useEffect(() => {
    setCommerceFilters(prev => ({ ...prev, location: locationFilter }));
    setPromotionFilters(prev => ({ ...prev, location: locationFilter }));
  }, [locationFilter]);

  const { width } = useWindowDimensions();
  const colors = useThemedColors();
  const styles = useBusinessesStyles();

  // Calcular número de columnas según el ancho
  const numColumns = width > 768 ? 3 : width > 600 ? 2 : 1;
  // Key para forzar re-render al cambiar numColumns
  const businessesListKey = `businesses-${numColumns}-columns`;
  const promotionsListKey = `promotions-${numColumns}-columns`;

  const { data: categories = [] } = useBusinessCategories();

  // Fetch ALL businesses (sin filtro de ubicación) para poder dividir en secciones
  const {
    data: businesses = [],
    isLoading: isBusinessesLoading,
    refetch: refetchBusinesses,
  } = useBusinesses({
    searchText: commerceFilters.searchText,
    categoryIds: commerceFilters.categoryIds,
    // No pasar ubicación — se divide client-side
    enabled: activeTab === 'commerces',
  });

  // Fetch ALL promotions (sin filtro de ubicación)
  const {
    data: promotions = [],
    isLoading: isPromotionsLoading,
    refetch: refetchPromotions,
  } = usePromotions({
    searchText: promotionFilters.searchText,
    categoryIds: promotionFilters.categoryIds,
    // No pasar ubicación — se divide client-side
    enabled: activeTab === 'promotions',
  });

  // Dividir negocios por ubicación
  const businessSplit = useMemo(
    () => splitItemsByLocation(businesses, locationFilter),
    [businesses, locationFilter]
  );

  // Dividir promociones por ubicación (usan locationLabel del negocio asociado)
  const promotionSplit = useMemo(
    () => splitItemsByLocation(promotions, locationFilter),
    [promotions, locationFilter]
  );

  // Estado para controlar el pull-to-refresh manualmente
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const handleManualRefresh = useCallback(async () => {
    setIsManualRefreshing(true);
    try {
      if (activeTab === 'commerces') {
        await refetchBusinesses();
      } else {
        await refetchPromotions();
      }
    } finally {
      setIsManualRefreshing(false);
    }
  }, [activeTab, refetchBusinesses, refetchPromotions]);

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

  const handleBusinessPress = useCallback((businessId: string) => {
    router.push(`/(app)/(tabs)/businesses/${businessId}`);
  }, []);

  const handlePromotionPress = useCallback((promotion: PromotionListItem) => {
    if (promotion.businessId) {
      router.push(`/(app)/(tabs)/businesses/${promotion.businessId}`);
    }
  }, []);

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

  // Renderizar grid de negocios sin FlatList (para usar dentro de ScrollView con secciones)
  const renderBusinessGrid = useCallback((items: BusinessListItem[]) => (
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
      paddingBottom: spacing.sm,
    }}>
      {items.map((item) => (
        <View key={item.id} style={{
          width: numColumns === 1 ? '100%' : numColumns === 2 ? '48.5%' : '32%',
          marginBottom: spacing.xs,
        }}>
          <BusinessCard
            id={item.id}
            name={item.name}
            categoryNames={item.categoryNames}
            categoryIds={item.categoryIds}
            locationLabel={item.locationLabel}
            imageUrl={item.imageUrl ?? undefined}
            logoUrl={item.logoUrl ?? undefined}
            rating={item.rating}
            reviewCount={item.reviewCount}
            isApproved={item.isApproved}
            hasActivePromotions={item.hasActivePromotions}
            onPress={() => handleBusinessPress(item.id)}
          />
        </View>
      ))}
    </View>
  ), [numColumns, handleBusinessPress]);

  // Renderizar grid de promociones sin FlatList
  const renderPromotionGrid = useCallback((items: PromotionListItem[]) => (
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
      paddingBottom: spacing.sm,
    }}>
      {items.map((item) => (
        <View key={item.id} style={{
          width: numColumns === 1 ? '100%' : numColumns === 2 ? '48.5%' : '32%',
          marginBottom: spacing.xs,
        }}>
          <PromotionPublicCard
            promotion={item}
            onPress={handlePromotionPress}
          />
        </View>
      ))}
    </View>
  ), [numColumns, handlePromotionPress]);

  // Vista vacía genérica
  const renderEmpty = (message: string) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing['2xl'], paddingHorizontal: spacing.lg }}>
      <Store size={48} color={colors.text.tertiary} strokeWidth={1.5} />
      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text.primary, textAlign: 'center', marginTop: spacing.sm }}>
        {message}
      </Text>
      <Text style={{ fontSize: 12, color: colors.text.secondary, textAlign: 'center', marginTop: spacing.xs }}>
        Intenta ajustar los filtros de búsqueda
      </Text>
    </View>
  );

  // Renderizar contenido de comercios con secciones por ubicación
  const renderBusinessesContent = () => {
    if (isBusinessesLoading && businesses.length === 0) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color={colors.primary[600]} />
        </View>
      );
    }

    // Sin ubicación activa → mostrar lista normal
    if (!businessSplit.hasLocation) {
      return (
        <BusinessesList
          data={businesses}
          numColumns={numColumns}
          listKey={businessesListKey}
          isRefreshing={isManualRefreshing}
          onRefresh={handleManualRefresh}
        />
      );
    }

    // Con ubicación activa → mostrar 2 secciones
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isManualRefreshing}
            onRefresh={handleManualRefresh}
            colors={[colors.primary[500]]}
            tintColor={colors.primary[500]}
          />
        }
        contentContainerStyle={{ paddingBottom: spacing['2xl'] }}
      >
        {businesses.length === 0 ? (
          renderEmpty('No hay comercios disponibles')
        ) : (
          <>
            {/* Sección local */}
            {businessSplit.local.length > 0 && (
              <>
                <LocationSectionHeader
                  type="local"
                  locationName={businessSplit.locationName}
                  count={businessSplit.local.length}
                  entityLabel="comercios"
                />
                {renderBusinessGrid(businessSplit.local)}
              </>
            )}

            {/* Si no hay coincidencias locales, mostrar placeholder antes de otros */}
            {businessSplit.local.length === 0 && businessSplit.others.length > 0 && (
              <NoLocalResultsPlaceholder
                locationName={businessSplit.locationName}
                entityLabel="comercios"
              />
            )}

            {/* Sección otros lugares */}
            {businessSplit.others.length > 0 && (
              <>
                <LocationSectionHeader
                  type="others"
                  count={businessSplit.others.length}
                  entityLabel="comercios"
                />
                {renderBusinessGrid(businessSplit.others)}
              </>
            )}
          </>
        )}
      </ScrollView>
    );
  };

  // Renderizar contenido de promociones con secciones por ubicación
  const renderPromotionsContent = () => {
    if (isPromotionsLoading && promotions.length === 0) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color={colors.primary[600]} />
        </View>
      );
    }

    // Sin ubicación activa → mostrar lista normal
    if (!promotionSplit.hasLocation) {
      return (
        <PromotionsPublicList
          data={promotions}
          numColumns={numColumns}
          listKey={promotionsListKey}
          isRefreshing={isManualRefreshing}
          onRefresh={handleManualRefresh}
          onPromotionPress={handlePromotionPress}
        />
      );
    }

    // Con ubicación activa → dividir en secciones
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isManualRefreshing}
            onRefresh={handleManualRefresh}
            colors={[colors.primary[500]]}
            tintColor={colors.primary[500]}
          />
        }
        contentContainerStyle={{ paddingBottom: spacing['2xl'] }}
      >
        {promotions.length === 0 ? (
          renderEmpty('No hay promociones disponibles')
        ) : (
          <>
            {/* Sección local */}
            {promotionSplit.local.length > 0 && (
              <>
                <LocationSectionHeader
                  type="local"
                  locationName={promotionSplit.locationName}
                  count={promotionSplit.local.length}
                  entityLabel="ofertas"
                />
                {renderPromotionGrid(promotionSplit.local)}
              </>
            )}

            {/* Si no hay coincidencias locales */}
            {promotionSplit.local.length === 0 && promotionSplit.others.length > 0 && (
              <NoLocalResultsPlaceholder
                locationName={promotionSplit.locationName}
                entityLabel="ofertas"
              />
            )}

            {/* Sección otros lugares */}
            {promotionSplit.others.length > 0 && (
              <>
                <LocationSectionHeader
                  type="others"
                  count={promotionSplit.others.length}
                  entityLabel="ofertas"
                />
                {renderPromotionGrid(promotionSplit.others)}
              </>
            )}
          </>
        )}
      </ScrollView>
    );
  };

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
        {activeTab === 'commerces' ? renderBusinessesContent() : renderPromotionsContent()}
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
