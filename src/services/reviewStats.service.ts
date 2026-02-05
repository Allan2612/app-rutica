import { supabase } from '@/lib/supabase/client';

// ============================================
// Types
// ============================================

export interface BusinessReviewStats {
  businessId: string;
  businessName: string;
  logoUrl: string | null;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
}

export interface ProductReviewStats {
  productId: string;
  productName: string;
  businessId: string;
  businessName: string;
  averageRating: number;
  totalReviews: number;
}

export interface RatingDistribution {
  stars5: number;
  stars4: number;
  stars3: number;
  stars2: number;
  stars1: number;
}

export interface RecentReview {
  id: string;
  type: 'business' | 'product';
  entityId: string;
  entityName: string;
  rating: number;
  comment: string | null;
  authorName: string;
  createdAt: string;
}

export interface UserReviewDashboardStats {
  totalBusinessReviews: number;
  totalProductReviews: number;
  overallAverageRating: number;
  businessesStats: BusinessReviewStats[];
  topProducts: ProductReviewStats[];
  recentReviews: RecentReview[];
  ratingTrend: RatingTrendPoint[];
}

export interface RatingTrendPoint {
  date: string;
  label: string;
  averageRating: number;
  count: number;
}

// ============================================
// Internal Types
// ============================================

interface BusinessQueryResult {
  id_bus: string;
  name_bus: string | null;
  business_images: { path_bim: string }[] | null;
}

interface BusinessReviewQueryResult {
  id_brv: string;
  business_id_brv: string;
  rating_brv: number;
  comment_brv: string | null;
  created_at_brv: string;
  profiles: {
    first_name_prf: string | null;
    last_name1_prf: string | null;
  } | null;
}

interface ProductQueryResult {
  id_prd: string;
  name_prd: string | null;
  business_id_prd: string;
  avg_rating_prd: number | null;
  review_count_prd: number | null;
  businesses: {
    name_bus: string | null;
  } | null;
}

interface ProductReviewQueryResult {
  id_prv: string;
  product_id_prv: string;
  rating_prv: number;
  comment_prv: string | null;
  created_at_prv: string;
  profiles: {
    first_name_prf: string | null;
    last_name1_prf: string | null;
  } | null;
  products: {
    name_prd: string | null;
  } | null;
}

// ============================================
// Helpers
// ============================================

function getLogoUrl(images: { path_bim: string }[] | null): string | null {
  if (!images || images.length === 0) return null;
  const logoImage = images.find((img) => img.path_bim.includes('logo-'));
  if (!logoImage) return null;

  const { data } = supabase.storage
    .from('business-images')
    .getPublicUrl(logoImage.path_bim);
  return data.publicUrl;
}

function calculateRatingDistribution(reviews: { rating: number }[]): RatingDistribution {
  const distribution: RatingDistribution = {
    stars5: 0,
    stars4: 0,
    stars3: 0,
    stars2: 0,
    stars1: 0,
  };

  reviews.forEach((review) => {
    const rating = Math.round(review.rating);
    switch (rating) {
      case 5:
        distribution.stars5++;
        break;
      case 4:
        distribution.stars4++;
        break;
      case 3:
        distribution.stars3++;
        break;
      case 2:
        distribution.stars2++;
        break;
      case 1:
        distribution.stars1++;
        break;
    }
  });

  return distribution;
}

// ============================================
// Services
// ============================================

/**
 * Obtiene las estadísticas de reseñas para los negocios del usuario
 */
