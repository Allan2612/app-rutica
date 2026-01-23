/**
 * Servicio para obtener el detalle de una atracción
 */
import { supabase } from '@/lib/supabase/client';

export interface AttractionDetailData {
    id: string;
    name: string;
    description: string | null;
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
    rating: number;
    reviewCount: number;
    isApproved: boolean;
    createdAt: string;
}

function getImageUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

export async function getAttractionDetail(attractionId: string): Promise<AttractionDetailData | null> {
    const { data, error } = await supabase
        .from('attractions')
        .select(`
            id_atr,
            name_atr,
            description_atr,
            moderation_status_atr,
            avg_rating_atr,
            reviews_count_atr,
            created_at_atr,
            profiles!submitted_by_atr (
                first_name_prf,
                last_name1_prf
            ),
            attraction_category_map (
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
            attraction_images (
                bucket_aim,
                path_aim,
                sort_order_aim
            )
        `)
        .eq('id_atr', attractionId)
        .single();

    if (error || !data) {
        console.error('[getAttractionDetail] Error:', error);
        return null;
    }

    // Procesar imágenes
    const images = (data.attraction_images ?? [])
        .sort((a: any, b: any) => (a?.sort_order_aim ?? 0) - (b?.sort_order_aim ?? 0))
        .filter((img: any) => img.bucket_aim && img.path_aim)
        .map((img: any) => getImageUrl(img.bucket_aim, img.path_aim));

    // Procesar categorías
    const categories = data.attraction_category_map?.map((m: any) => m.categories).filter(Boolean) ?? [];
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

    // Separar portada de galería
    const coverImage = images.length > 0 ? images[0] : null;
    const galleryImages = images.slice(1);

    return {
        id: data.id_atr,
        name: data.name_atr,
        description: data.description_atr,
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
        rating: data.avg_rating_atr ?? 0,
        reviewCount: data.reviews_count_atr ?? 0,
        isApproved: data.moderation_status_atr === 'approved',
        createdAt: data.created_at_atr,
    };
}
