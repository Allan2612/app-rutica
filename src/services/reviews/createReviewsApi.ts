import { supabase } from '@/lib/supabase/client';
import { validateReviewContent } from '@/services/contentModeration.service';
import { getLikeCounts, getUserLikedIds } from '@/services/likeCounts.service';
import { formatPersonName } from '@/utils/formatters';
import { pageRange, type Page } from '@/services/listQuery';
import { IMAGE_WIDTH, publicStorageUrl } from '@/utils/storage';

/**
 * Fábrica de servicios de reseñas para negocio, evento y atracción.
 *
 * Antes había tres copias casi idénticas (~350 líneas cada una). Diferencias que resuelve:
 * - Un solo select con el autor embebido (sin round-trips extra por reseña ni al crear).
 * - Conteo de likes agregado y "mis likes" acotado a las reseñas mostradas.
 * - El rating promedio lo recalcula un trigger en la BD (ya no el cliente).
 * - Errores de RLS/constraints traducidos a mensajes claros.
 */

export interface ReviewDisplayBase {
  id: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  authorName: string;
  authorPhotoUrl: string | null;
  likesCount: number;
  isLikedByUser: boolean;
  /** Fecha en que un admin editó la reseña (null si no fue editada por moderación) */
  moderatedAt: string | null;
}

interface ReviewsApiConfig<K extends string> {
  table: 'business_reviews' | 'event_reviews' | 'attraction_reviews';
  /** Sufijo de columnas: brv | erv | arv */
  sfx: 'brv' | 'erv' | 'arv';
  /** Columna FK a la entidad (p. ej. business_id_brv) */
  entityColumn: string;
  /** Nombre de la FK hacia profiles para el embed */
  profileFk: string;
  likesTable: 'business_review_likes' | 'event_review_likes' | 'attraction_review_likes';
  /** Nombre de la propiedad de entidad en el objeto devuelto (businessId, eventId, ...) */
  entityKey: K;
}

type Display<K extends string> = ReviewDisplayBase & Record<K, string>;

function translateReviewError(error: { code?: string; message?: string }): Error {
  if (error.code === '23505') return new Error('Ya dejaste una reseña aquí. Puedes editarla.');
  if (error.code === '23514') return new Error('La calificación debe estar entre 1 y 5 estrellas.');
  if (error.message?.includes('row-level security')) {
    return new Error('No puedes dejar una reseña aquí (es tu publicación o aún no está aprobada).');
  }
  return new Error(error.message || 'No se pudo guardar la reseña');
}

export function createReviewsApi<K extends string>(cfg: ReviewsApiConfig<K>) {
  const c = (name: string) => `${name}_${cfg.sfx}`;
  const select = `*, profiles!${cfg.profileFk} ( first_name_prf, last_name1_prf, profile_photo_path_prf )`;

  function toDisplay(row: any, likes = 0, liked = false): Display<K> {
    const photo = row.profiles?.profile_photo_path_prf;
    return {
      id: row[c('id')],
      [cfg.entityKey]: row[cfg.entityColumn] ?? '',
      userId: row[c('user_id')] ?? '',
      rating: row[c('rating')] ?? 0,
      comment: row[c('comment')] ?? null,
      createdAt: row[c('created_at')],
      authorName: formatPersonName(row.profiles?.first_name_prf, row.profiles?.last_name1_prf),
      authorPhotoUrl: photo ? publicStorageUrl('profiles-images', photo, IMAGE_WIDTH.thumb) : null,
      likesCount: likes,
      isLikedByUser: liked,
      moderatedAt: row[c('moderated_at')] ?? null,
    } as Display<K>;
  }

  async function withLikes(rows: any[], userId?: string | null): Promise<Display<K>[]> {
    const ids = rows.map((r) => r[c('id')]);
    const [counts, liked] = await Promise.all([
      getLikeCounts(cfg.likesTable, ids),
      getUserLikedIds(cfg.likesTable, userId, ids),
    ]);
    return rows.map((r) => toDisplay(r, counts[r[c('id')]] ?? 0, liked.has(r[c('id')])));
  }

  return {
    async list(entityId: string, userId?: string, page = 0): Promise<Page<Display<K>>> {
      const [from, to] = pageRange(page);
      const { data, error, count } = await supabase
        .from(cfg.table)
        .select(select, { count: 'exact' })
        .eq(cfg.entityColumn, entityId)
        .order(c('created_at'), { ascending: false })
        .order(c('id'), { ascending: true })
        .range(from, to);
      if (error) throw error;
      return { rows: await withLikes(data ?? [], userId), total: count ?? 0 };
    },

    async getForUser(entityId: string, userId: string): Promise<Display<K> | null> {
      const { data, error } = await supabase
        .from(cfg.table)
        .select(select)
        .eq(cfg.entityColumn, entityId)
        .eq(c('user_id'), userId)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return (await withLikes([data], userId))[0];
    },

    async create(
      entityId: string,
      userId: string,
      rating: number,
      comment?: string,
    ): Promise<Display<K>> {
      if (comment) validateReviewContent(comment);
      const { data, error } = await supabase
        .from(cfg.table)
        .insert({
          [cfg.entityColumn]: entityId,
          [c('user_id')]: userId,
          [c('rating')]: rating,
          [c('comment')]: comment || null,
        })
        .select(select)
        .single();
      if (error) throw translateReviewError(error);
      return toDisplay(data);
    },

    async update(reviewId: string, rating: number, comment?: string): Promise<Display<K>> {
      if (comment) validateReviewContent(comment);
      const { data, error } = await supabase
        .from(cfg.table)
        .update({ [c('rating')]: rating, [c('comment')]: comment || null })
        .eq(c('id'), reviewId)
        .select(select)
        .single();
      if (error) throw translateReviewError(error);
      return toDisplay(data);
    },

    async remove(reviewId: string): Promise<void> {
      const { error } = await supabase.from(cfg.table).delete().eq(c('id'), reviewId);
      if (error) throw translateReviewError(error);
    },
  };
}
