import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

const BUCKET_NAME = 'business-images';

export function getImageUrl(filePath: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return data.publicUrl;
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function isNewImage(uri: string | null | undefined): boolean {
  if (!uri) return false;
  return (
    !uri.includes('supabase.co') &&
    (uri.startsWith('file://') || uri.startsWith('blob:') || uri.startsWith('data:'))
  );
}

export async function uploadImage(
  businessId: string,
  imageUri: string,
  fileName: string,
): Promise<string> {
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

  const fileExt = fileName.split('.').pop() || 'jpg';
  const filePath = `${businessId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, fileData, {
    contentType: `image/${fileExt}`,
    upsert: false,
  });

  if (error) throw error;
  return filePath;
}
