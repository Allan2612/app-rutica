import { supabase } from '@/lib/supabase/client';
import type { LocationFilter } from '@/utils/splitItemsByLocation';

/** Tamaño de página de los listados públicos (5.14). */
export const PAGE_SIZE = 20;

export interface Page<T> {
  rows: T[];
  total: number;
}

/** Página, zona y modo comunes a los listados públicos. */
export interface ListScope {
  page?: number;
  location?: LocationFilter | null;
  /** 'only': solo la zona elegida; 'exclude': todo lo demás. Sin zona no filtra. */
  locationMode?: 'only' | 'exclude';
}

export const EMPTY_PAGE: Page<never> = { rows: [], total: 0 };

export function pageRange(page = 0): [number, number] {
  const from = page * PAGE_SIZE;
  return [from, from + PAGE_SIZE - 1];
}

export function hasLocation(location?: LocationFilter | null): location is LocationFilter {
  return Boolean(location && (location.province || location.canton || location.district));
}

// shortcut: caché en memoria de 5 min por zona, y los IDs viajan en la URL (~37 caracteres cada uno).
// Sirve hasta ~150 ubicaciones por zona; con más, pasar el filtro a una RPC o filtrar por distritos.
const locationCache = new Map<string, { at: number; ids: string[] }>();
const LOCATION_TTL = 5 * 60 * 1000;

/**
 * Traduce provincia/cantón/distrito (nombres del locationStore) a los IDs de `locations`
 * de esa zona (5.15). Usa todos los niveles presentes porque hay distritos con el mismo
 * nombre en cantones distintos. Devuelve null si no hay zona.
 */
export async function resolveLocationIds(
  location?: LocationFilter | null,
): Promise<string[] | null> {
  if (!hasLocation(location)) return null;
  const key = JSON.stringify([location.province, location.canton, location.district]);
  const cached = locationCache.get(key);
  if (cached && Date.now() - cached.at < LOCATION_TTL) return cached.ids;

  let query = supabase
    .from('locations')
    .select(
      'id_loc, districts!inner(name_dst, cantons!inner(name_ctn, provinces!inner(name_prv)))',
    );
  if (location.district) query = query.eq('districts.name_dst', location.district);
  if (location.canton) query = query.eq('districts.cantons.name_ctn', location.canton);
  if (location.province)
    query = query.eq('districts.cantons.provinces.name_prv', location.province);

  const { data, error } = await query;
  if (error) throw error;
  const ids = ((data ?? []) as { id_loc: string }[]).map((l) => l.id_loc);
  locationCache.set(key, { at: Date.now(), ids });
  return ids;
}

/**
 * Aplica la zona a una consulta filtrando por la columna de ubicación (`location_id_*`).
 * Devuelve null cuando el resultado es vacío por definición (modo 'only' sin ubicaciones).
 * `referencedTable` es para filtrar por una tabla embebida con !inner (promociones → comercio).
 */
export function applyLocation<Q>(
  query: Q,
  column: string,
  ids: string[] | null,
  mode: ListScope['locationMode'] = 'only',
  referencedTable?: string,
): Q | null {
  if (ids === null) return query;
  const q = query as any;
  const col = referencedTable ? `${referencedTable}.${column}` : column;
  if (mode === 'only') return ids.length ? q.in(col, ids) : null;
  if (!ids.length) return query;
  return q.or(
    `${column}.is.null,${column}.not.in.(${ids.join(',')})`,
    referencedTable ? { referencedTable } : undefined,
  );
}
