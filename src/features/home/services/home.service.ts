/**
 * Home Service
 * Provides data for the Home screen including featured content
 */

import { supabase } from '@/lib/supabase/client';
import type { PromotionListItem } from '@/types/entities';
import type { BusinessListItem } from '@/features/business/hooks/useBusinesses';
import type { EventListItem } from '@/features/events/hooks/useEvents';
import type { AttractionListItem } from '@/features/attractions/hooks/useAttractions';

const BUCKET_BUSINESS = 'business-images';
const BUCKET_PROMOTIONS = 'promotions-images';
const BUCKET_EVENTS = 'events-images';
const BUCKET_ATTRACTIONS = 'attractions-images';

// Helper para generar URLs de imágenes desde Supabase Storage
function getImageUrl(bucket: string, path: string): string {
    if (!path) return '';
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

// Helper para extraer el tipo de imagen del path (cover, gallery, etc.)
function getImageTypeFromPath(path: string): string {
    if (!path) return '';
    const filename = path.split('/').pop() || '';
    return filename.split('-')[0];
}

// ============================================
// Featured Promotions (Global Active)
// ============================================

interface PromotionRecord {
    id_prm: string;
    business_id_prm: string;
    scope_prm: string;
    title_prm: string;
    description_prm: string | null;
    discount_type_prm: string;
    discount_value_prm: number;
    start_at_prm: string;
    end_at_prm: string;
    created_at_prm: string;
    businesses: {
        id_bus: string;
        name_bus: string;
        business_images?: {
            path_bim: string;
        }[] | null;
        locations?: {
            districts?: {
                name_dst: string;
                cantons?: {
                    name_ctn: string;
                    provinces?: {
                        name_prv: string;
                    } | null;
                } | null;
            } | null;
        } | null;
    } | null;
    promotion_images: {
        path_pim: string;
    }[] | null;
    promotion_category_map: {
        categories: {
            id_cat: string;
            name_cat: string;
        } | null;
    }[];
    promotion_scope_categories?: {
        category_id_psc: string;
    }[] | null;
}

/**
 * Get featured promotions for the Home screen
 * Filters: paid, active, approved, current dates
 */
export async function getFeaturedPromotions(limit: number = 6): Promise<PromotionListItem[]> {
    try {
        const now = new Date().toISOString();

        const { data, error } = await (supabase as any)
            .from('promotions')
            .select(`
                id_prm,
                business_id_prm,
                scope_prm,
                title_prm,
                description_prm,
                discount_type_prm,
                discount_value_prm,
                start_at_prm,
                end_at_prm,
                created_at_prm,
                businesses:business_id_prm (
                    id_bus,
                    name_bus,
                    business_images (
                        path_bim
                    ),
                    locations (
                        districts (
                            name_dst,
                            cantons (
                                name_ctn,
                                provinces (
                                    name_prv
                                )
                            )
                        )
                    )
                ),
                promotion_images (
                    path_pim
                ),
                promotion_category_map (
                    categories!inner (
                        id_cat,
                        name_cat
                    )
                ),
                promotion_scope_categories (
                    category_id_psc
                )
            `)
            .eq('moderation_status_prm', 'approved')
            .eq('is_active_prm', true)
            .lte('start_at_prm', now)
            .gte('end_at_prm', now)
            .order('created_at_prm', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching featured promotions:', error);
            return [];
        }

        return (data ?? []).map((item: PromotionRecord): PromotionListItem => {
            const promoImage = item.promotion_images?.[0]?.path_pim;
            const businessCover = item.businesses?.business_images?.find(
                (img: { path_bim: string }) => getImageTypeFromPath(img.path_bim) === 'cover'
            )?.path_bim;
            const businessAnyImage = item.businesses?.business_images?.[0]?.path_bim;

            const coverUrl = promoImage
                ? getImageUrl(BUCKET_PROMOTIONS, promoImage)
                : businessCover
                    ? getImageUrl(BUCKET_BUSINESS, businessCover)
                    : businessAnyImage
                        ? getImageUrl(BUCKET_BUSINESS, businessAnyImage)
                        : null;

            const categories = item.promotion_category_map
                ?.map((pcm: { categories: { id_cat: string; name_cat: string } | null }) => pcm.categories)
                .filter((cat: { id_cat: string; name_cat: string } | null): cat is { id_cat: string; name_cat: string } => cat !== null) ?? [];

            return {
                id: item.id_prm,
                businessId: item.business_id_prm,
                businessName: item.businesses?.name_bus ?? null,
                scope: item.scope_prm as any,
                title: item.title_prm,
                description: item.description_prm,
                discountType: item.discount_type_prm as any,
                discountValue: item.discount_value_prm,
                startAt: item.start_at_prm,
                endAt: item.end_at_prm,
                moderationStatus: 'approved',
                coverUrl,
                categoryNames: categories.map((c: { name_cat: string }) => c.name_cat),
                categoryIds: categories.map((c: { id_cat: string }) => c.id_cat),
                scopeCategoryIds: item.promotion_scope_categories?.map((psc: { category_id_psc: string }) => psc.category_id_psc) ?? [],
                productIds: [],
                comboItems: [],
                isActive: true,
                createdAt: item.created_at_prm,
            };
        });
    } catch (err) {
        console.error('Exception in getFeaturedPromotions:', err);
        return [];
    }
}

// ============================================
// Top Rated Business
// ============================================

interface BusinessRecord {
    id_bus: string;
    name_bus: string;
    description_bus: string | null;
    moderation_status_bus: string;
    is_active_bus: boolean;
    avg_rating_bus: number | null;
    reviews_count_bus: number | null;
    business_category_map?: {
        categories: {
            id_cat: string;
            name_cat: string;
        } | null;
    }[] | null;
    locations?: {
        districts?: {
            name_dst: string;
            cantons?: {
                name_ctn: string;
                provinces?: {
                    name_prv: string;
                } | null;
            } | null;
        } | null;
    } | null;
    business_images?: {
        path_bim: string;
        sort_order_bim: number;
    }[] | null;
    promotions?: {
        id_prm: string;
    }[] | null;
}

/**
 * Get the top rated business for the Home screen
 */
export async function getTopRatedBusiness(): Promise<BusinessListItem | null> {
    const now = new Date().toISOString();

    const { data, error } = await (supabase as any)
        .from('businesses')
        .select(`
            id_bus,
            name_bus,
            description_bus,
            moderation_status_bus,
            is_active_bus,
            avg_rating_bus,
            reviews_count_bus,
            business_category_map (
                categories (
                    id_cat,
                    name_cat
                )
            ),
            locations!location_id_bus (
                districts!district_id_loc (
                    name_dst,
                    cantons!canton_id_dst (
                        name_ctn,
                        provinces!province_id_ctn (
                            name_prv
                        )
                    )
                )
            ),
            business_images ( path_bim, sort_order_bim ),
            promotions!business_id_prm (
                id_prm
            )
        `)
        .eq('moderation_status_bus', 'approved')
        .eq('is_active_bus', true)
        .not('avg_rating_bus', 'is', null)
        .gt('avg_rating_bus', 0)
        .order('avg_rating_bus', { ascending: false })
        .order('reviews_count_bus', { ascending: false })
        .limit(1)
        .single();

    if (error || !data) {
        // Fallback: get any approved business if no rated one exists
        const { data: fallback } = await (supabase as any)
            .from('businesses')
            .select(`
                id_bus,
                name_bus,
                description_bus,
                moderation_status_bus,
                is_active_bus,
                avg_rating_bus,
                reviews_count_bus,
                business_category_map (
                    categories (
                        id_cat,
                        name_cat
                    )
                ),
                locations!location_id_bus (
                    districts!district_id_loc (
                        name_dst,
                        cantons!canton_id_dst (
                            name_ctn,
                            provinces!province_id_ctn (
                                name_prv
                            )
                        )
                    )
                ),
                business_images ( path_bim, sort_order_bim ),
                promotions!business_id_prm (
                    id_prm
                )
            `)
            .eq('moderation_status_bus', 'approved')
            .eq('is_active_bus', true)
            .order('created_at_bus', { ascending: false })
            .limit(1)
            .single();

        if (!fallback) return null;

        return mapBusinessRecord(fallback, now);
    }

    return mapBusinessRecord(data, now);
}

function mapBusinessRecord(item: BusinessRecord, now: string): BusinessListItem {
    const sortedImages = [...(item.business_images ?? [])].sort(
        (a, b) => (a?.sort_order_bim ?? 0) - (b?.sort_order_bim ?? 0)
    );

    const coverImage = sortedImages.find((img) => getImageTypeFromPath(img.path_bim) === 'cover');
    const logoImage = sortedImages.find((img) => getImageTypeFromPath(img.path_bim) === 'logo');
    const galleryImage = sortedImages.find((img) => getImageTypeFromPath(img.path_bim) === 'gallery');

    const primaryImage = coverImage ?? galleryImage ?? logoImage ?? sortedImages[0];

    const imageUrl = primaryImage?.path_bim
        ? getImageUrl(BUCKET_BUSINESS, primaryImage.path_bim)
        : null;

    const logoUrl = logoImage?.path_bim
        ? getImageUrl(BUCKET_BUSINESS, logoImage.path_bim)
        : null;

    const categories = item.business_category_map
        ?.map(bcm => bcm.categories)
        .filter((cat): cat is NonNullable<typeof cat> => cat !== null) ?? [];
    const categoryNames = categories.map(cat => cat.name_cat);
    const categoryIds = categories.map(cat => cat.id_cat);

    const locationData = item.locations;
    const districtData = locationData?.districts;
    const cantonData = districtData?.cantons;
    const provinceData = cantonData?.provinces;
    const locationParts = [districtData?.name_dst, cantonData?.name_ctn, provinceData?.name_prv].filter(Boolean);

    // Check active promotions
    const hasActivePromotions = (item.promotions?.length ?? 0) > 0;

    return {
        id: item.id_bus,
        name: item.name_bus,
        description: item.description_bus,
        categoryNames,
        categoryIds,
        locationLabel: locationParts.length ? locationParts.join(', ') : null,
        imageUrl,
        logoUrl,
        rating: item.avg_rating_bus ?? 0,
        reviewCount: item.reviews_count_bus ?? 0,
        isApproved: item.moderation_status_bus === 'approved',
        hasActivePromotions,
    };
}

// ============================================
// Quick Stats
// ============================================

export interface HomeStats {
    businessCount: number;
    eventCount: number;
    attractionCount: number;
    promotionCount: number;
}

export async function getHomeStats(): Promise<HomeStats> {
    try {
        const now = new Date().toISOString();

        const [businesses, events, attractions, promotions] = await Promise.all([
            (supabase as any)
                .from('businesses')
                .select('id_bus', { count: 'exact', head: true })
                .eq('moderation_status_bus', 'approved')
                .eq('is_active_bus', true),
            (supabase as any)
                .from('events')
                .select('id_evt', { count: 'exact', head: true })
                .eq('moderation_status_evt', 'approved')
                .eq('is_active_evt', true)
                .gte('end_at_evt', now),
            (supabase as any)
                .from('attractions')
                .select('id_atr', { count: 'exact', head: true })
                .eq('moderation_status_atr', 'approved')
                .eq('is_active_atr', true),
            (supabase as any)
                .from('promotions')
                .select('id_prm', { count: 'exact', head: true })
                .eq('moderation_status_prm', 'approved')
                .eq('is_active_prm', true)
                .lte('start_at_prm', now)
                .gte('end_at_prm', now),
        ]);

        return {
            businessCount: businesses.count ?? 0,
            eventCount: events.count ?? 0,
            attractionCount: attractions.count ?? 0,
            promotionCount: promotions.count ?? 0,
        };
    } catch (err) {
        console.error('Exception in getHomeStats:', err);
        return {
            businessCount: 0,
            eventCount: 0,
            attractionCount: 0,
            promotionCount: 0,
        };
    }
}

// ============================================
// Featured Businesses
// ============================================

/**
 * Get featured businesses for the Home screen
 * Ordered by rating, with active promotions prioritized
 */
export async function getFeaturedBusinesses(limit: number = 5): Promise<BusinessListItem[]> {
    try {
        const now = new Date().toISOString();

        const { data, error } = await (supabase as any)
            .from('businesses')
            .select(`
                id_bus,
                name_bus,
                description_bus,
                moderation_status_bus,
                is_active_bus,
                avg_rating_bus,
                reviews_count_bus,
                business_category_map (
                    categories (
                        id_cat,
                        name_cat
                    )
                ),
                locations!location_id_bus (
                    districts!district_id_loc (
                        name_dst,
                        cantons!canton_id_dst (
                            name_ctn,
                            provinces!province_id_ctn (
                                name_prv
                            )
                        )
                    )
                ),
                business_images ( path_bim, sort_order_bim ),
                promotions!business_id_prm (
                    id_prm
                )
            `)
            .eq('moderation_status_bus', 'approved')
            .eq('is_active_bus', true)
            .order('avg_rating_bus', { ascending: false, nullsFirst: false })
            .order('reviews_count_bus', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching featured businesses:', error);
            return [];
        }

        return (data ?? []).map((item: BusinessRecord) => mapBusinessRecord(item, now));
    } catch (err) {
        console.error('Exception in getFeaturedBusinesses:', err);
        return [];
    }
}

// ============================================
// Featured Events
// ============================================

interface EventRecord {
    id_evt: string;
    name_evt: string;
    description_evt: string | null;
    start_at_evt: string;
    end_at_evt: string;
    is_free_evt: boolean;
    price_evt: number | null;
    currency_evt: string | null;
    capacity_evt: number | null;
    contact_phone_evt: string | null;
    contact_email_evt: string | null;
    website_evt: string | null;
    social_links_evt: Record<string, string> | null;
    moderation_status_evt: string;
    is_active_evt: boolean;
    created_at_evt: string;
    avg_rating_evt: number | null;
    reviews_count_evt: number | null;
    event_category_map?: {
        categories: {
            id_cat: string;
            name_cat: string;
        } | null;
    }[] | null;
    locations?: {
        latitude_loc: number | null;
        longitude_loc: number | null;
        districts?: {
            name_dst: string;
            cantons?: {
                name_ctn: string;
                provinces?: {
                    name_prv: string;
                } | null;
            } | null;
        } | null;
    } | null;
    event_images?: {
        path_eim: string;
        sort_order_eim: number;
    }[] | null;
    profiles?: {
        first_name_prf: string | null;
        last_name1_prf: string | null;
    } | null;
}

/**
 * Get featured events for the Home screen
 * Shows upcoming events ordered by start date
 */
export async function getFeaturedEvents(limit: number = 5): Promise<EventListItem[]> {
    try {
        const now = new Date().toISOString();

        const { data, error } = await (supabase as any)
            .from('events')
            .select(`
                id_evt,
                name_evt,
                description_evt,
                start_at_evt,
                end_at_evt,
                is_free_evt,
                price_evt,
                currency_evt,
                capacity_evt,
                contact_phone_evt,
                contact_email_evt,
                website_evt,
                social_links_evt,
                moderation_status_evt,
                is_active_evt,
                created_at_evt,
                avg_rating_evt,
                reviews_count_evt,
                event_category_map (
                    categories (
                        id_cat,
                        name_cat
                    )
                ),
                locations!events_location_id_evt_fkey (
                    latitude_loc,
                    longitude_loc,
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
                event_images ( path_eim, sort_order_eim ),
                profiles!events_created_by_evt_fkey (
                    first_name_prf,
                    last_name1_prf
                )
            `)
            .eq('moderation_status_evt', 'approved')
            .eq('is_active_evt', true)
            .gte('end_at_evt', now)
            .order('avg_rating_evt', { ascending: false, nullsFirst: false })
            .order('reviews_count_evt', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching featured events:', error);
            return [];
        }

        return (data ?? []).map((item: EventRecord): EventListItem => {
            // Ordenar imágenes por sort_order
            const sortedImages = [...(item.event_images ?? [])].sort(
                (a, b) => (a?.sort_order_eim ?? 0) - (b?.sort_order_eim ?? 0)
            );

            // Mapear todas las imágenes a URLs (consistente con useEvents)
            const imageUrls = sortedImages
                .filter(img => img?.path_eim)
                .map(img => getImageUrl(BUCKET_EVENTS, img.path_eim));

            const categories = item.event_category_map
                ?.map(ecm => ecm.categories)
                .filter((cat): cat is NonNullable<typeof cat> => cat !== null) ?? [];

            const categoryNames = categories.map(cat => cat.name_cat);
            const categoryIds = categories.map(cat => cat.id_cat);

            const locationData = item.locations;
            const districtData = locationData?.districts;
            const cantonData = districtData?.cantons;
            const provinceData = cantonData?.provinces;
            const locationParts = [districtData?.name_dst, cantonData?.name_ctn, provinceData?.name_prv].filter(Boolean);

            const authorName = item.profiles
                ? `${item.profiles.first_name_prf || ''} ${item.profiles.last_name1_prf || ''}`.trim() || null
                : null;

            return {
                id: item.id_evt,
                name: item.name_evt,
                description: item.description_evt,
                startAt: item.start_at_evt,
                endAt: item.end_at_evt,
                isFree: item.is_free_evt,
                price: item.price_evt,
                currency: item.currency_evt,
                capacity: item.capacity_evt,
                categoryNames,
                categoryIds,
                locationLabel: locationParts.length ? locationParts.join(', ') : null,
                latitude: locationData?.latitude_loc ?? null,
                longitude: locationData?.longitude_loc ?? null,
                imageUrls,
                authorName,
                isApproved: item.moderation_status_evt === 'approved',
                createdAt: item.created_at_evt,
                contactPhone: item.contact_phone_evt,
                contactEmail: item.contact_email_evt,
                website: item.website_evt,
                socialLinks: item.social_links_evt,
                rating: item.avg_rating_evt ?? 0,
                reviewCount: item.reviews_count_evt ?? 0,
            };
        });
    } catch (err) {
        console.error('Exception in getFeaturedEvents:', err);
        return [];
    }
}

// ============================================
// Featured Attractions
// ============================================

interface AttractionRecord {
    id_atr: string;
    name_atr: string;
    description_atr: string | null;
    moderation_status_atr: string;
    is_active_atr: boolean;
    created_at_atr: string;
    avg_rating_atr: number | null;
    reviews_count_atr: number | null;
    attraction_category_map?: {
        categories: {
            id_cat: string;
            name_cat: string;
        } | null;
    }[] | null;
    locations?: {
        latitude_loc: number | null;
        longitude_loc: number | null;
        districts?: {
            name_dst: string;
            cantons?: {
                name_ctn: string;
                provinces?: {
                    name_prv: string;
                    countries?: {
                        name_cry: string;
                    } | null;
                } | null;
            } | null;
        } | null;
    } | null;
    attraction_images?: {
        path_aim: string;
        sort_order_aim: number;
    }[] | null;
    profiles?: {
        first_name_prf: string | null;
        last_name1_prf: string | null;
    } | null;
}

/**
 * Get featured attractions for the Home screen
 * Ordered by rating
 */
export async function getFeaturedAttractions(limit: number = 5): Promise<AttractionListItem[]> {
    try {
        const { data, error } = await (supabase as any)
            .from('attractions')
            .select(`
                id_atr,
                name_atr,
                description_atr,
                moderation_status_atr,
                is_active_atr,
                created_at_atr,
                avg_rating_atr,
                reviews_count_atr,
                attraction_category_map (
                    categories (
                        id_cat,
                        name_cat
                    )
                ),
                locations!attractions_location_id_atr_fkey (
                    latitude_loc,
                    longitude_loc,
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
                attraction_images ( path_aim, sort_order_aim ),
                profiles!attractions_submitted_by_atr_fkey (
                    first_name_prf,
                    last_name1_prf
                )
            `)
            .eq('moderation_status_atr', 'approved')
            .eq('is_active_atr', true)
            .order('avg_rating_atr', { ascending: false, nullsFirst: false })
            .order('reviews_count_atr', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching featured attractions:', error);
            return [];
        }

        return (data ?? []).map((item: AttractionRecord): AttractionListItem => {
            // Ordenar imágenes por sort_order
            const sortedImages = [...(item.attraction_images ?? [])].sort(
                (a, b) => (a?.sort_order_aim ?? 0) - (b?.sort_order_aim ?? 0)
            );

            // Mapear todas las imágenes a URLs (consistente con useAttractions)
            const imageUrls = sortedImages
                .filter(img => img?.path_aim)
                .map(img => getImageUrl(BUCKET_ATTRACTIONS, img.path_aim));

            const categories = item.attraction_category_map
                ?.map(acm => acm.categories)
                .filter((cat): cat is NonNullable<typeof cat> => cat !== null) ?? [];

            const categoryNames = categories.map(cat => cat.name_cat);
            const categoryIds = categories.map(cat => cat.id_cat);

            const locationData = item.locations;
            const districtData = locationData?.districts;
            const cantonData = districtData?.cantons;
            const provinceData = cantonData?.provinces;
            const locationParts = [districtData?.name_dst, cantonData?.name_ctn, provinceData?.name_prv].filter(Boolean);

            const authorName = item.profiles
                ? `${item.profiles.first_name_prf || ''} ${item.profiles.last_name1_prf || ''}`.trim() || null
                : null;

            return {
                id: item.id_atr,
                name: item.name_atr,
                description: item.description_atr,
                categoryNames,
                categoryIds,
                locationLabel: locationParts.length ? locationParts.join(', ') : null,
                latitude: locationData?.latitude_loc ?? null,
                longitude: locationData?.longitude_loc ?? null,
                imageUrls,
                authorName,
                rating: item.avg_rating_atr ?? 0,
                reviewCount: item.reviews_count_atr ?? 0,
                isApproved: item.moderation_status_atr === 'approved',
                createdAt: item.created_at_atr,
            };
        });
    } catch (err) {
        console.error('Exception in getFeaturedAttractions:', err);
        return [];
    }
}

