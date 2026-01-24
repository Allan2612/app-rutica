/**
 * Servicio para obtener el detalle de un evento
 */
import { supabase } from '@/lib/supabase/client';

export interface EventDetailData {
    id: string;
    name: string;
    description: string | null;
    startAt: string;
    endAt: string;
    isFree: boolean;
    price: number | null;
    currency: string | null;
    capacity: number | null;
    categoryNames: string[];
    categoryIds: string[];
    locationLabel: string | null;
    province: string | null;
    canton: string | null;
    district: string | null;
    latitude: number | null;
    longitude: number | null;
    coverImage: string | null;
    galleryImages: string[];
    authorName: string | null;
    contactPhone: string | null;
    contactEmail: string | null;
    website: string | null;
    socialLinks: {
        facebook?: string;
        instagram?: string;
        tiktok?: string;
    };
    rating: number;
    reviewCount: number;
    isApproved: boolean;
    createdAt: string;
}

function getImageUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

export async function getEventDetail(eventId: string): Promise<EventDetailData | null> {
    const { data, error } = await supabase
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
            moderation_status_evt,
            created_at_evt,
            contact_phone_evt,
            contact_email_evt,
            website_evt,
            social_links_evt,
            avg_rating_evt,
            reviews_count_evt,
            profiles!events_created_by_evt_fkey (
                first_name_prf,
                last_name1_prf
            ),
            event_category_map (
                categories (
                    id_cat,
                    name_cat
                )
            ),
            locations (
                province_loc,
                canton_loc,
                district_loc,
                latitude_loc,
                longitude_loc
            ),
            event_images (
                bucket_eim,
                path_eim,
                sort_order_eim
            )
        `)
        .eq('id_evt', eventId)
        .single();

    if (error || !data) {
        console.error('[getEventDetail] Error:', error);
        return null;
    }

    // Procesar imágenes - primera es portada, resto es galería
    const images = (data.event_images ?? [])
        .sort((a: any, b: any) => (a?.sort_order_eim ?? 0) - (b?.sort_order_eim ?? 0))
        .filter((img: any) => img.bucket_eim && img.path_eim)
        .map((img: any) => getImageUrl(img.bucket_eim, img.path_eim));

    const coverImage = images.length > 0 ? images[0] : null;
    const galleryImages = images.slice(1);

    // Procesar categorías
    const categories = data.event_category_map?.map((m: any) => m.categories).filter(Boolean) ?? [];
    const categoryNames = categories.map((c: any) => c.name_cat);
    const categoryIds = categories.map((c: any) => c.id_cat);

    // Procesar ubicación
    const location = Array.isArray(data.locations) ? data.locations[0] : data.locations;
    const locationParts = [location?.canton_loc, location?.district_loc].filter(Boolean);
    const locationLabel = locationParts.length ? locationParts.join(', ') : null;

    // Procesar autor
    const profile = data.profiles as any;
    const authorName = profile
        ? `${profile.first_name_prf} ${profile.last_name1_prf}`.trim()
        : null;

    // Procesar social links
    const socialLinks = (data.social_links_evt as Record<string, string>) ?? {};

    // Asegurar protocolo en website
    let website = data.website_evt;
    if (website && !website.startsWith('http://') && !website.startsWith('https://')) {
        website = `https://${website}`;
    }

    return {
        id: data.id_evt,
        name: data.name_evt,
        description: data.description_evt,
        startAt: data.start_at_evt,
        endAt: data.end_at_evt,
        isFree: data.is_free_evt ?? false,
        price: data.price_evt,
        currency: data.currency_evt,
        capacity: data.capacity_evt,
        categoryNames,
        categoryIds,
        locationLabel,
        province: location?.province_loc ?? null,
        canton: location?.canton_loc ?? null,
        district: location?.district_loc ?? null,
        latitude: location?.latitude_loc ?? null,
        longitude: location?.longitude_loc ?? null,
        coverImage,
        galleryImages,
        authorName,
        contactPhone: data.contact_phone_evt,
        contactEmail: data.contact_email_evt,
        website,
        socialLinks: {
            facebook: socialLinks.facebook,
            instagram: socialLinks.instagram,
            tiktok: socialLinks.tiktok,
        },
        rating: data.avg_rating_evt ?? 0,
        reviewCount: data.reviews_count_evt ?? 0,
        isApproved: data.moderation_status_evt === 'approved',
        createdAt: data.created_at_evt,
    };
}
