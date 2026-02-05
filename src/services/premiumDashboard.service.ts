import { supabase } from '@/lib/supabase/client';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

// ============================================
// Types
// ============================================

export interface BusinessFavoriteStats {
  businessId: string;
  businessName: string;
  logoUrl: string | null;
  favoriteCount: number;
}

export interface DailyFavoriteTrend {
  date: string;
  label: string;
  count: number;
}

export interface UserDashboardStats {
  totalFavorites: number;
  totalBusinesses: number;
  businessesStats: BusinessFavoriteStats[];
  dailyTrend: DailyFavoriteTrend[];
  topBusiness: BusinessFavoriteStats | null;
  growthPercentage: number;
}

// Tipos internos para las queries
interface BusinessQueryResult {
  id_bus: string;
  name_bus: string | null;
  business_images: { path_bim: string }[] | null;
}

interface LikeQueryResult {
  business_id_blk: string;
  created_at_blk: string;
}

// ============================================
// Services
// ============================================

/**
 * Obtiene las estadísticas de favoritos para los negocios del usuario
 * @param userId - ID del usuario
 * @param businessId - ID del negocio específico (opcional, null = todos)
 * @param days - Número de días para el período (7, 15, 30, 90)
 */
export async function getUserBusinessesFavoriteStats(
  userId: string,
  businessId: string | null = null,
  days: number = 7
): Promise<UserDashboardStats> {
  // 1. Obtener los negocios del usuario con sus imágenes
  const { data: businessesData, error: businessError } = await supabase
    .from('businesses')
    .select(`
      id_bus,
      name_bus,
      business_images (
        path_bim
      )
    `)
    .eq('owner_id_bus', userId)
    .eq('is_active_bus', true);

  if (businessError) {
    console.error('[premiumDashboard] Error fetching businesses:', businessError);
    return {
      totalFavorites: 0,
      totalBusinesses: 0,
      businessesStats: [],
      dailyTrend: [],
      topBusiness: null,
      growthPercentage: 0,
    };
  }

  // Type assertion
  const businesses = businessesData as unknown as BusinessQueryResult[] | null;

  if (!businesses || businesses.length === 0) {
    return {
      totalFavorites: 0,
      totalBusinesses: 0,
      businessesStats: [],
      dailyTrend: [],
      topBusiness: null,
      growthPercentage: 0,
    };
  }

  // 2. Obtener IDs de negocios (filtrar si se especifica uno)
  const businessIds = businessId
    ? [businessId]
    : businesses.map((b) => b.id_bus);

  // 3. Contar favoritos por negocio con fechas
  const { data: likesData, error: likesError } = await supabase
    .from('business_likes')
    .select('business_id_blk, created_at_blk')
    .in('business_id_blk', businessIds);

  if (likesError) {
    console.error('[premiumDashboard] Error fetching likes:', likesError);
  }

  // Type assertion
  const likes = likesData as unknown as LikeQueryResult[] | null;

  // 4. Agrupar likes por negocio
  const likesCountMap = new Map<string, number>();
  (likes ?? []).forEach((like) => {
    const currentCount = likesCountMap.get(like.business_id_blk) || 0;
    likesCountMap.set(like.business_id_blk, currentCount + 1);
  });

  // 5. Calcular tendencia diaria
  const dailyTrend = calculateDailyTrend(likes ?? [], days);

  // 6. Calcular crecimiento (comparar última semana vs semana anterior)
  const growthPercentage = calculateGrowthPercentage(likes ?? []);

  // 7. Obtener URLs de logos
  const getLogoUrl = (images: { path_bim: string }[] | null): string | null => {
    if (!images || images.length === 0) return null;
    // Buscar imagen que sea logo (path contiene 'logo-')
    const logoImage = images.find((img) => img.path_bim.includes('logo-'));
    if (!logoImage) return null;

    const { data } = supabase.storage
      .from('business-images')
      .getPublicUrl(logoImage.path_bim);
    return data.publicUrl;
  };

  // 8. Construir estadísticas por negocio (filtrar si se especifica uno)
  const filteredBusinesses = businessId
    ? businesses.filter(b => b.id_bus === businessId)
    : businesses;

  const businessesStats: BusinessFavoriteStats[] = filteredBusinesses.map((business) => ({
    businessId: business.id_bus,
    businessName: business.name_bus ?? 'Sin nombre',
    logoUrl: getLogoUrl(business.business_images),
    favoriteCount: likesCountMap.get(business.id_bus) || 0,
  }));

  // 9. Ordenar por favoritos (mayor a menor)
  businessesStats.sort((a, b) => b.favoriteCount - a.favoriteCount);

  // 10. Calcular totales
  const totalFavorites = businessesStats.reduce((sum, b) => sum + b.favoriteCount, 0);

  // 11. Top business (solo mostrar si no hay filtro específico)
  const topBusiness = !businessId && businessesStats.length > 0 ? businessesStats[0] : null;

  return {
    totalFavorites,
    totalBusinesses: filteredBusinesses.length,
    businessesStats,
    dailyTrend,
    topBusiness,
    growthPercentage,
  };
}

