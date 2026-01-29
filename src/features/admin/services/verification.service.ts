import { supabase } from '@/lib/supabase/client';
import type { ModerationStatus } from '@/types/enums';

// ============================================
// Types for Admin Verification
// ============================================

export type VerificationEntityType = 'business' | 'event' | 'attraction' | 'promotion';

export interface VerificationRequest {
  id: string;
  type: VerificationEntityType;
  name: string;
  description: string | null;
  ownerName: string;
  ownerEmail: string;
  ownerId: string;
  imageUrl: string | null;
  moderationStatus: ModerationStatus;
  createdAt: string;
  locationLabel: string | null;
  businessId?: string; // For promotions - the associated business ID
  metadata?: any; // Additional type-specific data
}

export interface VerificationFilters {
  type?: VerificationEntityType | 'all';
  status?: ModerationStatus | 'all';
  search?: string;
  page?: number;
  limit?: number;
}

export interface VerificationStats {
  totalPending: number;
  pendingByType: {
    business: number;
    event: number;
    attraction: number;
    promotion: number;
  };
}

export interface UpdateModerationData {
  id: string;
  type: VerificationEntityType;
  status?: ModerationStatus;
  note?: string;
  paymentState?: 'pending' | 'paid' | 'rejected';
  paymentNote?: string;
}

// ============================================
// Helper Functions
// ============================================

function getImageUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ============================================
// Service Functions
// ============================================

/**
 * Get all pending verification requests across all entity types
 */
export async function getPendingVerifications(
  filters: VerificationFilters = {}
): Promise<VerificationRequest[]> {
  const { type = 'all', status = 'pending', search = '', page = 1, limit = 50 } = filters;
  const offset = (page - 1) * limit;
  const requests: VerificationRequest[] = [];

  // Filter by specific type or get all
  const typesToFetch: VerificationEntityType[] =
    type === 'all' ? ['business', 'event', 'attraction', 'promotion'] : [type];

  for (const entityType of typesToFetch) {
    try {
      console.log('[ADMIN VERIFICATION] Fetching type:', entityType);
      const entityRequests = await fetchByType(entityType, status, search, limit);
      console.log('[ADMIN VERIFICATION] Got requests:', entityRequests.length, 'for type:', entityType);
      requests.push(...entityRequests);
    } catch (error) {
      console.error(`Error fetching ${entityType} verifications:`, error);
    }
  }

  // Sort by createdAt descending
  requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Apply pagination if filtering all types
  if (type === 'all') {
    return requests.slice(offset, offset + limit);
  }

  return requests;
}

async function fetchByType(
  type: VerificationEntityType,
  status: ModerationStatus | 'all',
  search: string,
  limit: number
): Promise<VerificationRequest[]> {
  switch (type) {
    case 'business':
      return fetchBusinessVerifications(status, search, limit);
    case 'event':
      return fetchEventVerifications(status, search, limit);
    case 'attraction':
      return fetchAttractionVerifications(status, search, limit);
    case 'promotion':
      return fetchPromotionVerifications(status, search, limit);
    default:
      return [];
  }
}

/**
 * Fetch business verification requests
 */
