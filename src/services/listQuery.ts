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

// Caché en memoria de 5 min por zona. Son IDs de distrito: dependen de la geografía (Costa Rica
// tiene ~490 distritos; una provincia, ~120), no de cuántos comercios haya, así que la URL no crece.
const districtCache = new Map<string, { at: number; ids: string[] }>();
const DISTRICT_TTL = 5 * 60 * 1000;

/**
 * Traduce provincia/cantón/distrito (nombres del locationStore) a los IDs de `districts` de esa
 * zona (5.15). Usa todos los niveles presentes porque hay distritos con el mismo nombre en
 * cantones distintos. Devuelve null si no hay zona.
 */
export async function resolveDistrictIds(
  location?: LocationFilter | null,
): Promise<string[] | null> {
  if (!hasLocation(location)) return null;
  const key = JSON.stringify([location.province, location.canton, location.district]);
  const cached = districtCache.get(key);
  if (cached && Date.now() - cached.at < DISTRICT_TTL) return cached.ids;

  let query = supabase
    .from('districts')
    .select('id_dst, cantons!inner(name_ctn, provinces!inner(name_prv))');
  if (location.district) query = query.eq('name_dst', location.district);
  if (location.canton) query = query.eq('cantons.name_ctn', location.canton);
  if (location.province) query = query.eq('cantons.provinces.name_prv', location.province);

  const { data, error } = await query;
  if (error) throw error;
  const ids = ((data ?? []) as { id_dst: string }[]).map((d) => d.id_dst);
  districtCache.set(key, { at: Date.now(), ids });
  return ids;
}

/** `!inner` para la relación con la ubicación solo cuando se filtra por zona. */
export const locationJoin = (ids: string[] | null) => (ids ? '!inner' : '');

/**
 * Aplica la zona filtrando por el distrito de la ubicación embebida (`path`, p. ej.
 * 'locations.district_id_loc'); la relación debe pedirse con `locationJoin(ids)`.
 * Devuelve null cuando el resultado es vacío por definición (modo 'only' sin distritos).
 * Con zona, lo que no tiene ubicación no aparece en ninguna de las dos secciones.
 */
export function applyLocation<Q>(
  query: Q,
  path: string,
  ids: string[] | null,
  mode: ListScope['locationMode'] = 'only',
): Q | null {
  if (ids === null) return query;
  const q = query as any;
  if (mode === 'only') return ids.length ? q.in(path, ids) : null;
  return ids.length ? q.not(path, 'in', `(${ids.join(',')})`) : query;
}