// ============================================
// Helper Functions
// ============================================

/**
 * Calcula la tendencia diaria de favoritos con hora de mayor actividad
 * @param likes - Lista de likes
 * @param days - Número de días para el período
 */
function calculateDailyTrend(likes: LikeQueryResult[], days: number): DailyFavoriteTrend[] {
  const today = new Date();
  const trend: DailyFavoriteTrend[] = [];

  // Crear mapa de conteo por día
  const countByDay = new Map<string, number>();
  // Crear mapa de conteo por día y hora para encontrar el pico
  const countByDayAndHour = new Map<string, Map<number, number>>();

  likes.forEach((like) => {
    const likeDate = new Date(like.created_at_blk);
    const dateKey = format(likeDate, 'yyyy-MM-dd');
    const hour = likeDate.getHours();

    // Contar por día
    const currentCount = countByDay.get(dateKey) || 0;
    countByDay.set(dateKey, currentCount + 1);

    // Contar por día y hora
    if (!countByDayAndHour.has(dateKey)) {
      countByDayAndHour.set(dateKey, new Map());
    }
    const hourMap = countByDayAndHour.get(dateKey)!;
    const hourCount = hourMap.get(hour) || 0;
    hourMap.set(hour, hourCount + 1);
  });

  // Para 90 días, agrupar por mes
  if (days === 90) {
    const monthlyData: { [key: string]: { count: number; label: string; order: number } } = {};
    const monthOrder: { [key: string]: number } = {
      'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
      'julio': 7, 'agosto': 8, 'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12
    };

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateKey = format(date, 'yyyy-MM-dd');
      const monthLabel = format(date, 'MMMM', { locale: es });
      const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

      if (!monthlyData[capitalizedMonth]) {
        monthlyData[capitalizedMonth] = {
          count: 0,
          label: capitalizedMonth,
          order: monthOrder[capitalizedMonth] || 0,
        };
      }
      monthlyData[capitalizedMonth].count += countByDay.get(dateKey) || 0;
    }

    return Object.values(monthlyData)
      .sort((a, b) => a.order - b.order)
      .map(month => ({
        date: '',
        label: month.label,
        count: month.count,
      }));
  }

  // Generar datos para los días especificados
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateKey = format(date, 'yyyy-MM-dd');

    // Formato de label según el período
    let label: string;
    if (days <= 7) {
      label = format(date, 'EEE', { locale: es }); // Lun, Mar, etc.
      label = label.charAt(0).toUpperCase() + label.slice(1);
    } else {
      label = format(date, 'd', { locale: es }); // Solo el número del día
    }

    const count = countByDay.get(dateKey) || 0;

    // Si hay actividad, encontrar la hora con más favoritos
    if (count > 0 && countByDayAndHour.has(dateKey)) {
      const hourMap = countByDayAndHour.get(dateKey)!;
      let maxHour = 0;
      let maxHourCount = 0;

      hourMap.forEach((hourCount, hour) => {
        if (hourCount > maxHourCount) {
          maxHourCount = hourCount;
          maxHour = hour;
        }
      });

      // Formato: "DD - HH:00" o "Día - HH:00"
      const hourStr = maxHour.toString().padStart(2, '0');
      label = `${label} - ${hourStr}:00`;
    }

    trend.push({
      date: dateKey,
      label,
      count,
    });
  }

  return trend;
}

/**
 * Calcula el porcentaje de crecimiento comparando última semana vs semana anterior
 */
function calculateGrowthPercentage(likes: LikeQueryResult[]): number {
  const today = new Date();
  const oneWeekAgo = subDays(today, 7);
  const twoWeeksAgo = subDays(today, 14);

  let thisWeekCount = 0;
  let lastWeekCount = 0;

  likes.forEach((like) => {
    const likeDate = new Date(like.created_at_blk);

    if (likeDate >= startOfDay(oneWeekAgo) && likeDate <= endOfDay(today)) {
      thisWeekCount++;
    } else if (likeDate >= startOfDay(twoWeeksAgo) && likeDate < startOfDay(oneWeekAgo)) {
      lastWeekCount++;
    }
  });

  if (lastWeekCount === 0) {
    return thisWeekCount > 0 ? 100 : 0;
  }

  return Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
}