async function fetchBusinessVerifications(
  status: ModerationStatus | 'all',
  search: string,
  limit: number
): Promise<VerificationRequest[]> {
  let query = supabase
    .from('businesses')
    .select(`
      id_bus,
      name_bus,
      description_bus,
      moderation_status_bus,
      created_at_bus,
      owner_id_bus,
      locations (
        province_loc,
        canton_loc,
        district_loc
      ),
      business_images (
        image_type_bim,
        bucket_bim,
        path_bim,
        sort_order_bim
      )
    `)
    .order('created_at_bus', { ascending: false })
    .limit(limit);

  if (status !== 'all') {
    query = query.eq('moderation_status_bus', status);
  }

  if (search) {
    query = query.ilike('name_bus', `%${search}%`);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching businesses:', error);
    throw error;
  }

  return (data || []).map((item: any) => {
    const images = item.business_images || [];
    const sortedImages = [...images].sort(
      (a: any, b: any) => (a.sort_order_bim || 0) - (b.sort_order_bim || 0)
    );
    // Prioritize cover, then logo, then first image
    const coverImage = sortedImages.find((img: any) => img.image_type_bim === 'cover');
    const logoImage = sortedImages.find((img: any) => img.image_type_bim === 'logo');
    const primaryImage = coverImage || logoImage || sortedImages[0];

    const location = Array.isArray(item.locations) ? item.locations[0] : item.locations;
    const locationParts = [location?.canton_loc, location?.district_loc].filter(Boolean);

    return {
      id: item.id_bus,
      type: 'business' as VerificationEntityType,
      name: item.name_bus,
      description: item.description_bus,
      ownerName: 'Propietario',
      ownerEmail: '',
      ownerId: item.owner_id_bus,
      imageUrl: primaryImage?.bucket_bim && primaryImage?.path_bim 
        ? getImageUrl(primaryImage.bucket_bim, primaryImage.path_bim) 
        : null,
      moderationStatus: item.moderation_status_bus,
      createdAt: item.created_at_bus,
      locationLabel: locationParts.length ? locationParts.join(', ') : null,
    };
  });
}

/**
 * Fetch event verification requests
 */
async function fetchEventVerifications(
  status: ModerationStatus | 'all',
  search: string,
  limit: number
): Promise<VerificationRequest[]> {
  let query = supabase
    .from('events')
    .select(`
      id_evt,
      name_evt,
      description_evt,
      moderation_status_evt,
      created_at_evt,
      created_by_evt,
      locations (
        province_loc,
        canton_loc,
        district_loc
      ),
      event_images (
        image_type_eim,
        bucket_eim,
        path_eim,
        sort_order_eim
      )
    `)
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
    console.error('Error fetching events:', error);
    throw error;
  }

  return (data || []).map((item: any) => {
    const images = item.event_images || [];
    const sortedImages = [...images].sort(
      (a: any, b: any) => (a.sort_order_eim || 0) - (b.sort_order_eim || 0)
    );
    // Prioritize cover, then first image
    const coverImage = sortedImages.find((img: any) => img.image_type_eim === 'cover');
    const primaryImage = coverImage || sortedImages[0];

    const location = item.locations;
    const locationParts = [location?.canton_loc, location?.district_loc].filter(Boolean);

    return {
      id: item.id_evt,
      type: 'event' as VerificationEntityType,
      name: item.name_evt,
      description: item.description_evt,
      ownerName: 'Creador',
      ownerEmail: '',
      ownerId: item.created_by_evt,
      imageUrl: primaryImage?.bucket_eim && primaryImage?.path_eim 
        ? getImageUrl(primaryImage.bucket_eim, primaryImage.path_eim) 
        : null,
      moderationStatus: item.moderation_status_evt,
      createdAt: item.created_at_evt,
      locationLabel: locationParts.length ? locationParts.join(', ') : null,
    };
  });
}

/**
 * Fetch attraction verification requests
 */
async function fetchAttractionVerifications(
  status: ModerationStatus | 'all',
  search: string,
  limit: number
): Promise<VerificationRequest[]> {
  let query = supabase
    .from('attractions')
    .select(`
      id_atr,
      name_atr,
      description_atr,
      moderation_status_atr,
      created_at_atr,
      submitted_by_atr,
      locations (
        province_loc,
        canton_loc,
        district_loc
      ),
      attraction_images (
        bucket_aim,
        path_aim,
        sort_order_aim
      )
    `)
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
    console.error('Error fetching attractions:', error);
    throw error;
  }

  return (data || []).map((item: any) => {
    const images = item.attraction_images || [];
    const sortedImages = [...images].sort(
      (a: any, b: any) => (a.sort_order_aim || 0) - (b.sort_order_aim || 0)
    );
    // Attractions use 'image' type - just take first
    const primaryImage = sortedImages[0];

    const location = item.locations;
    const locationParts = [location?.canton_loc, location?.district_loc].filter(Boolean);

    return {
      id: item.id_atr,
      type: 'attraction' as VerificationEntityType,
      name: item.name_atr,
      description: item.description_atr,
      ownerName: 'Colaborador',
      ownerEmail: '',
      ownerId: item.submitted_by_atr,
      imageUrl: primaryImage?.bucket_aim && primaryImage?.path_aim 
        ? getImageUrl(primaryImage.bucket_aim, primaryImage.path_aim) 
        : null,
      moderationStatus: item.moderation_status_atr,
      createdAt: item.created_at_atr,
      locationLabel: locationParts.length ? locationParts.join(', ') : null,
    };
  });
}

