// ============================================
// Admin Verification Service - Refactored
// ============================================

import { supabase } from '@/lib/supabase/client';
import type { ModerationStatus } from '@/types/enums';
import type {
  VerificationEntityType,
  VerificationRequest,
  BusinessVerificationRequest,
  EventVerificationRequest,
  AttractionVerificationRequest,
  PromotionVerificationRequest,
  VerificationFilters,
  VerificationStats,
  UpdateModerationData,
} from '../types';
import {
  STORAGE_BUCKETS,
  getImageUrl,
  getImageTypeFromPath,
  formatLocationFromHierarchy,
  formatFullName,
} from './helpers';

// ============================================
// Fetch Functions - One per entity type
// ============================================

/**
 * Fetch business verification requests
 */
async function fetchBusinessVerifications(
  status: ModerationStatus | 'all',
  search: string,
  limit: number,
): Promise<BusinessVerificationRequest[]> {
  // Obtener el usuario actual
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  // Verificar si el usuario es admin
  let isAdmin = false;
  if (userId) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role_prf, is_active_prf')
      .eq('id_prf', userId)
      .single<{ role_prf: string; is_active_prf: boolean }>();

    isAdmin = profileData?.role_prf === 'admin' && profileData?.is_active_prf === true;
  }

  let query = supabase
    .from('businesses')
    .select(
      `
      id_bus,
      name_bus,
      description_bus,
      moderation_status_bus,
      moderation_note_bus,
      is_active_bus,
      created_at_bus,
      owner_id_bus,
      contact_phone_bus,
      contact_email_bus,
      website_bus,
      social_links_bus,
      avg_rating_bus,
      reviews_count_bus,
      locations!businesses_location_id_bus_fkey (
        address_loc,
        districts!locations_district_id_fkey (
          name_dst,
          cantons!districts_canton_id_fkey (
            name_ctn,
            provinces!cantons_province_id_fkey (
              name_prv
            )
          )
        )
      ),
      business_images (
        path_bim,
        sort_order_bim
      ),
      business_category_map (
        categories (
          name_cat
        )
      ),
      profiles!businesses_owner_id_bus_fkey (
        first_name_prf,
        last_name1_prf,
        last_name2_prf
      )
    `,
    )
    .order('created_at_bus', { ascending: false });

  // IMPORTANTE: Si el usuario NO es admin, filtrar solo sus propios negocios
  if (!isAdmin && userId) {
    query = query.eq('owner_id_bus', userId);
  }

  // Aumentar el límite para admins ya que filtraremos en código
  query = query.limit(isAdmin ? limit * 10 : limit);

  if (search) {
    query = query.ilike('name_bus', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[ADMIN] Error fetching businesses:', error);
    throw error;
  }

  // Si es admin, filtrar por status en JavaScript (para manejar casos donde RLS no filtra correctamente)
  let filteredData = data || [];
  if (isAdmin && status !== 'all') {
    filteredData = filteredData.filter((item: any) => {
      const itemStatus = item.moderation_status_bus || 'pending'; // Si es null, tratarlo como pending
      return itemStatus === status;
    });
  }

  return (filteredData || []).map((item: any) => {
    const images = item.business_images || [];
    const sortedImages = [...images].sort(
      (a: any, b: any) => (a.sort_order_bim || 0) - (b.sort_order_bim || 0),
    );

    // Priorizar cover > logo > primera imagen
    const coverImage = sortedImages.find(
      (img: any) => getImageTypeFromPath(img.path_bim) === 'cover',
    );
    const logoImage = sortedImages.find(
      (img: any) => getImageTypeFromPath(img.path_bim) === 'logo',
    );
    const primaryImage = coverImage || logoImage || sortedImages[0];

    // All images with URLs
    const allImages = sortedImages.map((img: any) => ({
      url: getImageUrl(STORAGE_BUCKETS.businesses, img.path_bim),
      type: getImageTypeFromPath(img.path_bim),
      sortOrder: img.sort_order_bim || 0,
    }));

    const categories = (item.business_category_map || [])
      .map((bcm: any) => bcm.categories?.name_cat)
      .filter(Boolean);

    return {
      id: item.id_bus,
      type: 'business' as const,
      name: item.name_bus || 'Sin nombre',
      description: item.description_bus,
      ownerName: formatFullName(item.profiles, 'Propietario'),
      ownerEmail: '',
      ownerId: item.owner_id_bus,
      imageUrl: primaryImage?.path_bim
        ? getImageUrl(STORAGE_BUCKETS.businesses, primaryImage.path_bim)
        : null,
      images: allImages,
      moderationStatus: item.moderation_status_bus || 'pending',
      moderationNote: item.moderation_note_bus || null,
      isActive: item.is_active_bus ?? true,
      createdAt: item.created_at_bus,
      locationLabel: formatLocationFromHierarchy(item.locations),
      metadata: {
        phone: item.contact_phone_bus,
        email: item.contact_email_bus,
        website: item.website_bus,
        socialLinks: item.social_links_bus || null,
        categoriesNames: categories,
        avgRating: item.avg_rating_bus || 0,
        reviewsCount: item.reviews_count_bus || 0,
      },
    };
  });
}

