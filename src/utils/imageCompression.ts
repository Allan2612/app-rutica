import { Image } from 'react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

/**
 * Compresión antes de subir (E5). Las fotos de cámara llegan a 3-16 MB; achicadas al lado
 * largo indicado y en JPEG 0.75 quedan en ~150-500 KB sin pérdida visible en pantalla.
 */
export const IMAGE_MAX_SIZE = {
  /** Portadas, galerías, productos, promociones */
  content: 1600,
  /** Logos y fotos de perfil (se ven chicas) */
  avatar: 512,
} as const;

const JPEG_QUALITY = 0.75;

function getSize(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) =>
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject),
  );
}

/**
 * Devuelve la URI de una copia achicada y comprimida. Si algo falla (formato raro, permisos),
 * devuelve la original para no bloquear la subida.
 */
export async function compressImage(uri: string, maxSize: number = IMAGE_MAX_SIZE.content) {
  try {
    const { width, height } = await getSize(uri);
    const longest = Math.max(width, height);
    const resize =
      longest > maxSize
        ? [{ resize: width >= height ? { width: maxSize } : { height: maxSize } }]
        : [];
    const result = await manipulateAsync(uri, resize, {
      compress: JPEG_QUALITY,
      format: SaveFormat.JPEG,
    });
    return result.uri;
  } catch (error) {
    console.warn('[compressImage] se sube la imagen original:', error);
    return uri;
  }
}
