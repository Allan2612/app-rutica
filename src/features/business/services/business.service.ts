import { supabase } from '@/lib/supabase/client';
import { Business, BusinessWithRelations, Location } from '@/types/entities';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// Función para generar UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface CreateBusinessInput {
  ownerId: string;

  // Business
  name: string;
  description?: string;
  whatsapp?: string;
  phone?: string;
  email?: string;
  website?: string;

  // Location
  country?: string;
  province?: string;
  canton?: string;
  district?: string;
  address?: string;
  latitude: number;
  longitude: number;

  // Images
  logoUri?: string;
  imageUris?: string[];
}

export interface BusinessListFilters {
  searchText?: string;
  categoryIds?: string[];
}

export interface BusinessListRecord {
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
    canton_loc: string | null;
    district_loc: string | null;
    province_loc: string | null;
  } | null;
  business_images?: {
    image_type_bim: 'logo' | 'cover' | 'gallery';
    bucket_bim: 'business-logos' | 'business-images';
    path_bim: string;
    sort_order_bim: number;
  }[] | null;
  promotions?: {
    id_prm: string;
  }[] | null;
}

export async function uploadImageToStorage(
  imageUri: string,
  bucket: 'business-logos' | 'business-images',
  businessId: string,
  fileName: string
): Promise<string> {
  try {
    let blob: Blob;

    // Detectar si es web (blob URI) o mobile (file URI)
    if (Platform.OS === 'web' || imageUri.startsWith('blob:')) {
      const response = await fetch(imageUri);
      blob = await response.blob();
    } else {
      // Leer archivo como base64 (mobile)
      const base64Data = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });

      // Crear Blob desde base64
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const fileExt = fileName.split('.').pop() || 'jpg';
      blob = new Blob([byteArray], { type: `image/${fileExt}` });
    }

    // Obtener extensión
    const fileExt = fileName.split('.').pop() || 'jpg';
    const filePath = `${businessId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Subir a Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, blob, {
        contentType: `image/${fileExt}`,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return filePath;
  } catch (error) {
    throw error;
  }
}

export async function saveBusinessImageReference(
  businessId: string,
  bucket: 'business-logos' | 'business-images',
  filePath: string,
  sortOrder: number = 0
): Promise<void> {
  const { error } = await supabase
    .from('business_images')
    .insert({
      id_BIM: generateUUID(),
      business_id_BIM: businessId,
      bucket_BIM: bucket,
      path_BIM: filePath,
      sort_order_BIM: sortOrder,
    });

  if (error) {
    throw error;
  }
}

export function getImageUrl(bucket: 'business-logos' | 'business-images', filePath: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function createBusiness(input: CreateBusinessInput): Promise<Business> {
  // 1️⃣ Crear ubicación
  const { data: location, error: locationError } = await supabase
    .from('locations')
    .insert({
      country_LOC: input.country ?? null,
      province_LOC: input.province ?? null,
      canton_LOC: input.canton ?? null,
      district_LOC: input.district ?? null,
      address_LOC: input.address ?? null,
      latitude_LOC: input.latitude,
      longitude_LOC: input.longitude,
    })
    .select()
    .single();

  if (locationError) throw locationError;

  // 2️⃣ Crear comercio
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .insert({
      owner_id_BUS: input.ownerId,
      name_BUS: input.name,
      description_BUS: input.description ?? null,
      location_id_BUS: location.id_LOC,

      whatsapp_phone_BUS: input.whatsapp ?? null,
      contact_phone_BUS: input.phone ?? null,
      contact_email_BUS: input.email ?? null,
      website_BUS: input.website ?? null,

      moderation_status_BUS: 'pending',
    })
    .select()
    .single();

  if (businessError) throw businessError;

  // 3️⃣ Subir logo si existe
  if (input.logoUri && business.id_BUS) {
    try {
      const logoPath = await uploadImageToStorage(
        input.logoUri,
        'business-logos',
        business.id_BUS,
        'logo.png'
      );
      await saveBusinessImageReference(business.id_BUS, 'business-logos', logoPath, 0);
    } catch (error) {
      // No lanzar error si falla el logo, continuar
    }
  }

  // 4️⃣ Subir imágenes del negocio si existen
  if (input.imageUris && input.imageUris.length > 0 && business.id_BUS) {
    try {
      for (let i = 0; i < input.imageUris.length; i++) {
        const imagePath = await uploadImageToStorage(
          input.imageUris[i],
          'business-images',
          business.id_BUS,
          `image-${i}.png`
        );
        await saveBusinessImageReference(business.id_BUS, 'business-images', imagePath, i);
      }
    } catch (error) {
      // No lanzar error si fallan las imágenes, continuar
    }
  }

  return business;
}

export async function getBusinessList(filters: BusinessListFilters = {}): Promise<BusinessListRecord[]> {
  const { searchText, categoryIds } = filters;

  const now = new Date().toISOString();
  
  let query = supabase
    .from('businesses')
    .select(`
      id_bus,
      name_bus,
      description_bus,
      moderation_status_bus,
      is_active_bus,
      avg_rating_bus,
      reviews_count_bus,
      business_category_map!inner (
        categories!inner (
          id_cat,
          name_cat
        )
      ),
      locations ( canton_loc, district_loc, province_loc ),
      business_images ( image_type_bim, bucket_bim, path_bim, sort_order_bim ),
      promotions!business_id_prm (
        id_prm
      )
    `);
  // .eq('moderation_status_bus', 'approved'); // Comentado temporalmente para testing

  // Filtrar promociones activas en la relación
  query = query
    .eq('promotions.moderation_status_prm', 'approved')
    .eq('promotions.payment_state_prm', 'paid')
    .lte('promotions.start_at_prm', now)
    .gte('promotions.end_at_prm', now);

  // Filtrar por categorías usando la tabla de relación
  if (categoryIds && categoryIds.length > 0) {
    query = query.in('business_category_map.category_id_bcm', categoryIds);
  }

  if (searchText && searchText.trim().length > 0) {
    const term = searchText.trim();
    query = query.or(`name_bus.ilike.%${term}%,description_bus.ilike.%${term}%`);
  }

  query = query.order('created_at_bus', { ascending: false });

  const { data, error } = await query;

  if (error) {
    return [] as BusinessListRecord[];
  }

  return (data ?? []) as unknown as BusinessListRecord[];
}

export async function getAllBusinesses(): Promise<BusinessWithRelations[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select(`
      id_BUS,
      name_BUS,
      description_BUS,
      moderation_status_BUS,
      is_active_BUS,
      whatsapp_phone_BUS,
      contact_phone_BUS,
      contact_email_BUS,
      website_BUS,
      business_images ( bucket_bim, path_bim, sort_order_bim ),
      locations ( district_LOC, canton_LOC, province_LOC )
    `)
    .neq('moderation_status_BUS', 'rejected')
    .order('created_at_BUS', { ascending: false });

  if (error) throw error;
  return data as any;
}

export async function getBusinessesByOwner(ownerId: string) {
  const { data, error } = await supabase
    .from('businesses')
    .select(`
      id_BUS,
      name_BUS,
      description_BUS,
      moderation_status_BUS,
      is_active_BUS
    `)
    .eq('owner_id_BUS', ownerId)
    .order('created_at_BUS', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getBusinessById(id: string): Promise<BusinessWithRelations> {
  const { data, error } = await supabase
    .from('businesses')
    .select(`
      id_BUS,
      name_BUS,
      description_BUS,
      moderation_status_BUS,

      whatsapp_phone_BUS,
      contact_phone_BUS,
      contact_email_BUS,
      website_BUS,

      business_categories (
        name_BCA
      ),

      locations (
        country_LOC,
        province_LOC,
        canton_LOC,
        district_LOC,
        address_LOC,
        latitude_LOC,
        longitude_LOC
      ),

      business_images (
        bucket_BIM,
        path_BIM,
        sort_order_BIM
      )
    `)
    .eq('id_BUS', id)
    .single();

  if (error) throw error;
  return data as any;
}