export async function getUserReviewDashboardStats(
  userId: string,
  businessId: string | null = null,
  days: number = 30
): Promise<UserReviewDashboardStats> {
  // 1. Obtener los negocios del usuario
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

  if (businessError || !businessesData) {
    console.error('[reviewStats] Error fetching businesses:', businessError);
    return getEmptyStats();
  }

  const businesses = businessesData as unknown as BusinessQueryResult[];
  if (businesses.length === 0) {
    return getEmptyStats();
  }

  // Filtrar por negocio específico si se proporciona
  const businessIds = businessId
    ? [businessId]
    : businesses.map((b) => b.id_bus);

  // 2. Obtener reseñas de negocios
  const { data: businessReviewsData, error: reviewsError } = await supabase
    .from('business_reviews')
    .select(`
      id_brv,
      business_id_brv,
      rating_brv,
      comment_brv,
      created_at_brv,
      profiles!business_reviews_user_id_brv_fkey (
        first_name_prf,
        last_name1_prf
      )
    `)
    .in('business_id_brv', businessIds)
    .order('created_at_brv', { ascending: false });

  if (reviewsError) {
    console.error('[reviewStats] Error fetching business reviews:', reviewsError);
  }

  const businessReviews = (businessReviewsData as unknown as BusinessReviewQueryResult[]) ?? [];

  // 3. Obtener productos de los negocios con sus stats
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select(`
      id_prd,
      name_prd,
      business_id_prd,
      avg_rating_prd,
      review_count_prd,
      businesses!products_business_id_prd_fkey (
        name_bus
      )
    `)
    .in('business_id_prd', businessIds)
    .eq('is_active_prd', true)
    .gt('review_count_prd', 0)
    .order('review_count_prd', { ascending: false })
    .limit(10);

  if (productsError) {
    console.error('[reviewStats] Error fetching products:', productsError);
  }

  const products = (productsData as unknown as ProductQueryResult[]) ?? [];

  // 4. Obtener reseñas de productos recientes
  const productIds = products.map((p) => p.id_prd);
  let productReviews: ProductReviewQueryResult[] = [];

  if (productIds.length > 0) {
    const { data: productReviewsData, error: productReviewsError } = await supabase
      .from('product_reviews')
      .select(`
        id_prv,
        product_id_prv,
        rating_prv,
        comment_prv,
        created_at_prv,
        profiles!product_reviews_user_id_prv_fkey (
          first_name_prf,
          last_name1_prf
        ),
        products!product_reviews_product_id_prv_fkey (
          name_prd
        )
      `)
      .in('product_id_prv', productIds)
      .order('created_at_prv', { ascending: false })
      .limit(20);

    if (productReviewsError) {
      console.error('[reviewStats] Error fetching product reviews:', productReviewsError);
    }

    productReviews = (productReviewsData as unknown as ProductReviewQueryResult[]) ?? [];
  }

  // 5. Calcular estadísticas por negocio
  const businessesStats: BusinessReviewStats[] = businesses
    .filter((b) => businessId ? b.id_bus === businessId : true)
    .map((business) => {
      const reviews = businessReviews.filter((r) => r.business_id_brv === business.id_bus);
      const totalReviews = reviews.length;
      const averageRating =
        totalReviews > 0
          ? reviews.reduce((sum, r) => sum + (r.rating_brv || 0), 0) / totalReviews
          : 0;

      return {
        businessId: business.id_bus,
        businessName: business.name_bus ?? 'Sin nombre',
        logoUrl: getLogoUrl(business.business_images),
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        ratingDistribution: calculateRatingDistribution(
          reviews.map((r) => ({ rating: r.rating_brv || 0 }))
        ),
      };
    })
    .sort((a, b) => b.totalReviews - a.totalReviews);

  // 6. Top productos con reseñas
  const topProducts: ProductReviewStats[] = products.map((product) => ({
    productId: product.id_prd,
    productName: product.name_prd ?? 'Sin nombre',
    businessId: product.business_id_prd,
    businessName: product.businesses?.name_bus ?? 'Sin nombre',
    averageRating: Math.round((product.avg_rating_prd ?? 0) * 10) / 10,
    totalReviews: product.review_count_prd ?? 0,
  }));

  // 7. Reseñas recientes combinadas
  const recentReviews: RecentReview[] = [
    ...businessReviews.slice(0, 5).map((r) => {
      const business = businesses.find((b) => b.id_bus === r.business_id_brv);
      const profile = r.profiles;
      const firstName = profile?.first_name_prf ?? '';
      const lastName = profile?.last_name1_prf ?? '';

      return {
        id: r.id_brv,
        type: 'business' as const,
        entityId: r.business_id_brv,
        entityName: business?.name_bus ?? 'Sin nombre',
        rating: r.rating_brv || 0,
        comment: r.comment_brv,
        authorName: [firstName, lastName].filter(Boolean).join(' ') || 'Usuario',
        createdAt: r.created_at_brv,
      };
    }),
    ...productReviews.slice(0, 5).map((r) => {
      const profile = r.profiles;
      const firstName = profile?.first_name_prf ?? '';
      const lastName = profile?.last_name1_prf ?? '';

      return {
        id: r.id_prv,
        type: 'product' as const,
        entityId: r.product_id_prv,
        entityName: r.products?.name_prd ?? 'Sin nombre',
        rating: r.rating_prv || 0,
        comment: r.comment_prv,
        authorName: [firstName, lastName].filter(Boolean).join(' ') || 'Usuario',
        createdAt: r.created_at_prv,
      };
    }),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // 8. Calcular tendencia de ratings (últimos 30 días)
  const ratingTrend = calculateRatingTrend(businessReviews, productReviews, days);

  // 9. Totales
  const totalBusinessReviews = businessReviews.length;
  const totalProductReviews = productReviews.length;
  const allRatings = [
    ...businessReviews.map((r) => r.rating_brv || 0),
    ...productReviews.map((r) => r.rating_prv || 0),
  ];
  const overallAverageRating =
    allRatings.length > 0
      ? Math.round((allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length) * 10) / 10
      : 0;

  return {
    totalBusinessReviews,
    totalProductReviews,
    overallAverageRating,
    businessesStats,
    topProducts,
    recentReviews,
    ratingTrend,
  };
}

function calculateRatingTrend(
  businessReviews: BusinessReviewQueryResult[],
  productReviews: ProductReviewQueryResult[],
  days: number
): RatingTrendPoint[] {
  const { format, subDays } = require('date-fns');
  const { es } = require('date-fns/locale');

  const today = new Date();
  const trend: RatingTrendPoint[] = [];

  // Combinar todas las reseñas con su fecha y rating
  const allReviews = [
    ...businessReviews.map((r) => ({
      date: r.created_at_brv,
      rating: r.rating_brv || 0,
    })),
    ...productReviews.map((r) => ({
      date: r.created_at_prv,
      rating: r.rating_prv || 0,
    })),
  ];

  // Para 90 días, agrupar por mes
  if (days === 90) {
    const monthlyData: { [key: string]: { total: number; count: number; order: number } } = {};
    const monthOrder: { [key: string]: number } = {
      'Ene': 1, 'Feb': 2, 'Mar': 3, 'Abr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Ago': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dic': 12
    };

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateKey = format(date, 'yyyy-MM-dd');
      const monthLabel = format(date, 'MMM', { locale: es });
      const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

      if (!monthlyData[capitalizedMonth]) {
        monthlyData[capitalizedMonth] = {
          total: 0,
          count: 0,
          order: monthOrder[capitalizedMonth] || 0,
        };
      }

      // Buscar reseñas de este día
      allReviews.forEach((review) => {
        const reviewDateKey = format(new Date(review.date), 'yyyy-MM-dd');
        if (reviewDateKey === dateKey) {
          monthlyData[capitalizedMonth].total += review.rating;
          monthlyData[capitalizedMonth].count += 1;
        }
      });
    }

    return Object.entries(monthlyData)
      .map(([label, data]) => ({
        date: '',
        label,
        averageRating: data.count > 0 ? Math.round((data.total / data.count) * 10) / 10 : 0,
        count: data.count,
        order: data.order,
      }))
      .sort((a: any, b: any) => a.order - b.order)
      .map(({ order, ...rest }) => rest);
  }

  // Agrupar por día
  const reviewsByDay = new Map<string, { total: number; count: number }>();

  allReviews.forEach((review) => {
    const dateKey = format(new Date(review.date), 'yyyy-MM-dd');
    const existing = reviewsByDay.get(dateKey) || { total: 0, count: 0 };
    existing.total += review.rating;
    existing.count += 1;
    reviewsByDay.set(dateKey, existing);
  });

  // Generar puntos para los días especificados
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayData = reviewsByDay.get(dateKey);

    // Formato de label según el período
    let label: string;
    if (days <= 7) {
      label = format(date, 'EEE', { locale: es }); // Lun, Mar, etc.
      label = label.charAt(0).toUpperCase() + label.slice(1);
    } else {
      label = format(date, 'd', { locale: es }); // Solo el número del día
    }

    trend.push({
      date: dateKey,
      label,
      averageRating: dayData ? Math.round((dayData.total / dayData.count) * 10) / 10 : 0,
      count: dayData?.count ?? 0,
    });
  }

  return trend;
}

function getEmptyStats(): UserReviewDashboardStats {
  return {
    totalBusinessReviews: 0,
    totalProductReviews: 0,
    overallAverageRating: 0,
    businessesStats: [],
    topProducts: [],
    recentReviews: [],
    ratingTrend: [],
  };
}
