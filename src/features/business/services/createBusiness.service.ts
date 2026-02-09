import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import {
  findOrCreateLocationHierarchy,
  validateLocationData,
  type LocationHierarchy,
} from '@/services/locations.service';

const BUCKET_NAME = 'business-images';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface CreateBusinessData {
  name: string;
  description?: string;
  categoryIds: string[];

  // Location data (nombres, se buscan/crean automáticamente)
  country: string;
  province: string;
  canton: string;
  district: string;
  address?: string;
  latitude: number;
  longitude: number;

  // Contact
  phone?: string;
  email?: string;
  website?: string;

  // Social Links
  facebook?: string;
  instagram?: string;
  tiktok?: string;

  // Images
  logoUri?: string | null;
  coverUri?: string | null;
  galleryUris: string[]; // Hasta 3

  // Status
  isActive?: boolean;
}

/**
 * Sube una imagen al storage y la registra en business_images
 * @param imageUri - URI local de la imagen
 * @param businessId - ID del negocio
 * @param type - Tipo de imagen: 'logo', 'cover', 'gallery'
 * @param sortOrder - Orden (0=logo, 1=cover, 2+=gallery)
 */
async function uploadImage(
  imageUri: string,
  businessId: string,
  type: 'logo' | 'cover' | 'gallery',
  sortOrder: number,
): Promise<void> {
  try {
    let fileData: Blob | ArrayBuffer;

    if (Platform.OS === 'web' || imageUri.startsWith('blob:')) {
      const response = await fetch(imageUri);
      fileData = await response.blob();
    } else {
      const base64Data = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      // Usar ArrayBuffer directamente en lugar de Blob para React Native
      fileData = byteArray.buffer;
    }

    // Estructura: {businessId}/logo-{uuid}.jpg, {businessId}/cover-{uuid}.jpg, {businessId}/gallery-{uuid}.jpg
    const imageId = generateUUID();
    let filePath: string;
    if (type === 'gallery') {
      filePath = `${businessId}/gallery-${imageId}.jpg`;
    } else {
      filePath = `${businessId}/${type}-${imageId}.jpg`;
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, fileData, {
      contentType: 'image/jpeg',
      upsert: true,
    });

    if (error) throw error;

    // Registrar en business_images
    const { error: insertError } = await (supabase as any).from('business_images').insert({
      id_bim: generateUUID(),
      business_id_bim: businessId,
      path_bim: filePath,
      sort_order_bim: sortOrder,
    });

    if (insertError) {
      console.error(`[uploadImage] Error insertando en business_images:`, insertError);
      throw insertError;
    }
  } catch (error) {
    console.error(`[uploadImage] Error subiendo ${type}:`, error);
    throw error;
  }
}

/**
 * Crea un nuevo negocio con toda su información
 */
export async function createBusinessComplete(
  userId: string,
  data: CreateBusinessData,
): Promise<string> {
  try {
    // 1. Validar datos de ubicación
    const locationHierarchy: LocationHierarchy = {
      country: data.country,
      province: data.province,
      canton: data.canton,
      district: data.district,
    };

    if (!validateLocationData(locationHierarchy)) {
      throw new Error('Datos de ubicación incompletos');
    }

    // 2. Buscar o crear la jerarquía de ubicación y obtener district_id
    const districtId = await findOrCreateLocationHierarchy(locationHierarchy);

    // 3. Crear registro en locations con las coordenadas
    const { data: location, error: locationError } = await (supabase as any)
      .from('locations')
      .insert({
        id_loc: generateUUID(),
        district_id_loc: districtId,
        address_loc: data.address ?? null,
        latitude_loc: data.latitude,
        longitude_loc: data.longitude,
      })
      .select()
      .single();

    if (locationError) throw locationError;

    // 4. Preparar social links
    const socialLinks: Record<string, string> = {};
    if (data.facebook) socialLinks.facebook = data.facebook;
    if (data.instagram) socialLinks.instagram = data.instagram;
    if (data.tiktok) socialLinks.tiktok = data.tiktok;

    // 5. Generar ID del negocio
    const businessId = generateUUID();

    // 6. Crear negocio primero
    const { error: businessError } = await (supabase as any).from('businesses').insert({
      id_bus: businessId,
      owner_id_bus: userId,
      name_bus: data.name,
      description_bus: data.description ?? null,
      location_id_bus: (location as any).id_loc,
      contact_phone_bus: data.phone ?? null,
      contact_email_bus: data.email ?? null,
      website_bus: data.website ?? null,
      social_links_bus: Object.keys(socialLinks).length > 0 ? socialLinks : null,
      is_active_bus: data.isActive ?? true,
    });

    if (businessError) throw businessError;

    // 7. Subir imágenes y registrar en business_images
    // Logo (sort_order = 0)
    if (data.logoUri) {
      try {
        await uploadImage(data.logoUri, businessId, 'logo', 0);
      } catch (error) {
        console.error('[createBusiness] Error subiendo logo:', error);
      }
    }

    // Cover (sort_order = 1)
    if (data.coverUri) {
      try {
        await uploadImage(data.coverUri, businessId, 'cover', 1);
      } catch (error) {
        console.error('[createBusiness] Error subiendo cover:', error);
      }
    }

    // Galería (sort_order = 2, 3, ...)
    // El límite real de cuota se aplica en el UI (MultipleImagePicker)
    if (data.galleryUris && data.galleryUris.length > 0) {
      for (let i = 0; i < data.galleryUris.length; i++) {
        try {
          await uploadImage(data.galleryUris[i], businessId, 'gallery', 2 + i);
        } catch (error) {
          console.error(`[createBusiness] Error subiendo imagen ${i + 1} de galería:`, error);
        }
      }
    }

    // 8. Crear categorías
    if (data.categoryIds.length > 0) {
      const categoryMaps = data.categoryIds.map((catId: string) => ({
        business_id_bcm: businessId,
        category_id_bcm: catId,
      }));

      const { error: categoryError } = await (supabase as any)
        .from('business_category_map')
        .insert(categoryMaps);

      if (categoryError) {
        console.error('[createBusiness] Error asociando categorías:', categoryError);
      }
    }

    return businessId;
  } catch (error) {
    console.error('[createBusinessComplete] Error:', error);
    throw error;
  }
}
