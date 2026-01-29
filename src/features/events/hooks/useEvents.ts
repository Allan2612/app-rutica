import { useQuery } from '@tanstack/react-query';
import {
    EventListFilters,
    EventListRecord,
    getEventsList,
    getImageUrl,
} from '@/features/events/services/events.service';

export interface EventListItem {
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
    latitude: number | null;
    longitude: number | null;
    imageUrls: string[];
    authorName: string | null;
    isApproved: boolean;
    createdAt: string;
    contactPhone: string | null;
    contactEmail: string | null;
    website: string | null;
    socialLinks: Record<string, string> | null;
    rating: number;
    reviewCount: number;
}

function mapEventToListItem(item: EventListRecord): EventListItem {
    // Obtener todas las imágenes ordenadas por sort_order
    const sortedImages = [...(item.event_images ?? [])].sort(
        (a, b) => (a?.sort_order_eim ?? 0) - (b?.sort_order_eim ?? 0)
    );

    const imageUrls = sortedImages
        .filter(img => img?.path_eim)
        .map(img => getImageUrl('events-images', img.path_eim));

    // Obtener categorías
    const categories = item.event_category_map
        ?.map(ecm => ecm.categories)
        .filter((cat): cat is NonNullable<typeof cat> => cat !== null) ?? [];
    const categoryNames = categories.map(cat => cat.name_cat);
    const categoryIds = categories.map(cat => cat.id_cat);

    // Ubicación con estructura jerárquica normalizada
    const locationParts = [
        item.locations?.districts?.name_dst,
        item.locations?.districts?.cantons?.name_ctn,
        item.locations?.districts?.cantons?.provinces?.name_prv
    ].filter(Boolean);

    // Nombre del autor
    const authorName = item.profiles
        ? `${item.profiles.first_name_prf} ${item.profiles.last_name1_prf}`
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
        latitude: item.locations?.latitude_loc ?? null,
        longitude: item.locations?.longitude_loc ?? null,
        imageUrls,
        authorName,
        isApproved: item.moderation_status_evt === 'approved',
        createdAt: item.created_at_evt,
        contactPhone: item.contact_phone_evt ?? null,
        contactEmail: item.contact_email_evt ?? null,
        website: item.website_evt ?? null,
        socialLinks: item.social_links_evt ?? null,
        rating: item.avg_rating_evt ?? 0,
        reviewCount: item.reviews_count_evt ?? 0,
    };
}

export function useEvents(filters: EventListFilters = {}) {
    return useQuery({
        queryKey: ['events', 'list', filters],
        queryFn: async () => {
            const data = await getEventsList(filters);
            return data.map(mapEventToListItem);
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}
