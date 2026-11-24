import { describe, expect, it, vi } from 'vitest';

// getPublicUrl falso: arma la URL como Supabase (object vs render/image)
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    storage: {
      from: (bucket: string) => ({
        getPublicUrl: (
          path: string,
          opts?: { transform?: { width: number; quality: number; resize?: string } },
        ) => ({
          data: {
            publicUrl: opts?.transform
              ? `https://x.supabase.co/storage/v1/render/image/public/${bucket}/${path}?width=${opts.transform.width}&quality=${opts.transform.quality}&resize=${opts.transform.resize}`
              : `https://x.supabase.co/storage/v1/object/public/${bucket}/${path}`,
          },
        }),
      }),
    },
  },
}));

const { publicStorageUrl, IMAGE_WIDTH, UPLOAD_CACHE_SECONDS, getImageTypeFromPath } =
  await import('@/utils/storage');

describe('publicStorageUrl', () => {
  it('sin ancho devuelve el original (los formularios de edición comparan esas URLs)', () => {
    expect(publicStorageUrl('business-images', 'b1/logo-1.jpg')).toBe(
      'https://x.supabase.co/storage/v1/object/public/business-images/b1/logo-1.jpg',
    );
  });

  it('con ancho pide la versión redimensionada', () => {
    expect(publicStorageUrl('business-images', '/b1/cover-1.jpg', IMAGE_WIDTH.card)).toBe(
      'https://x.supabase.co/storage/v1/render/image/public/business-images/b1/cover-1.jpg?width=640&quality=75&resize=contain',
    );
  });

  it('sin path devuelve vacío', () => {
    expect(publicStorageUrl('business-images', null, IMAGE_WIDTH.full)).toBe('');
  });
});

describe('caché y tipo de imagen', () => {
  it('las subidas se cachean un año (nombres únicos)', () => {
    expect(UPLOAD_CACHE_SECONDS).toBe('31536000');
  });

  it('el tipo sale del prefijo del archivo', () => {
    expect(getImageTypeFromPath('b1/gallery-123-abc.jpg')).toBe('gallery');
    expect(getImageTypeFromPath(null)).toBe('');
  });
});