/**
 * Fetch event verification requests
 */
async function fetchEventVerifications(
  status: ModerationStatus | 'all',
  search: string,
  limit: number,
): Promise<EventVerificationRequest[]> {
  let query = supabase
    .from('events')
    .select(
      `
      id_evt,
      name_evt,
      description_evt,
      moderation_status_evt,
      moderation_note_evt,
      is_active_evt,
      created_at_evt,
      created_by_evt,
      start_at_evt,
      end_at_evt,
      price_evt,
      is_free_evt,
      capacity_evt,
      contact_phone_evt,
      contact_email_evt,
      website_evt,
      social_links_evt,
      ticket_url_evt,
      avg_rating_evt,
      reviews_count_evt,
      locations!events_location_id_evt_fkey (
        address_loc,
        districts!locations_district_id_fkey (
          name_dst,
          cantons!districts_canton_id_fkey (
            name_ctn,
            provinces!cantons_province_id_fkey (
              name_prv
            )
          )
        )
      ),
      event_images (
        path_eim,
        sort_order_eim
      ),
      event_category_map (
        categories (
          name_cat
        )
      ),
      profiles!events_created_by_evt_fkey (
        first_name_prf,
        last_name1_prf,
        last_name2_prf
      )
    `,
    )
    .order('created_at_evt', { ascending: false })
    .limit(limit);

  if (status !== 'all') {
    query = query.eq('moderation_status_evt', status);
  }

  if (search) {
    query = query.ilike('name_evt', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[ADMIN] Error fetching events:', error);
    throw error;
  }

  return (data || []).map((item: any) => {
    const images = item.event_images || [];
    const sortedImages = [...images].sort(
      (a: any, b: any) => (a.sort_order_eim || 0) - (b.sort_order_eim || 0),
    );

    const coverImage = sortedImages.find(
      (img: any) => getImageTypeFromPath(img.path_eim) === 'cover',
    );
    const primaryImage = coverImage || sortedImages[0];

    // All images with URLs
    const allImages = sortedImages.map((img: any) => ({
      url: getImageUrl(STORAGE_BUCKETS.events, img.path_eim),
      type: getImageTypeFromPath(img.path_eim),
      sortOrder: img.sort_order_eim || 0,
    }));

    const categories = (item.event_category_map || [])
      .map((ecm: any) => ecm.categories?.name_cat)
      .filter(Boolean);

    return {
      id: item.id_evt,
      type: 'event' as const,
      name: item.name_evt || 'Sin nombre',
      description: item.description_evt,
      ownerName: formatFullName(item.profiles, 'Creador'),
      ownerEmail: '',
      ownerId: item.created_by_evt,
      imageUrl: primaryImage?.path_eim
        ? getImageUrl(STORAGE_BUCKETS.events, primaryImage.path_eim)
        : null,
      images: allImages,
      moderationStatus: item.moderation_status_evt || 'pending',
      moderationNote: item.moderation_note_evt || null,
      isActive: item.is_active_evt ?? true,
      createdAt: item.created_at_evt,
      locationLabel: formatLocationFromHierarchy(item.locations),
      metadata: {
        startAt: item.start_at_evt,
        endAt: item.end_at_evt,
        price: item.price_evt,
        isFree: item.is_free_evt ?? false,
        capacity: item.capacity_evt,
        phone: item.contact_phone_evt,
        email: item.contact_email_evt,
        website: item.website_evt,
        ticketUrl: item.ticket_url_evt,
        socialLinks: item.social_links_evt || null,
        categoriesNames: categories,
        avgRating: item.avg_rating_evt || 0,
        reviewsCount: item.reviews_count_evt || 0,
      },
    };
  });
}

/**
 * Fetch attraction verification requests
 */
async function fetchAttractionVerifications(
  status: ModerationStatus | 'all',
  search: string,
  limit: number,
): Promise<AttractionVerificationRequest[]> {
  let query = supabase
    .from('attractions')
    .select(
      `
      id_atr,
      name_atr,
      description_atr,
      moderation_status_atr,
      moderation_note_atr,
      is_active_atr,
      created_at_atr,
      submitted_by_atr,
      avg_rating_atr,
      reviews_count_atr,
      locations!attractions_location_id_atr_fkey (
        address_loc,
        districts!locations_district_id_fkey (
          name_dst,
          cantons!districts_canton_id_fkey (
            name_ctn,
            provinces!cantons_province_id_fkey (
              name_prv
            )
          )
        )
      ),
      attraction_images (
        path_aim,
        sort_order_aim
      ),
      attraction_category_map (
        categories (
          name_cat
        )
      ),
      profiles!attractions_submitted_by_atr_fkey (
        first_name_prf,
        last_name1_prf,
        last_name2_prf
      )
    `,
    )
    .order('created_at_atr', { ascending: false })
    .limit(limit);

  if (status !== 'all') {
    query = query.eq('moderation_status_atr', status);
  }

  if (search) {
    query = query.ilike('name_atr', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[ADMIN] Error fetching attractions:', error);
    throw error;
  }

  return (data || []).map((item: any) => {
    const images = item.attraction_images || [];
    const sortedImages = [...images].sort(
      (a: any, b: any) => (a.sort_order_aim || 0) - (b.sort_order_aim || 0),
    );

    const coverImage = sortedImages.find(
      (img: any) => getImageTypeFromPath(img.path_aim) === 'cover',
    );
    const primaryImage = coverImage || sortedImages[0];

    // All images with URLs
    const allImages = sortedImages.map((img: any) => ({
      url: getImageUrl(STORAGE_BUCKETS.attractions, img.path_aim),
      type: getImageTypeFromPath(img.path_aim),
      sortOrder: img.sort_order_aim || 0,
    }));

    const categories = (item.attraction_category_map || [])
      .map((acm: any) => acm.categories?.name_cat)
      .filter(Boolean);

    return {
      id: item.id_atr,
      type: 'attraction' as const,
      name: item.name_atr || 'Sin nombre',
      description: item.description_atr,
      ownerName: formatFullName(item.profiles, 'Colaborador'),
      ownerEmail: '',
      ownerId: item.submitted_by_atr,
      imageUrl: primaryImage?.path_aim
        ? getImageUrl(STORAGE_BUCKETS.attractions, primaryImage.path_aim)
        : null,
      images: allImages,
      moderationStatus: item.moderation_status_atr || 'pending',
      moderationNote: item.moderation_note_atr || null,
      isActive: item.is_active_atr ?? true,
      createdAt: item.created_at_atr,
      locationLabel: formatLocationFromHierarchy(item.locations),
      metadata: {
        categoriesNames: categories,
        avgRating: item.avg_rating_atr || 0,
        reviewsCount: item.reviews_count_atr || 0,
      },
    };
  });
}

/**
 * Fetch promotion verification requests
 */
async function fetchPromotionVerifications(
  status: ModerationStatus | 'all',
  search: string,
  limit: number,
): Promise<PromotionVerificationRequest[]> {
  let query = supabase
    .from('promotions')
    .select(
      `
      id_prm,
      title_prm,
      description_prm,
      moderation_status_prm,
      moderation_note_prm,
      is_active_prm,
      created_at_prm,
      created_by_prm,
      business_id_prm,
      start_at_prm,
      end_at_prm,
      discount_type_prm,
      discount_value_prm,
      scope_prm,
      businesses!promotions_business_id_prm_fkey (
        name_bus,
        locations!businesses_location_id_bus_fkey (
          address_loc,
          districts!locations_district_id_fkey (
            name_dst,
            cantons!districts_canton_id_fkey (
              name_ctn,
              provinces!cantons_province_id_fkey (
                name_prv
              )
            )
          )
        )
      ),
      profiles!promotions_created_by_prm_fkey (
        first_name_prf,
        last_name1_prf,
        last_name2_prf
      ),
      promotion_images (
        path_pim
      ),
      promotion_scope_categories (
        categories (
          name_cat
        )
      ),
      promotion_products (
        products (
          name_prd,
          price_prd
        )
      ),
      promotion_combo_items (
        quantity_pci,
        paid_quantity_pci,
        products (
          name_prd,
          price_prd
        )
      )
    `,
    )
    .order('created_at_prm', { ascending: false })
    .limit(limit);

  if (status !== 'all') {
    query = query.eq('moderation_status_prm', status);
  }

  if (search) {
    query = query.ilike('title_prm', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[ADMIN] Error fetching promotions:', error);
    throw error;
  }

  return (data || []).map((item: any) => {
    const images = item.promotion_images || [];
    const flyerImage = images.find((img: any) => getImageTypeFromPath(img.path_pim) === 'flyer');
    const primaryImage = flyerImage || images[0];

    const businessLocation = item.businesses?.locations;

    const categories = (item.promotion_scope_categories || [])
      .map((psc: any) => psc.categories?.name_cat)
      .filter(Boolean);

    const promotionProducts = (item.promotion_products || [])
      .map((pp: any) => ({
        productName: pp.products?.name_prd || 'Producto',
        price: pp.products?.price_prd,
      }))
      .filter((p: any) => p.productName);

    const comboItems = (item.promotion_combo_items || [])
      .map((pci: any) => ({
        productName: pci.products?.name_prd || 'Producto',
        quantity: pci.quantity_pci,
        paidQuantity: pci.paid_quantity_pci,
        price: pci.products?.price_prd,
      }))
      .filter((ci: any) => ci.productName);

    const allImages = images
      .map((img: any) => ({
        type: getImageTypeFromPath(img.path_pim),
        url: img.path_pim ? getImageUrl(STORAGE_BUCKETS.promotions, img.path_pim) : '',
      }))
      .filter((img: any) => img.url);

    return {
      id: item.id_prm,
      type: 'promotion' as const,
      name: item.title_prm || 'Sin título',
      description: item.description_prm,
      ownerName: formatFullName(item.profiles, 'Usuario'),
      ownerEmail: '',
      ownerId: item.created_by_prm,
      imageUrl: primaryImage?.path_pim
        ? getImageUrl(STORAGE_BUCKETS.promotions, primaryImage.path_pim)
        : null,
      images: allImages,
      moderationStatus: item.moderation_status_prm || 'pending',
      moderationNote: item.moderation_note_prm || null,
      isActive: item.is_active_prm ?? true,
      createdAt: item.created_at_prm,
      locationLabel: formatLocationFromHierarchy(businessLocation),
      businessId: item.business_id_prm,
      metadata: {
        businessId: item.business_id_prm,
        businessName: item.businesses?.name_bus,
        businessLocation: formatLocationFromHierarchy(businessLocation),
        discountType: item.discount_type_prm,
        discountValue: item.discount_value_prm || 0,
        scope: item.scope_prm,
        startAt: item.start_at_prm,
        endAt: item.end_at_prm,
        moderationNote: item.moderation_note_prm,
        categories,
        promotionProducts,
        comboItems,
        images: allImages,
      },
    };
  });
}

// ============================================
// Main Service Functions
// ============================================

/**
 * Get all verification requests with filters
 */
export async function getPendingVerifications(
  filters: VerificationFilters = {},
): Promise<VerificationRequest[]> {
  const { type = 'all', status = 'pending', search = '', page = 1, limit = 50 } = filters;
  const offset = (page - 1) * limit;
  const requests: VerificationRequest[] = [];

  const typesToFetch: VerificationEntityType[] =
    type === 'all' ? ['business', 'event', 'attraction', 'promotion'] : [type];

  // Fetch all types in parallel for better performance
  const fetchPromises = typesToFetch.map(async (entityType) => {
    try {
      switch (entityType) {
        case 'business':
          return await fetchBusinessVerifications(status, search, limit);
        case 'event':
          return await fetchEventVerifications(status, search, limit);
        case 'attraction':
          return await fetchAttractionVerifications(status, search, limit);
        case 'promotion':
          return await fetchPromotionVerifications(status, search, limit);
        default:
          return [];
      }
    } catch (error) {
      console.error(`[ADMIN] Error fetching ${entityType}:`, error);
      return [];
    }
  });

  const results = await Promise.all(fetchPromises);
  results.forEach((r) => requests.push(...r));

  // Sort by createdAt descending
  requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Apply pagination if filtering all types
  if (type === 'all') {
    return requests.slice(offset, offset + limit);
  }

  return requests;
}

/**
 * Get statistics for pending verifications
 */
export async function getVerificationStats(): Promise<VerificationStats> {
  // Traer registros con status 'pending' o NULL (que se tratan como pending)
  const [businesses, events, attractions, promotions] = await Promise.all([
    supabase
      .from('businesses')
      .select('id_bus, moderation_status_bus')
      .or('moderation_status_bus.eq.pending,moderation_status_bus.is.null'),
    supabase
      .from('events')
      .select('id_evt, moderation_status_evt')
      .or('moderation_status_evt.eq.pending,moderation_status_evt.is.null'),
    supabase
      .from('attractions')
      .select('id_atr, moderation_status_atr')
      .or('moderation_status_atr.eq.pending,moderation_status_atr.is.null'),
    supabase
      .from('promotions')
      .select('id_prm, moderation_status_prm')
      .or('moderation_status_prm.eq.pending,moderation_status_prm.is.null'),
  ]);

  const pendingByType = {
    business: businesses.data?.length || 0,
    event: events.data?.length || 0,
    attraction: attractions.data?.length || 0,
    promotion: promotions.data?.length || 0,
  };

  return {
    totalPending:
      pendingByType.business +
      pendingByType.event +
      pendingByType.attraction +
      pendingByType.promotion,
    pendingByType,
  };
}

/**
 * Update moderation status and/or is_active for an entity
 */
export async function updateModerationStatus(data: UpdateModerationData): Promise<void> {
  const { id, type, status, note, isActive } = data;

  // Get current user for reviewed_by field
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const reviewedAt = new Date().toISOString();

  switch (type) {
    case 'business': {
      const updatePayload: Record<string, unknown> = {
        updated_at_bus: reviewedAt,
      };

      if (status !== undefined) {
        updatePayload.moderation_status_bus = status;
        updatePayload.reviewed_by_bus = user.id;
        updatePayload.reviewed_at_bus = reviewedAt;
        updatePayload.moderation_note_bus = note || null;
      }

      if (isActive !== undefined) {
        updatePayload.is_active_bus = isActive;
      }

      const { error } = await supabase
        .from('businesses')
        .update(updatePayload as never)
        .eq('id_bus', id);
      if (error) throw error;
      break;
    }

    case 'event': {
      const updatePayload: Record<string, unknown> = {
        updated_at_evt: reviewedAt,
      };

      if (status !== undefined) {
        updatePayload.moderation_status_evt = status;
        updatePayload.reviewed_by_evt = user.id;
        updatePayload.reviewed_at_evt = reviewedAt;
        updatePayload.moderation_note_evt = note || null;
      }

      if (isActive !== undefined) {
        updatePayload.is_active_evt = isActive;
      }

      const { error } = await supabase
        .from('events')
        .update(updatePayload as never)
        .eq('id_evt', id);
      if (error) throw error;
      break;
    }

    case 'attraction': {
      const updatePayload: Record<string, unknown> = {
        updated_at_atr: reviewedAt,
      };

      if (status !== undefined) {
        updatePayload.moderation_status_atr = status;
        updatePayload.reviewed_by_atr = user.id;
        updatePayload.reviewed_at_atr = reviewedAt;
        updatePayload.moderation_note_atr = note || null;
      }

      if (isActive !== undefined) {
        updatePayload.is_active_atr = isActive;
      }

      const { error } = await supabase
        .from('attractions')
        .update(updatePayload as never)
        .eq('id_atr', id);
      if (error) throw error;
      break;
    }

    case 'promotion': {
      const updatePayload: Record<string, unknown> = {
        updated_at_prm: reviewedAt,
      };

      if (status !== undefined) {
        updatePayload.moderation_status_prm = status;
        updatePayload.reviewed_by_prm = user.id;
        updatePayload.reviewed_at_prm = reviewedAt;
        updatePayload.moderation_note_prm = note || null;
      }

      if (isActive !== undefined) {
        updatePayload.is_active_prm = isActive;
      }

      const { error } = await supabase
        .from('promotions')
        .update(updatePayload as never)
        .eq('id_prm', id);
      if (error) throw error;
      break;
    }
  }
}

/**
 * Toggle is_active status for an entity
 */
export async function toggleEntityActive(
  id: string,
  type: VerificationEntityType,
  isActive: boolean,
): Promise<void> {
  return updateModerationStatus({ id, type, isActive });
}

/**
 * Get single verification request detail
 */
export async function getVerificationDetail(
  id: string,
  type: VerificationEntityType,
): Promise<VerificationRequest | null> {
  let requests: VerificationRequest[] = [];

  switch (type) {
    case 'business':
      requests = await fetchBusinessVerifications('all', '', 100);
      break;
    case 'event':
      requests = await fetchEventVerifications('all', '', 100);
      break;
    case 'attraction':
      requests = await fetchAttractionVerifications('all', '', 100);
      break;
    case 'promotion':
      requests = await fetchPromotionVerifications('all', '', 100);
      break;
  }

  return requests.find((r) => r.id === id) || null;
}

// Re-export types for backwards compatibility
export type {
  VerificationEntityType,
  VerificationRequest,
  VerificationFilters,
  VerificationStats,
  UpdateModerationData,
} from '../types';
