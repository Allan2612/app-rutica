import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  Text,
  Platform,
} from 'react-native';
import { Search, SlidersHorizontal, MapPin as MapPinIcon } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  TabSelector,
  TabOption,
  SearchFilterModal,
  SearchFilters,
  LocationSectionHeader,
  NoLocalResultsPlaceholder,
  LoadMoreButton,
} from '@/components/ui';
import { AttractionPost } from '@/components/attractions/AttractionPost';
import { AttractionsList } from '@/components/attractions';
import { EventPost } from '@/components/events/EventPost';
import { EventsList } from '@/components/events';
import { useThemedColors } from '@/hooks';
import { useLocationStore } from '@/store';
import { useCategories } from '@/hooks/useCategories';
import { useAttractions, AttractionListItem } from '@/features/attractions/hooks/useAttractions';
import { useEvents, EventListItem } from '@/features/events/hooks/useEvents';
import { getLocationDisplayName } from '@/utils/splitItemsByLocation';
import { hasLocation } from '@/services/listQuery';
import { spacing } from '@/styles/theme';
import { styles } from './styles';

const ATTRACTION_TABS: TabOption[] = [
  { id: 'attractions', label: 'Atracciones' },
  { id: 'events', label: 'Eventos' },
];

export const AttractionsScreen = memo(function AttractionsScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState(tab === 'events' ? 'events' : 'attractions');
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const location = useLocationStore((s) => s.location);

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
    setAttractionFilters((prev: SearchFilters) => ({ ...prev, location: locationFilter }));
    setEventFilters((prev: SearchFilters) => ({ ...prev, location: locationFilter }));
  }, [locationFilter]);

  const colors = useThemedColors();

  const { data: categories = [] } = useCategories();

  // Con zona elegida se piden dos listas paginadas en el servidor (5.14/5.15):
  // la zona ('only') y el resto ('exclude'). Sin zona, 'others' trae todo.
  const withLocation = hasLocation(locationFilter);
  const locationName = getLocationDisplayName(locationFilter);
  const attractionScope = {
    searchText: attractionFilters.searchText,
    categoryIds: attractionFilters.categoryIds,
    location: locationFilter,
  };
  const localAttractions = useAttractions({
    ...attractionScope,
    locationMode: 'only',
    enabled: activeTab === 'attractions' && withLocation,
  });
  const otherAttractions = useAttractions({
    ...attractionScope,
    locationMode: 'exclude',
    enabled: activeTab === 'attractions',
  });

  const eventScope = {
    searchText: eventFilters.searchText,
    categoryIds: eventFilters.categoryIds,
    upcoming: true,
    location: locationFilter,
  };
  const localEvents = useEvents({
    ...eventScope,
    locationMode: 'only',
    enabled: activeTab === 'events' && withLocation,
  });
  const otherEvents = useEvents({
    ...eventScope,
    locationMode: 'exclude',
    enabled: activeTab === 'events',
  });

  const isAttractionsLoading =
    otherAttractions.isLoading || (withLocation && localAttractions.isLoading);
  const isEventsLoading = otherEvents.isLoading || (withLocation && localEvents.isLoading);
  const attractionCount = localAttractions.data.length + otherAttractions.data.length;
  const eventCount = localEvents.data.length + otherEvents.data.length;

  // Estado para controlar el pull-to-refresh manualmente
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const handleManualRefresh = useCallback(async () => {
    setIsManualRefreshing(true);
    try {
      if (activeTab === 'attractions') {
        await Promise.all([localAttractions.refetch(), otherAttractions.refetch()]);
      } else {
        await Promise.all([localEvents.refetch(), otherEvents.refetch()]);
      }
    } finally {
      setIsManualRefreshing(false);
    }
  }, [activeTab, localAttractions, otherAttractions, localEvents, otherEvents]);

  const currentFilters = activeTab === 'attractions' ? attractionFilters : eventFilters;
  const hasActiveFilters =
    currentFilters.searchText !== '' ||
    currentFilters.categoryIds.length > 0 ||
    Boolean(
      currentFilters.location?.province ||
      currentFilters.location?.canton ||
      currentFilters.location?.district,
    );

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

  // Contenedor para posts (centrado en web)
  const postContainerStyle = {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...(Platform.OS === 'web' && {
      maxWidth: 600,
      alignSelf: 'center' as const,
      width: '100%' as const,
    }),
  };

  // Renderizar items de atracciones
  const renderAttractionItems = (items: AttractionListItem[]) => (
    <View style={postContainerStyle}>
      {items.map((item) => (
        <AttractionPost
          key={item.id}
          attractionId={item.id}
          name={item.name}
          description={item.description}
          categoryNames={item.categoryNames}
          categoryIds={item.categoryIds}
          locationLabel={item.locationLabel}
          latitude={item.latitude}
          longitude={item.longitude}
          imageUrls={item.imageUrls}
          authorName={item.authorName ?? undefined}
          authorAvatarUrl={item.authorAvatarUrl}
          rating={item.rating}
          reviewCount={item.reviewCount}
          isApproved={item.isApproved}
          createdAt={item.createdAt}
        />
      ))}
    </View>
  );

  // Renderizar items de eventos
  const renderEventItems = (items: EventListItem[]) => (
    <View style={postContainerStyle}>
      {items.map((item) => (
        <EventPost
          key={item.id}
          eventId={item.id}
          name={item.name}
          description={item.description}
          startAt={item.startAt}
          endAt={item.endAt}
          isFree={item.isFree}
          price={item.price}
          currency={item.currency}
          capacity={item.capacity}
          categoryNames={item.categoryNames}
          categoryIds={item.categoryIds}
          locationLabel={item.locationLabel}
          latitude={item.latitude}
          longitude={item.longitude}
          imageUrls={item.imageUrls}
          authorName={item.authorName}
          authorAvatarUrl={item.authorAvatarUrl}
          isApproved={item.isApproved}
          createdAt={item.createdAt}
          contactPhone={item.contactPhone}
          contactEmail={item.contactEmail}
          website={item.website}
          socialLinks={item.socialLinks}
          rating={item.rating}
          reviewCount={item.reviewCount}
        />
      ))}
    </View>
  );

  // Vista vacía
  const renderEmpty = (message: string) => (
    <View style={styles.placeholder}>
      <MapPinIcon size={48} color={colors.text.tertiary} strokeWidth={1.5} />
      <Text style={[styles.placeholderTitle, { color: colors.text.primary }]}>{message}</Text>
      <Text style={[styles.placeholderSubtitle, { color: colors.text.secondary }]}>
        Intenta ajustar los filtros de búsqueda
      </Text>
    </View>
  );

  // Renderizar contenido de atracciones con secciones
  const renderAttractionsContent = () => {
    if (isAttractionsLoading && attractionCount === 0) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color={colors.primary[600]} />
        </View>
      );
    }

    // Sin ubicación activa → lista normal
    if (!withLocation) {
      return (
        <AttractionsList
          data={otherAttractions.data}
          onEndReached={otherAttractions.hasNextPage ? otherAttractions.fetchNextPage : undefined}
          footer={
            <LoadMoreButton
              isLoading={otherAttractions.isFetchingNextPage}
              onPress={otherAttractions.fetchNextPage}
            />
          }
          isRefreshing={isManualRefreshing}
          onRefresh={handleManualRefresh}
        />
      );
    }

    // Con ubicación activa → 2 secciones
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
        {attractionCount === 0 ? (
          renderEmpty('No hay atracciones disponibles')
        ) : (
          <>
            {localAttractions.data.length > 0 && (
              <>
                <LocationSectionHeader
                  type="local"
                  locationName={locationName}
                  count={localAttractions.total}
                  entityLabel="atracciones"
                />
                {renderAttractionItems(localAttractions.data)}
                <LoadMoreButton
                  hasMore={localAttractions.hasNextPage}
                  isLoading={localAttractions.isFetchingNextPage}
                  onPress={localAttractions.fetchNextPage}
                  entityLabel={`atracciones en ${locationName}`}
                />
              </>
            )}

            {localAttractions.data.length === 0 && otherAttractions.data.length > 0 && (
              <NoLocalResultsPlaceholder locationName={locationName} entityLabel="atracciones" />
            )}

            {otherAttractions.data.length > 0 && (
              <>
                <LocationSectionHeader
                  type="others"
                  count={otherAttractions.total}
                  entityLabel="atracciones"
                />
                {renderAttractionItems(otherAttractions.data)}
                <LoadMoreButton
                  hasMore={otherAttractions.hasNextPage}
                  isLoading={otherAttractions.isFetchingNextPage}
                  onPress={otherAttractions.fetchNextPage}
                  entityLabel="atracciones"
                />
              </>
            )}
          </>
        )}
      </ScrollView>
    );
  };

  // Renderizar contenido de eventos con secciones
  const renderEventsContent = () => {
    if (isEventsLoading && eventCount === 0) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color={colors.primary[600]} />
        </View>
      );
    }

    // Sin ubicación activa → lista normal
    if (!withLocation) {
      return (
        <EventsList
          events={otherEvents.data}
          onEndReached={otherEvents.hasNextPage ? otherEvents.fetchNextPage : undefined}
          footer={
            <LoadMoreButton
              isLoading={otherEvents.isFetchingNextPage}
              onPress={otherEvents.fetchNextPage}
            />
          }
          isLoading={false}
          isRefreshing={isManualRefreshing}
          onRefresh={handleManualRefresh}
          emptyMessage="No hay eventos próximos disponibles"
        />
      );
    }

    // Con ubicación activa → 2 secciones
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
        {eventCount === 0 ? (
          renderEmpty('No hay eventos próximos disponibles')
        ) : (
          <>
            {localEvents.data.length > 0 && (
              <>
                <LocationSectionHeader
                  type="local"
                  locationName={locationName}
                  count={localEvents.total}
                  entityLabel="eventos"
                />
                {renderEventItems(localEvents.data)}
                <LoadMoreButton
                  hasMore={localEvents.hasNextPage}
                  isLoading={localEvents.isFetchingNextPage}
                  onPress={localEvents.fetchNextPage}
                  entityLabel={`eventos en ${locationName}`}
                />
              </>
            )}

            {localEvents.data.length === 0 && otherEvents.data.length > 0 && (
              <NoLocalResultsPlaceholder locationName={locationName} entityLabel="eventos" />
            )}

            {otherEvents.data.length > 0 && (
              <>
                <LocationSectionHeader
                  type="others"
                  count={otherEvents.total}
                  entityLabel="eventos"
                />
                {renderEventItems(otherEvents.data)}
                <LoadMoreButton
                  hasMore={otherEvents.hasNextPage}
                  isLoading={otherEvents.isFetchingNextPage}
                  onPress={otherEvents.fetchNextPage}
                  entityLabel="eventos"
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
        tabs={ATTRACTION_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rightElement={SearchButton}
      />

      {/* Contenido */}
      <View style={[styles.content, { backgroundColor: colors.background.secondary }]}>
        {activeTab === 'attractions' ? renderAttractionsContent() : renderEventsContent()}
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
