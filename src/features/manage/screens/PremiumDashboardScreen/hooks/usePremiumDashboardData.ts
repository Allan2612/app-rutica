import { useState, useEffect } from 'react';
import { usePremiumDashboardStats } from '@/hooks/usePremiumDashboard';
import { useContactClicksStats, useUserBusinessOptions } from '@/hooks/useContactClicks';
import { useReviewDashboardStats } from '@/hooks/useReviewStats';
import { useFavoritesChartData, useContactsChartData, useReviewsChartData } from '.';
import type { ContactType } from '@/services/contactClicks.service';
import type { TabType, PeriodType, ReviewType } from '@/types/entities/premium';

export function usePremiumDashboardData() {
  // Estados de tabs y filtros
  const [activeTab, setActiveTab] = useState<TabType>('favorites');
  const [contactPeriod, setContactPeriod] = useState<PeriodType>(30);
  const [favoritesPeriod, setFavoritesPeriod] = useState<PeriodType>(30);
  const [reviewPeriod, setReviewPeriod] = useState<PeriodType>(30);
  const [reviewType, setReviewType] = useState<ReviewType>('all');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [selectedFavoritesBusinessId, setSelectedFavoritesBusinessId] = useState<string | null>(null);
  const [selectedReviewBusinessId, setSelectedReviewBusinessId] = useState<string | null>(null);
  const [visibleContactTypes, setVisibleContactTypes] = useState<Set<ContactType>>(new Set());

  // Queries
  const { data: stats, isLoading } = usePremiumDashboardStats(selectedFavoritesBusinessId, favoritesPeriod);
  const { data: businessOptions, isLoading: isLoadingBusinessOptions } = useUserBusinessOptions();
  const { data: contactStats, isLoading: isLoadingContacts } = useContactClicksStats(contactPeriod, selectedBusinessId);
  const { data: reviewStats, isLoading: isLoadingReviews } = useReviewDashboardStats(selectedReviewBusinessId, reviewPeriod);

  const isLoadingAll = isLoading || isLoadingContacts || isLoadingReviews;

  // Inicializar todos los tipos de contacto como visibles
  useEffect(() => {
    if (contactStats?.clicksByType && visibleContactTypes.size === 0) {
      const allTypes = new Set(contactStats.clicksByType.map(item => item.contactType));
      setVisibleContactTypes(allTypes);
    }
  }, [contactStats?.clicksByType]);

  // Datos procesados de gráficas
  const { peakDay, barChartData, lineChartData, pieChartData } = useFavoritesChartData(stats);
  const { contactBarData, contactLineData, contactPieData } = useContactsChartData(
    contactStats,
    visibleContactTypes,
    contactPeriod
  );
  const { reviewPieData } = useReviewsChartData(reviewStats);

  const isPositiveGrowth = (stats?.growthPercentage ?? 0) >= 0;

  return {
    // Estados
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
  };
}