/**
 * Fetch promotion verification requests
 */
async function fetchPromotionVerifications(
  status: ModerationStatus | 'all',
  search: string,
  limit: number
): Promise<VerificationRequest[]> {
  let query = supabase
    .from('promotions')
    .select(`
      id_prm,
      title_prm,
      description_prm,
      moderation_status_prm,
      moderation_note_prm,
      created_at_prm,
      created_by_prm,
      business_id_prm,
      start_at_prm,
      end_at_prm,
      discount_type_prm,
      discount_value_prm,
      scope_prm,
      payment_reference_prm,
      payment_state_prm,
      payment_note_prm,
      businesses (
        name_bus,
        locations (
          province_loc,
          canton_loc,
          district_loc,
          address_loc
        )
      ),
      profiles!promotions_created_by_prm_fkey (
        first_name_prf,
        last_name1_prf,
        last_name2_prf
      ),
      promotion_images (
        image_type_pim,
        bucket_pim,
        path_pim
      ),
      promotion_scope_categories (
        categories (
          id_cat,
          name_cat
        )
      ),
      promotion_combo_items (
        quantity_pci,
        paid_quantity_pci,
        products (
          id_prd,
          name_prd,
          price_prd
        )
      )
    `)
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
    console.error('Error fetching promotions:', error);
    throw error;
  }

  return (data || []).map((item: any) => {
    const images = item.promotion_images || [];
    const coverImage = images.find((img: any) => img.image_type_pim === 'cover');
    const primaryImage = coverImage || images[0];

    // Get user full name
    const profile = item.profiles;
    const fullName = profile 
      ? [profile.first_name_prf, profile.last_name1_prf, profile.last_name2_prf]
          .filter(Boolean)
          .join(' ')
      : 'Usuario';

    // Get business location
    const businessLocations = item.businesses?.locations;
    const location = Array.isArray(businessLocations) ? businessLocations[0] : businessLocations;
    const locationParts = [
      location?.canton_loc,
      location?.district_loc,
      location?.province_loc,
    ].filter(Boolean);

    // Get categories if scope is category
    const categories = (item.promotion_scope_categories || [])
      .map((psc: any) => psc.categories?.name_cat)
      .filter(Boolean);

    // Get combo items if scope is product
    const comboItems = (item.promotion_combo_items || [])
      .map((pci: any) => ({
        productName: pci.products?.name_prd || 'Producto',
        quantity: pci.quantity_pci,
        paidQuantity: pci.paid_quantity_pci,
        price: pci.products?.price_prd,
      }))
      .filter((item: any) => item.productName);

    return {
      id: item.id_prm,
      type: 'promotion' as VerificationEntityType,
      name: item.title_prm,
      description: item.description_prm,
      ownerName: fullName,
      ownerEmail: '',
      ownerId: item.created_by_prm,
      imageUrl: primaryImage?.bucket_pim && primaryImage?.path_pim 
        ? getImageUrl(primaryImage.bucket_pim, primaryImage.path_pim) 
        : null,
      moderationStatus: item.moderation_status_prm,
      createdAt: item.created_at_prm,
      locationLabel: locationParts.length ? locationParts.join(', ') : null,
      businessId: item.business_id_prm,
      // Additional promotion data
      metadata: {
        businessName: item.businesses?.name_bus,
        businessLocation: locationParts.length ? locationParts.join(', ') : null,
        discountType: item.discount_type_prm,
        discountValue: item.discount_value_prm,
        scope: item.scope_prm,
        startAt: item.start_at_prm,
        endAt: item.end_at_prm,
        paymentReference: item.payment_reference_prm,
        paymentState: item.payment_state_prm,
        paymentNote: item.payment_note_prm,
        moderationNote: item.moderation_note_prm,
        categories: categories,
        comboItems: comboItems,
        images: images.map((img: any) => ({
          type: img.image_type_pim,
          url: img.bucket_pim && img.path_pim ? getImageUrl(img.bucket_pim, img.path_pim) : null,
        })).filter((img: any) => img.url),
      },
    };
  });
}

