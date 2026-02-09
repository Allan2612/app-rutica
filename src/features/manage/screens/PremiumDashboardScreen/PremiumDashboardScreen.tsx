import { memo } from 'react';
import { View, ScrollView, ActivityIndicator, Text, Platform } from 'react-native';
import { Store } from 'lucide-react-native';
import { useThemedColors, useRefreshOnFocus } from '@/hooks';
import { DashboardHeader } from './components';
import { FavoritesTab, ContactsTab, ReviewsTab } from './tabs';
import { usePremiumDashboardData } from './hooks/usePremiumDashboardData';
import { styles } from './styles';
import type { ContactType } from '@/services/contactClicks.service';

export const PremiumDashboardScreen = memo(function PremiumDashboardScreen() {
  const colors = useThemedColors();
  const {
    // Estados de tabs y filtros
    activeTab,
    setActiveTab,
    contactPeriod,
    setContactPeriod,
    favoritesPeriod,
    setFavoritesPeriod,
    reviewPeriod,
    setReviewPeriod,
    reviewType,
    setReviewType,
    selectedBusinessId,
    setSelectedBusinessId,
    selectedFavoritesBusinessId,
    setSelectedFavoritesBusinessId,
    selectedReviewBusinessId,
    setSelectedReviewBusinessId,
    visibleContactTypes,
    setVisibleContactTypes,

    // Datos
    stats,
    businessOptions,
    contactStats,
    reviewStats,

    // Datos procesados
    peakDay,
    barChartData,
    lineChartData,
    pieChartData,
    contactBarData,
    contactLineData,
    contactPieData,
    reviewPieData,

    // Estados derivados
    isLoadingAll,
    isPositiveGrowth,

    // Refetch
    refetchAll,
  } = usePremiumDashboardData();

  // Refrescar datos cuando la pantalla recibe foco
  useRefreshOnFocus(refetchAll);

  const handleToggleContactType = (type: ContactType) => {
    const newVisible = new Set(visibleContactTypes);
    if (newVisible.has(type)) {
      newVisible.delete(type);
    } else {
      newVisible.add(type);
    }
    setVisibleContactTypes(newVisible);
  };

  // Normalizar businessOptions: convertir null a undefined
  const normalizedBusinessOptions = businessOptions?.map((opt) => ({
    ...opt,
    logoUrl: opt.logoUrl ?? undefined,
  }));

  // Normalizar stats: convertir null a undefined
  const normalizedStats = stats
    ? {
        ...stats,
        topBusiness: stats.topBusiness
          ? {
              ...stats.topBusiness,
              logoUrl: stats.topBusiness.logoUrl ?? undefined,
            }
          : undefined,
        businessesStats: stats.businessesStats.map((bs) => ({
          ...bs,
          logoUrl: bs.logoUrl ?? undefined,
        })),
      }
    : undefined;

  // Normalizar contactStats: convertir null a undefined
  const normalizedContactStats = contactStats
    ? {
        ...contactStats,
        topContactType: contactStats.topContactType ?? undefined,
      }
    : undefined;

  // Normalizar reviewStats: convertir null a undefined
  const normalizedReviewStats = reviewStats
    ? {
        ...reviewStats,
        businessesStats: reviewStats.businessesStats.map((bs) => ({
          ...bs,
          logoUrl: bs.logoUrl ?? undefined,
        })),
        recentReviews: reviewStats.recentReviews.map((rr) => ({
          ...rr,
          comment: rr.comment ?? undefined,
        })),
      }
    : undefined;

  const showTabs = !isLoadingAll && !!stats && stats.totalBusinesses > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      {/* Header */}
      <DashboardHeader
        colors={colors}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showTabs={showTabs}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
        style={Platform.OS === 'web' ? { flex: 1 } : undefined}
      >
        {/* Loading State */}
        {isLoadingAll && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
              Cargando estadísticas...
            </Text>
          </View>
        )}

        {/* Empty State */}
        {!isLoadingAll && (!stats || stats.totalBusinesses === 0) && (
          <View style={styles.emptyContainer}>
            <Store color={colors.text.tertiary} size={64} strokeWidth={1.5} />
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
              Sin negocios registrados
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
              Crea tu primer negocio para empezar a ver estadísticas.
            </Text>
          </View>
        )}

        {/* Dashboard Content */}
        {!isLoadingAll && stats && stats.totalBusinesses > 0 && (
          <>
            {/* Tab: Favoritos */}
            {activeTab === 'favorites' && (
              <FavoritesTab
                colors={colors}
                businessOptions={normalizedBusinessOptions}
                selectedBusinessId={selectedFavoritesBusinessId}
                onSelectBusiness={setSelectedFavoritesBusinessId}
                period={favoritesPeriod}
                onPeriodChange={setFavoritesPeriod}
                stats={normalizedStats!}
                peakDay={peakDay}
                lineChartData={lineChartData}
                barChartData={barChartData}
                pieChartData={pieChartData}
                isPositiveGrowth={isPositiveGrowth}
              />
            )}

            {/* Tab: Interacciones */}
            {activeTab === 'contacts' && (
              <ContactsTab
                colors={colors}
                businessOptions={normalizedBusinessOptions}
                selectedBusinessId={selectedBusinessId}
                onSelectBusiness={setSelectedBusinessId}
                period={contactPeriod}
                onPeriodChange={setContactPeriod}
                contactStats={normalizedContactStats}
                contactLineData={contactLineData}
                contactBarData={contactBarData}
                contactPieData={contactPieData}
                visibleContactTypes={visibleContactTypes}
                onToggleContactType={handleToggleContactType}
              />
            )}

            {/* Tab: Reseñas */}
            {activeTab === 'reviews' && (
              <ReviewsTab
                colors={colors}
                businessOptions={normalizedBusinessOptions}
                selectedBusinessId={selectedReviewBusinessId}
                onSelectBusiness={setSelectedReviewBusinessId}
                period={reviewPeriod}
                onPeriodChange={setReviewPeriod}
                reviewType={reviewType}
                onReviewTypeChange={setReviewType}
                reviewStats={normalizedReviewStats}
                reviewPieData={reviewPieData}
              />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
});
