import { supabase } from '@/lib/supabase/client';

type LikeTable =
  | 'business_likes'
  | 'event_likes'
  | 'attraction_likes'
  | 'business_review_likes'
  | 'event_review_likes'
  | 'attraction_review_likes';

const TARGET_COLUMN: Record<LikeTable, string> = {
  business_likes: 'business_id_blk',
  event_likes: 'event_id_elk',
  attraction_likes: 'attraction_id_alk',
  business_review_likes: 'review_id_brl',
  event_review_likes: 'review_id_erl',
  attraction_review_likes: 'review_id_arl',
};

const USER_COLUMN: Record<LikeTable, string> = {
  business_likes: 'user_id_blk',
  event_likes: 'user_id_elk',
  attraction_likes: 'user_id_alk',
  business_review_likes: 'user_id_brl',
  event_review_likes: 'user_id_erl',
  attraction_review_likes: 'user_id_arl',
};

/**
 * Conteo de likes por id en una sola consulta agregada (RPC get_like_counts).
 * Los likes individuales ya no son públicos (S-18), así que contar filas desde el
 * cliente devolvería solo los propios.
 */
export async function getLikeCounts(table: LikeTable, ids: string[]): Promise<Record<string, number>> {
  const counts: Record<string, number> = Object.fromEntries(ids.map((id) => [id, 0]));
  if (ids.length === 0) return counts;

  const { data, error } = await supabase.rpc('get_like_counts', {
    p_table: table,
    p_ids: ids,
  });

  if (error) throw error;
  for (const row of (data ?? []) as { target_id: string; likes: number }[]) {
    counts[row.target_id] = Number(row.likes);
  }
  return counts;
}

/** Ids (de la lista dada) a los que el usuario dio like. Solo consulta esos ids. */
export async function getUserLikedIds(
  table: LikeTable,
  userId: string | undefined | null,
  ids: string[],
): Promise<Set<string>> {
  if (!userId || ids.length === 0) return new Set();
  const col = TARGET_COLUMN[table];
  const { data, error } = await supabase
    .from(table)
    .select(col)
    .eq(USER_COLUMN[table], userId)
    .in(col, ids);
  if (error) throw error;
  // Columna dinámica según la tabla: los tipos generados no la infieren
  return new Set(((data ?? []) as unknown as Record<string, string>[]).map((row) => row[col]));
}