/**
 * Get statistics for pending verifications
 */
export async function getVerificationStats(): Promise<VerificationStats> {
  const [businesses, events, attractions, promotions] = await Promise.all([
    supabase.from('businesses').select('id_bus', { count: 'exact', head: true }).eq('moderation_status_bus', 'pending'),
    supabase.from('events').select('id_evt', { count: 'exact', head: true }).eq('moderation_status_evt', 'pending'),
    supabase.from('attractions').select('id_atr', { count: 'exact', head: true }).eq('moderation_status_atr', 'pending'),
    supabase.from('promotions').select('id_prm', { count: 'exact', head: true }).eq('moderation_status_prm', 'pending'),
  ]);

  const pendingByType = {
    business: businesses.count || 0,
    event: events.count || 0,
    attraction: attractions.count || 0,
    promotion: promotions.count || 0,
  };

  return {
    totalPending: pendingByType.business + pendingByType.event + pendingByType.attraction + pendingByType.promotion,
    pendingByType,
  };
}

/**
 * Update moderation status for an entity
 */
export async function updateModerationStatus(data: UpdateModerationData): Promise<void> {
  const { id, type, status, note, paymentState, paymentNote } = data;

  // Get current user for reviewed_by field
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const reviewedAt = new Date().toISOString();

  switch (type) {
    case 'business':
      if (status !== undefined) {
        await supabase
          .from('businesses')
          .update({
            moderation_status_bus: status,
            reviewed_by_bus: user.id,
            reviewed_at_bus: reviewedAt,
            moderation_note_bus: note || null,
          })
          .eq('id_bus', id);
      }
      break;

    case 'event':
      if (status !== undefined) {
        await supabase
          .from('events')
          .update({
            moderation_status_evt: status,
            reviewed_by_evt: user.id,
            reviewed_at_evt: reviewedAt,
            moderation_note_evt: note || null,
          })
          .eq('id_evt', id);
      }
      break;

    case 'attraction':
      if (status !== undefined) {
        await supabase
          .from('attractions')
          .update({
            moderation_status_atr: status,
            reviewed_by_atr: user.id,
            reviewed_at_atr: reviewedAt,
            moderation_note_atr: note || null,
          })
          .eq('id_atr', id);
      }
      break;

    case 'promotion':
      const updateData: any = {};
      
      if (status !== undefined) {
        updateData.moderation_status_prm = status;
        updateData.reviewed_by_prm = user.id;
        updateData.reviewed_at_prm = reviewedAt;
        updateData.moderation_note_prm = note || null;
      }
      
      if (paymentState !== undefined) {
        updateData.payment_state_prm = paymentState;
        updateData.payment_note_prm = paymentNote || null;
      }

      if (Object.keys(updateData).length > 0) {
        await supabase
          .from('promotions')
          .update(updateData)
          .eq('id_prm', id);
      }
      break;
  }
}

/**
 * Get single verification request detail
 */
export async function getVerificationDetail(
  id: string,
  type: VerificationEntityType
): Promise<VerificationRequest | null> {
  const requests = await fetchByType(type, 'all', '', 1);
  return requests.find((r) => r.id === id) || null;
}
