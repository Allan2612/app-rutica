/**
 * Servicio para obtener el detalle de una atracción
 */
import { supabase } from '@/lib/supabase/client';

// ============================================
// Constants
// ============================================

const STORAGE_BUCKET = 'attractions-images';

// ============================================
// Types
// ============================================

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
    createdBy: string | null;
}

// ============================================
// Helpers
// ============================================

function getImageUrl(path: string): string {
    if (!path) return '';
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

/**
 * Extrae el tipo de imagen del path (V3)
 * Path format: <entity_id>/<prefix>-<uuid>.ext
 */
function getImageTypeFromPath(path: string): string {
    if (!path) return '';
    const filename = path.split('/').pop() || '';
    return filename.split('-')[0];
}

// Interface para el resultado raw de la query
interface AttractionRawData {
    id_atr: string;
    name_atr: string;
    description_atr: string | null;
    moderation_status_atr: string | null;
    avg_rating_atr: number;
    reviews_count_atr: number;
    created_at_atr: string;
    profiles: { first_name_prf: string; last_name1_prf: string } | null;
    attraction_category_map: Array<{ categories: { id_cat: string; name_cat: string } | null }> | null;
    locations: {
        address_loc: string | null;
        latitude_loc: number | null;
        longitude_loc: number | null;
        districts: {
            name_dst: string;
            cantons: {
                name_ctn: string;
                provinces: { name_prv: string } | null;
            } | null;
        } | null;
    } | null;
    attraction_images: Array<{ path_aim: string; sort_order_aim: number }> | null;
}

// ============================================
// Service Functions
// ============================================

export async function getAttractionDetail(
    attractionId: string
): Promise<AttractionDetailData | null> {
    const { data, error } = await supabase
        .from('attractions')
        .select(
            `
      id_atr,
      submitted_by_atr,
      name_atr,
      description_atr,
      moderation_status_atr,
      avg_rating_atr,
      reviews_count_atr,
      created_at_atr,
      profiles!attractions_submitted_by_atr_fkey (
        first_name_prf,
        last_name1_prf
      ),
      attraction_category_map (
        categories (
          id_cat,
          name_cat
        )
      ),
      locations!attractions_location_id_atr_fkey (
        address_loc,
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
      attraction_images (
        path_aim,
        sort_order_aim
      )
    `
        )
        .eq('id_atr', attractionId)
        .single<AttractionRawData>();

    if (error || !data) {
        console.error('[getAttractionDetail] Error:', error);
        return null;
    }

    // Procesar imágenes - V3: solo path, ordenar por sort_order
    const images = (data.attraction_images ?? [])
        .sort((a: any, b: any) => (a?.sort_order_aim ?? 0) - (b?.sort_order_aim ?? 0))
        .filter((img: any) => img.path_aim)
        .map((img: any) => getImageUrl(img.path_aim));

    // Procesar categorías
    const categories =
        data.attraction_category_map?.map((m: any) => m.categories).filter(Boolean) ?? [];
    const categoryNames = categories.map((c: any) => c.name_cat);
    const categoryIds = categories.map((c: any) => c.id_cat);

    // Procesar ubicación - V3: jerarquía normalizada
    const location = data.locations as any;
    const district = location?.districts;
    const canton = district?.cantons;
    const province = canton?.provinces;
    const country = province?.countries;

    const locationParts = [country?.name_cnt, province?.name_prv, canton?.name_ctn, district?.name_dst].filter(Boolean);
    const locationLabel = locationParts.length ? locationParts.join(', ') : null;

    // Procesar autor
    const profile = data.profiles as any;
    const authorName = profile
        ? `${profile.first_name_prf} ${profile.last_name1_prf}`.trim()
        : null;

    // Separar portada de galería - V3: cover es el que tiene prefix 'cover' o sort_order 0
    const allImages = (data.attraction_images ?? [])
        .sort((a: any, b: any) => (a?.sort_order_aim ?? 0) - (b?.sort_order_aim ?? 0))
        .filter((img: any) => img.path_aim);

    const coverImg = allImages.find(
        (img: any) => getImageTypeFromPath(img.path_aim) === 'cover' || img.sort_order_aim === 0
    );
    const galleryImgs = allImages.filter((img: any) => img !== coverImg);

    const coverImage = coverImg ? getImageUrl(coverImg.path_aim) : null;
    const galleryImages = galleryImgs.map((img: any) => getImageUrl(img.path_aim));

    return {
        id: data.id_atr,
        name: data.name_atr,
        description: data.description_atr,
        categoryNames,
        categoryIds,
        locationLabel,
        province: province?.name_prv ?? null,
        canton: canton?.name_ctn ?? null,
        district: district?.name_dst ?? null,
        latitude: location?.latitude_loc ?? null,
        longitude: location?.longitude_loc ?? null,
        coverImage,
        galleryImages,
        authorName,
        rating: data.avg_rating_atr ?? 0,
        reviewCount: data.reviews_count_atr ?? 0,
        isApproved: data.moderation_status_atr === 'approved',
        createdAt: data.created_at_atr,
        createdBy: (data as any).submitted_by_atr ?? null,
    };
}
