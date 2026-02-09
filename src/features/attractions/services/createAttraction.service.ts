import { supabase } from '@/lib/supabase/client';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import {
  findOrCreateLocationHierarchy,
  validateLocationData,
  type LocationHierarchy,
} from '@/services/locations.service';

// ============================================
// Constants
// ============================================

const BUCKET_NAME = 'attractions-images';

// ============================================
// Helpers
// ============================================

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================
// Types
// ============================================

export interface CreateAttractionData {
  name: string;
  description: string | null;
  categoryIds: string[];
  country: string; // Nombre del país
  province: string; // Nombre de la provincia
  canton: string; // Nombre del cantón
  district: string; // Nombre del distrito
  address: string | null;
  latitude: number;
  longitude: number;
  coverUri: string | null;
  galleryUris: string[];
  isActive?: boolean;
}

// ============================================
// Image Upload
// ============================================

async function uploadImage(
  imageUri: string,
  attractionId: string,
  imageType: 'cover' | 'gallery',
  index: number,
): Promise<string> {
  try {
    let uploadData: Blob | ArrayBuffer;
    let fileExt = 'jpg';

    if (Platform.OS === 'web' || imageUri.startsWith('blob:')) {
      const response = await fetch(imageUri);
      uploadData = await response.blob();
      const mimeType = (uploadData as Blob).type;
      if (mimeType === 'image/png') fileExt = 'png';
      else if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') fileExt = 'jpg';
      else if (mimeType === 'image/webp') fileExt = 'webp';
    } else {
      const uriParts = imageUri.split('.');
      if (uriParts.length > 1) {
        const lastPart = uriParts[uriParts.length - 1].toLowerCase();
        if (['jpg', 'jpeg', 'png', 'webp'].includes(lastPart)) {
          fileExt = lastPart === 'jpeg' ? 'jpg' : lastPart;
        }
      }

      const base64Data = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      uploadData = byteArray.buffer;
    }

    // V3: Path format -> <attraction_id>/<prefix>-<timestamp>-<random>.<ext>
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const prefix = imageType === 'cover' ? 'cover' : `gallery`;
    const filePath = `${attractionId}/${prefix}-${timestamp}-${random}.${fileExt}`;

    const contentType =
      fileExt === 'png' ? 'image/png' : fileExt === 'webp' ? 'image/webp' : 'image/jpeg';

    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, uploadData, {
      contentType,
      upsert: false,
    });

    if (error) throw error;
    return filePath;
  } catch (error) {
    console.error('[uploadImage] Error:', error);
    throw error;
  }
}

// ============================================
// Main Service Function
// ============================================

export async function createAttractionComplete(
  userId: string,
  data: CreateAttractionData,
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

    // 4. Crear atracción
    const attractionId = generateUUID();

    const { error: attractionError } = await supabase.from('attractions').insert({
      id_atr: attractionId,
      submitted_by_atr: userId,
      name_atr: data.name,
      description_atr: data.description,
      location_id_atr: (location as any).id_loc,
      moderation_status_atr: 'pending',
      is_active_atr: data.isActive ?? true,
    } as never);

    if (attractionError) throw attractionError;

    // 4. Asociar categorías
    if (data.categoryIds.length > 0) {
      const categoryMaps = data.categoryIds.map((catId) => ({
        attraction_id_acm: attractionId,
        category_id_acm: catId,
      }));

      const { error: categoryError } = await supabase
        .from('attraction_category_map')
        .insert(categoryMaps as never);

      if (categoryError) {
        console.error('[createAttraction] Category map error:', categoryError);
      }
    }

    // 5. Subir imágenes (V3: solo path_aim, sin bucket_aim ni image_type_aim)
    const imagePromises: Promise<void>[] = [];

    // Cover
    if (data.coverUri) {
      imagePromises.push(
        (async () => {
          try {
            const filePath = await uploadImage(data.coverUri!, attractionId, 'cover', 0);
            const { error: insertError } = await supabase.from('attraction_images').insert({
              attraction_id_aim: attractionId,
              path_aim: filePath,
              sort_order_aim: 0,
            } as never);
            if (insertError) {
              console.error('[createAttraction] Cover image insert error:', insertError);
            }
          } catch (error) {
            console.error('[createAttraction] Cover upload error:', error);
          }
        })(),
      );
    }

    // Gallery (hasta 3)
    data.galleryUris.forEach((uri, index) => {
      imagePromises.push(
        (async () => {
          try {
            const filePath = await uploadImage(uri, attractionId, 'gallery', index);
            const { error: insertError } = await supabase.from('attraction_images').insert({
              attraction_id_aim: attractionId,
              path_aim: filePath,
              sort_order_aim: index + 1,
            } as never);
            if (insertError) {
              console.error('[createAttraction] Gallery image insert error:', insertError);
            }
          } catch (error) {
            console.error('[createAttraction] Gallery upload error:', error);
          }
        })(),
      );
    });

    await Promise.all(imagePromises);

    return attractionId;
  } catch (error) {
    console.error('[createAttractionComplete] Error:', error);
    throw error;
  }
}
