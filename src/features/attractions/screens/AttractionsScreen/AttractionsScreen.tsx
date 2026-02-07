import { memo, useState, useEffect, useMemo } from 'react';
import { View, ActivityIndicator, Pressable } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { TabSelector, TabOption, SearchFilterModal, SearchFilters } from '@/components/ui';
import { AttractionsList } from '@/components/attractions';
import { EventsList } from '@/components/events';
import { useThemedColors } from '@/hooks';
import { useLocationStore } from '@/store';
import { useCategories } from '@/hooks/useCategories';
import { useAttractions } from '@/features/attractions/hooks/useAttractions';
import { useEvents } from '@/features/events/hooks/useEvents';
import { styles } from './styles';

const ATTRACTION_TABS: TabOption[] = [
  { id: 'attractions', label: 'Atracciones' },
  { id: 'events', label: 'Eventos' },
];

export const AttractionsScreen = memo(function AttractionsScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState(tab === 'events' ? 'events' : 'attractions');
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const { location } = useLocationStore();

  // Actualizar tab cuando cambia el parámetro
  useEffect(() => {
    if (tab === 'events' || tab === 'attractions') {
      setActiveTab(tab);
    }
  }, [tab]);
  
  // Filtros para atracciones
  const [attractionFilters, setAttractionFilters] = useState<SearchFilters>({
    searchText: '',
    categoryIds: [],
    location: null,
  });
  
  // Filtros para eventos
  const [eventFilters, setEventFilters] = useState<SearchFilters>({
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
    setAttractionFilters(prev => ({ ...prev, location: locationFilter }));
    setEventFilters(prev => ({ ...prev, location: locationFilter }));
  }, [locationFilter]);
  
  const colors = useThemedColors();

  const { data: categories = [] } = useCategories();
  
  const {
    data: attractions = [],
    isLoading: isAttractionsLoading,
    refetch: refetchAttractions,
    isRefetching: isAttractionsRefetching,
  } = useAttractions({
    searchText: attractionFilters.searchText,
    categoryIds: attractionFilters.categoryIds,
    province: attractionFilters.location?.province || undefined,
    canton: attractionFilters.location?.canton || undefined,
    district: attractionFilters.location?.district || undefined,
    enabled: activeTab === 'attractions',
  });

  const {
    data: events = [],
    isLoading: isEventsLoading,
    refetch: refetchEvents,
    isRefetching: isEventsRefetching,
  } = useEvents({
    searchText: eventFilters.searchText,
    categoryIds: eventFilters.categoryIds,
    province: eventFilters.location?.province || undefined,
    canton: eventFilters.location?.canton || undefined,
    district: eventFilters.location?.district || undefined,
    upcoming: true,
  });

  const currentFilters = activeTab === 'attractions' ? attractionFilters : eventFilters;
  const hasActiveFilters = 
    currentFilters.searchText !== '' || 
    currentFilters.categoryIds.length > 0 ||
    Boolean(currentFilters.location?.province || currentFilters.location?.canton || currentFilters.location?.district);

  const handleApplyFilters = (filters: SearchFilters) => {
    if (activeTab === 'attractions') {
      setAttractionFilters(filters);
    } else {
      setEventFilters(filters);
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
        tabs={ATTRACTION_TABS} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        rightElement={SearchButton}
      />

      {/* Contenido */}
      <View style={[styles.content, { backgroundColor: colors.background.secondary }]}>
        {activeTab === 'attractions' ? (
          isAttractionsLoading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" color={colors.primary[600]} />
            </View>
          ) : (
            <AttractionsList 
              data={attractions}
              isRefreshing={isAttractionsRefetching}
              onRefresh={() => refetchAttractions()}
            />
          )
        ) : (
          <EventsList
            events={events}
            isLoading={isEventsLoading}
            isRefreshing={isEventsRefetching}
            onRefresh={() => refetchEvents()}
            emptyMessage="No hay eventos próximos disponibles"
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
        placeholder={activeTab === 'attractions' ? 'Buscar atracciones...' : 'Buscar eventos...'}
        title={activeTab === 'attractions' ? 'Buscar Atracciones' : 'Buscar Eventos'}
      />
    </View>
  );
});
