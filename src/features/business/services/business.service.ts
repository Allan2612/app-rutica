import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import { Business, BusinessWithRelations, Location } from '@/types/entities';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

const BUCKET_LOGO = 'business-images';
const BUCKET_IMAGES = 'business-images';

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

  // Location (V3: uses districtId FK)
  districtId: string;
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
  province?: string;
  canton?: string;
  district?: string;
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

export async function uploadImageToStorage(
  imageUri: string,
  businessId: string,
  fileName: string
): Promise<string> {
  try {
    let fileData: Blob | ArrayBuffer;

    // Detectar si es web (blob URI) o mobile (file URI)
    if (Platform.OS === 'web' || imageUri.startsWith('blob:')) {
      const response = await fetch(imageUri);
      fileData = await response.blob();
    } else {
      // Leer archivo como base64 (mobile)
      const base64Data = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });

      // Crear ArrayBuffer desde base64 para React Native
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      // Usar ArrayBuffer directamente en lugar de Blob para React Native
      fileData = byteArray.buffer;
    }

    // Obtener extensión
    const fileExt = fileName.split('.').pop() || 'jpg';
    const filePath = `${businessId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Subir a Supabase
    const { data, error } = await supabase.storage
      .from(BUCKET_IMAGES)
      .upload(filePath, fileData, {
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
  filePath: string,
  sortOrder: number = 0
): Promise<void> {
  const { error } = await (supabase as any)
    .from('business_images')
    .insert({
      id_bim: generateUUID(),
      business_id_bim: businessId,
      path_bim: filePath,
      sort_order_bim: sortOrder,
    });

  if (error) {
    throw error;
  }
}

export function getImageUrl(filePath: string): string {
  const { data } = supabase.storage.from(BUCKET_IMAGES).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function createBusiness(input: CreateBusinessInput): Promise<Business> {
  // 1️⃣ Crear ubicación (V3: solo district_id, address y coordenadas)
  const { data: location, error: locationError } = await (supabase as any)
    .from('locations')
    .insert({
      id_loc: generateUUID(),
      district_id_loc: input.districtId,
      address_loc: input.address ?? null,
      latitude_loc: input.latitude,
      longitude_loc: input.longitude,
    })
    .select()
    .single();

  if (locationError) throw locationError;

  // 2️⃣ Crear comercio
  const { data: business, error: businessError } = await (supabase as any)
    .from('businesses')
    .insert({
      id_bus: generateUUID(),
      owner_id_bus: input.ownerId,
      name_bus: input.name,
      description_bus: input.description ?? null,
      location_id_bus: (location as any).id_loc,

      whatsapp_phone_bus: input.whatsapp ?? null,
      contact_phone_bus: input.phone ?? null,
      contact_email_bus: input.email ?? null,
      website_bus: input.website ?? null,

      moderation_status_bus: 'pending',
    })
    .select()
    .single();

  if (businessError) throw businessError;

  // 3️⃣ Subir logo si existe (V3: sort_order=0 para logo)
  if (input.logoUri && (business as any).id_bus) {
    try {
      const logoPath = await uploadImageToStorage(
        input.logoUri,
        (business as any).id_bus,
        'logo.png'
      );
      await saveBusinessImageReference((business as any).id_bus, logoPath, 0);
    } catch (error) {
      // No lanzar error si falla el logo, continuar
    }
  }

  // 4️⃣ Subir imágenes del negocio si existen
  if (input.imageUris && input.imageUris.length > 0 && (business as any).id_bus) {
    try {
      for (let i = 0; i < input.imageUris.length; i++) {
        const imagePath = await uploadImageToStorage(
          input.imageUris[i],
          (business as any).id_bus,
          `gallery-${i}.png`
        );
        await saveBusinessImageReference((business as any).id_bus, imagePath, i + 1);
      }
    } catch (error) {
      // No lanzar error si fallan las imágenes, continuar
    }
  }

  return business as any;
}

export async function getBusinessList(filters: BusinessListFilters = {}): Promise<BusinessListRecord[]> {
  const { searchText, categoryIds } = filters;

  const now = new Date().toISOString();

  let query = (supabase as any)
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
    `);

  // Solo negocios aprobados y activos
  query = query
    .eq('moderation_status_bus', 'approved')
    .eq('is_active_bus', true);

  // Filtrar promociones activas en la relación
  query = query
    .eq('promotions.moderation_status_prm', 'approved')
    .eq('promotions.is_active_prm', true)
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
  const { data, error } = await (supabase as any)
    .from('businesses')
    .select(`
      id_bus,
      name_bus,
      description_bus,
      moderation_status_bus,
      is_active_bus,
      whatsapp_phone_bus,
      contact_phone_bus,
      contact_email_bus,
      website_bus,
      business_images ( path_bim, sort_order_bim ),
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
      )
    `)
    .neq('moderation_status_bus', 'rejected')
    .order('created_at_bus', { ascending: false });

  if (error) throw error;
  return data as any;
}

export async function getBusinessesByOwner(ownerId: string) {
  const { data, error } = await (supabase as any)
    .from('businesses')
    .select(`
      id_bus,
      name_bus,
      description_bus,
      moderation_status_bus,
      is_active_bus
    `)
    .eq('owner_id_bus', ownerId)
    .order('created_at_bus', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getBusinessById(id: string): Promise<BusinessWithRelations> {
  const { data, error } = await (supabase as any)
    .from('businesses')
    .select(`
      id_bus,
      name_bus,
      description_bus,
      moderation_status_bus,

      whatsapp_phone_bus,
      contact_phone_bus,
      contact_email_bus,
      website_bus,

      business_category_map (
        categories (
          name_cat
        )
      ),

      locations!location_id_bus (
        district_id_loc,
        address_loc,
        latitude_loc,
        longitude_loc,
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

      business_images (
        path_bim,
        sort_order_bim
      )
    `)
    .eq('id_bus', id)
    .single();

  if (error) throw error;
  return data as any;
}
