import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  View,
  useWindowDimensions,
  Pressable,
  Text,
} from 'react-native';
import { Search, SlidersHorizontal, Store } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  TabSelector,
  TabOption,
  SearchFilterModal,
  SearchFilters,
  LocationSectionHeader,
  NoLocalResultsPlaceholder,
  LoadMoreButton,
} from '@/components/ui';
import { useBusinessCategories } from '@/features/business/hooks/useBusinessCategories';
import { useBusinesses, BusinessListItem } from '@/features/business/hooks/useBusinesses';
import { usePromotions } from '@/features/promotions/hooks';
import { useThemedColors } from '@/hooks';
import { useLocationStore } from '@/store';
import { getLocationDisplayName } from '@/utils/splitItemsByLocation';
import { hasLocation } from '@/services/listQuery';
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
    setCommerceFilters((prev: SearchFilters) => ({ ...prev, location: locationFilter }));
    setPromotionFilters((prev: SearchFilters) => ({ ...prev, location: locationFilter }));
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

  // Con zona elegida se piden dos listas paginadas en el servidor (5.14/5.15):
  // la zona ('only') y el resto ('exclude'). Sin zona, 'others' trae todo.
  const withLocation = hasLocation(locationFilter);
  const locationName = getLocationDisplayName(locationFilter);
  const businessScope = {
    searchText: commerceFilters.searchText,
    categoryIds: commerceFilters.categoryIds,
    location: locationFilter,
  };
  const localBusinesses = useBusinesses({
    ...businessScope,
    locationMode: 'only',
    enabled: activeTab === 'commerces' && withLocation,
  });
  const otherBusinesses = useBusinesses({
    ...businessScope,
    locationMode: 'exclude',
    enabled: activeTab === 'commerces',
  });

  const promotionScope = {
    searchText: promotionFilters.searchText,
    categoryIds: promotionFilters.categoryIds,
    location: locationFilter,
  };
  const localPromotions = usePromotions({
    ...promotionScope,
    locationMode: 'only',
    enabled: activeTab === 'promotions' && withLocation,
  });
  const otherPromotions = usePromotions({
    ...promotionScope,
    locationMode: 'exclude',
    enabled: activeTab === 'promotions',
  });

  const isBusinessesLoading =
    otherBusinesses.isLoading || (withLocation && localBusinesses.isLoading);
  const isPromotionsLoading =
    otherPromotions.isLoading || (withLocation && localPromotions.isLoading);
  const businessCount = localBusinesses.data.length + otherBusinesses.data.length;
  const promotionCount = localPromotions.data.length + otherPromotions.data.length;

  // Estado para controlar el pull-to-refresh manualmente
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const handleManualRefresh = useCallback(async () => {
    setIsManualRefreshing(true);
    try {
      if (activeTab === 'commerces') {
        await Promise.all([localBusinesses.refetch(), otherBusinesses.refetch()]);
      } else {
        await Promise.all([localPromotions.refetch(), otherPromotions.refetch()]);
      }
    } finally {
      setIsManualRefreshing(false);
    }
  }, [activeTab, localBusinesses, otherBusinesses, localPromotions, otherPromotions]);

  const currentFilters = activeTab === 'commerces' ? commerceFilters : promotionFilters;
  const hasActiveFilters =
    currentFilters.searchText !== '' ||
    currentFilters.categoryIds.length > 0 ||
    Boolean(
      currentFilters.location?.province ||
      currentFilters.location?.canton ||
      currentFilters.location?.district,
    );

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
          backgroundColor: hasActiveFilters ? colors.primary[500] : colors.background.secondary,
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
  const renderBusinessGrid = useCallback(
    (items: BusinessListItem[]) => (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: spacing.md,
          gap: spacing.sm,
          paddingBottom: spacing.sm,
        }}
      >
        {items.map((item) => (
          <View
            key={item.id}
            style={{
              width: numColumns === 1 ? '100%' : numColumns === 2 ? '48.5%' : '32%',
              marginBottom: spacing.xs,
            }}
          >
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
    ),
    [numColumns, handleBusinessPress],
  );

  // Renderizar grid de promociones sin FlatList
  const renderPromotionGrid = useCallback(
    (items: PromotionListItem[]) => (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: spacing.md,
          gap: spacing.sm,
          paddingBottom: spacing.sm,
        }}
      >
        {items.map((item) => (
          <View
            key={item.id}
            style={{
              width: numColumns === 1 ? '100%' : numColumns === 2 ? '48.5%' : '32%',
              marginBottom: spacing.xs,
            }}
          >
            <PromotionPublicCard promotion={item} onPress={handlePromotionPress} />
          </View>
        ))}
      </View>
    ),
    [numColumns, handlePromotionPress],
  );

  // Vista vacía genérica
  const renderEmpty = (message: string) => (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing['2xl'],
        paddingHorizontal: spacing.lg,
      }}
    >
      <Store size={48} color={colors.text.tertiary} strokeWidth={1.5} />
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: colors.text.primary,
          textAlign: 'center',
          marginTop: spacing.sm,
        }}
      >
        {message}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: colors.text.secondary,
          textAlign: 'center',
          marginTop: spacing.xs,
        }}
      >
        Intenta ajustar los filtros de búsqueda
      </Text>
    </View>
  );

  // Renderizar contenido de comercios con secciones por ubicación
  const renderBusinessesContent = () => {
    if (isBusinessesLoading && businessCount === 0) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color={colors.primary[600]} />
        </View>
      );
    }

    // Sin ubicación activa → mostrar lista normal
    if (!withLocation) {
      return (
        <BusinessesList
          data={otherBusinesses.data}
          onEndReached={otherBusinesses.hasNextPage ? otherBusinesses.fetchNextPage : undefined}
          footer={
            <LoadMoreButton
              isLoading={otherBusinesses.isFetchingNextPage}
              onPress={otherBusinesses.fetchNextPage}
            />
          }
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
        {businessCount === 0 ? (
          renderEmpty('No hay comercios disponibles')
        ) : (
          <>
            {/* Sección local */}
            {localBusinesses.data.length > 0 && (
              <>
                <LocationSectionHeader
                  type="local"
                  locationName={locationName}
                  count={localBusinesses.total}
                  entityLabel="comercios"
                />
                {renderBusinessGrid(localBusinesses.data)}
                <LoadMoreButton
                  hasMore={localBusinesses.hasNextPage}
                  isLoading={localBusinesses.isFetchingNextPage}
                  onPress={localBusinesses.fetchNextPage}
                  entityLabel={`comercios en ${locationName}`}
                />
              </>
            )}

            {/* Si no hay coincidencias locales, mostrar placeholder antes de otros */}
            {localBusinesses.data.length === 0 && otherBusinesses.data.length > 0 && (
              <NoLocalResultsPlaceholder
                locationName={locationName}
                entityLabel="comercios"
              />
            )}

            {/* Sección otros lugares */}
            {otherBusinesses.data.length > 0 && (
              <>
                <LocationSectionHeader
                  type="others"
                  count={otherBusinesses.total}
                  entityLabel="comercios"
                />
                {renderBusinessGrid(otherBusinesses.data)}
                <LoadMoreButton
                  hasMore={otherBusinesses.hasNextPage}
                  isLoading={otherBusinesses.isFetchingNextPage}
                  onPress={otherBusinesses.fetchNextPage}
                  entityLabel="comercios"
                />
              </>
            )}
          </>
        )}
      </ScrollView>
    );
  };

  // Renderizar contenido de promociones con secciones por ubicación
  const renderPromotionsContent = () => {
    if (isPromotionsLoading && promotionCount === 0) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color={colors.primary[600]} />
        </View>
      );
    }

    // Sin ubicación activa → mostrar lista normal
    if (!withLocation) {
      return (
        <PromotionsPublicList
          data={otherPromotions.data}
          onEndReached={otherPromotions.hasNextPage ? otherPromotions.fetchNextPage : undefined}
          footer={
            <LoadMoreButton
              isLoading={otherPromotions.isFetchingNextPage}
              onPress={otherPromotions.fetchNextPage}
            />
          }
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
        {promotionCount === 0 ? (
          renderEmpty('No hay promociones disponibles')
        ) : (
          <>
            {/* Sección local */}
            {localPromotions.data.length > 0 && (
              <>
                <LocationSectionHeader
                  type="local"
                  locationName={locationName}
                  count={localPromotions.total}
                  entityLabel="ofertas"
                />
                {renderPromotionGrid(localPromotions.data)}
                <LoadMoreButton
                  hasMore={localPromotions.hasNextPage}
                  isLoading={localPromotions.isFetchingNextPage}
                  onPress={localPromotions.fetchNextPage}
                  entityLabel={`ofertas en ${locationName}`}
                />
              </>
            )}

            {/* Si no hay coincidencias locales */}
            {localPromotions.data.length === 0 && otherPromotions.data.length > 0 && (
              <NoLocalResultsPlaceholder
                locationName={locationName}
                entityLabel="ofertas"
              />
            )}

            {/* Sección otros lugares */}
            {otherPromotions.data.length > 0 && (
              <>
                <LocationSectionHeader
                  type="others"
                  count={otherPromotions.total}
                  entityLabel="ofertas"
                />
                {renderPromotionGrid(otherPromotions.data)}
                <LoadMoreButton
                  hasMore={otherPromotions.hasNextPage}
                  isLoading={otherPromotions.isFetchingNextPage}
                  onPress={otherPromotions.fetchNextPage}
                  entityLabel="ofertas"
                />
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
