/**
 * Helpers para el manejo de promociones
 * Funciones utilitarias para imágenes, UUID, etc.
 */

import { supabase } from '@/lib/supabase/client';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const BUCKET_NAME = 'promotions-images';

/**
 * Genera un UUID v4
 */
export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Obtiene la URL pública de una imagen en el storage
 */
export function getImageUrl(bucket: string, filePath: string): string {
    // Limpiar el path de cualquier prefijo no deseado
    const cleanPath = filePath.replace(/^\/+/, '');
    
    const { data } = supabase.storage.from(bucket).getPublicUrl(cleanPath);
    
    // Retornar la URL directamente
    // Supabase ya genera la URL correcta: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    return data.publicUrl;
}

/**
 * Determina si una URI es una imagen nueva (local) o existente (ya en storage)
 */
export function isNewImage(uri: string | null | undefined): boolean {
    if (!uri) return false;
    return (
        !uri.includes('supabase.co') &&
        (uri.startsWith('file://') || uri.startsWith('blob:') || uri.startsWith('data:'))
    );
}

/**
 * Sube una imagen al bucket de promociones
 */
export async function uploadPromotionImage(
    promotionId: string,
    imageUri: string,
    imageType: 'flyer'
): Promise<string> {
    let blob: Blob;

    if (Platform.OS === 'web' || imageUri.startsWith('blob:')) {
        const response = await fetch(imageUri);
        blob = await response.blob();
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
        blob = new Blob([byteArray], { type: 'image/jpeg' });
    }

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const filePath = `${promotionId}/${imageType}-${timestamp}-${randomStr}.jpg`;

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, blob, {
            contentType: 'image/jpeg',
            upsert: false,
        });

    if (error) throw error;
    return filePath;
}

/**
 * Elimina una imagen del bucket de promociones
 */
export async function deletePromotionImage(filePath: string): Promise<void> {
    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

    if (error) {
        console.error('Error deleting promotion image:', error);
    }
}

/**
 * Extrae el path de una URL de storage
 */
export function extractPathFromUrl(url: string): string | null {
    if (!url.includes('supabase.co')) return null;
    
    const match = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/);
    return match ? match[1] : null;
}
