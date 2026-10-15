/**
 * Helpers para armar filtros de búsqueda de PostgREST con texto del usuario.
 */

/** Escapa los comodines de LIKE (`%`, `_`) y la barra para buscar el texto literal. */
export function escapeLike(term: string): string {
  return term.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/**
 * Construye el string para `.or()` con un `ilike` por columna.
 * El valor va entre comillas dobles para que comas, puntos y paréntesis del usuario
 * ("Café, bar", "Soda (La Esquina)") no rompan la sintaxis de PostgREST.
 *
 * @example query.or(buildIlikeOr(['name_bus', 'description_bus'], 'Café, bar'))
 */
export function buildIlikeOr(columns: string[], term: string): string {
  const pattern = `%${escapeLike(term.trim())}%`;
  const quoted = `"${pattern.replace(/["\\]/g, (c) => `\\${c}`)}"`;
  return columns.map((col) => `${col}.ilike.${quoted}`).join(',');
}

/** Patrón para `.ilike(columna, patrón)` con el texto escapado. */
export function ilikePattern(term: string): string {
  return `%${escapeLike(term.trim())}%`;
}
