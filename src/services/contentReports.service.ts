import { supabase } from '@/lib/supabase/client';

/**
 * Reportes de contenido (4.9). La tabla `content_reports` y sus reglas (un reporte por
 * persona y contenido, 20 por día, solo el admin los cierra) viven en la BD.
 */

export type ReportEntityType =
  | 'business'
  | 'event'
  | 'attraction'
  | 'product'
  | 'promotion'
  | 'business_review'
  | 'event_review'
  | 'attraction_review'
  | 'product_review';

export type ReportReason = 'spam' | 'offensive' | 'false_info' | 'illegal' | 'copyright' | 'other';
export type ReportStatus = 'open' | 'actioned' | 'dismissed';

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'spam', label: 'Spam o publicidad engañosa' },
  { value: 'offensive', label: 'Contenido ofensivo o de odio' },
  { value: 'false_info', label: 'Información falsa' },
  { value: 'illegal', label: 'Actividad ilegal o peligrosa' },
  { value: 'copyright', label: 'Usa fotos o marcas ajenas' },
  { value: 'other', label: 'Otro motivo' },
];

export const REPORT_ENTITY_LABELS: Record<ReportEntityType, string> = {
  business: 'Comercio',
  event: 'Evento',
  attraction: 'Atracción',
  product: 'Producto',
  promotion: 'Promoción',
  business_review: 'Reseña de comercio',
  event_review: 'Reseña de evento',
  attraction_review: 'Reseña de atracción',
  product_review: 'Reseña de producto',
};

export interface ContentReport {
  id: string;
  entityType: ReportEntityType;
  entityId: string;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  createdAt: string;
  /** Nombre o texto del contenido reportado (null si ya no existe) */
  entityLabel: string | null;
  /** Ruta pública para abrir el contenido, si tiene */
  entityHref: string | null;
}

export async function reportContent(input: {
  entityType: ReportEntityType;
  entityId: string;
  reason: ReportReason;
  details?: string;
}): Promise<void> {
  const { error } = await (supabase as any).from('content_reports').insert({
    entity_type_rep: input.entityType,
    entity_id_rep: input.entityId,
    reason_rep: input.reason,
    details_rep: input.details?.trim() || null,
  });
  if (!error) return;
  if (error.code === '23505')
    throw new Error('Ya reportaste este contenido. Lo estamos revisando.');
  if (error.code === 'P0001') {
    throw new Error('Llegaste al límite de reportes por hoy. Intenta mañana.');
  }
  throw new Error('No se pudo enviar el reporte. Intenta de nuevo.');
}

/** Tabla, columna id, columna de texto y ruta pública de cada tipo de contenido. */
const ENTITY_SOURCES: Record<
  ReportEntityType,
  { table: string; id: string; label: string; href?: (row: any) => string | null; parent?: string }
> = {
  business: {
    table: 'businesses',
    id: 'id_bus',
    label: 'name_bus',
    href: (r) => `/(app)/(tabs)/businesses/${r.id_bus}`,
  },
  event: {
    table: 'events',
    id: 'id_evt',
    label: 'name_evt',
    href: (r) => `/(app)/(tabs)/events/${r.id_evt}`,
  },
  attraction: {
    table: 'attractions',
    id: 'id_atr',
    label: 'name_atr',
    href: (r) => `/(app)/(tabs)/attractions/${r.id_atr}`,
  },
  product: {
    table: 'products',
    id: 'id_prd',
    label: 'name_prd',
    parent: 'business_id_prd',
    href: (r) => `/(app)/(tabs)/businesses/${r.business_id_prd}`,
  },
  promotion: {
    table: 'promotions',
    id: 'id_prm',
    label: 'title_prm',
    parent: 'business_id_prm',
    href: (r) => `/(app)/(tabs)/businesses/${r.business_id_prm}`,
  },
  business_review: {
    table: 'business_reviews',
    id: 'id_brv',
    label: 'comment_brv',
    parent: 'business_id_brv',
    href: (r) => `/(app)/(tabs)/businesses/${r.business_id_brv}`,
  },
  event_review: {
    table: 'event_reviews',
    id: 'id_erv',
    label: 'comment_erv',
    parent: 'event_id_erv',
    href: (r) => `/(app)/(tabs)/events/${r.event_id_erv}`,
  },
  attraction_review: {
    table: 'attraction_reviews',
    id: 'id_arv',
    label: 'comment_arv',
    parent: 'attraction_id_arv',
    href: (r) => `/(app)/(tabs)/attractions/${r.attraction_id_arv}`,
  },
  product_review: { table: 'product_reviews', id: 'id_prv', label: 'comment_prv' },
};

/** Lista de reportes para el admin (RLS: solo admin ve los de otros). */
export async function getContentReports(status: ReportStatus): Promise<ContentReport[]> {
  const { data, error } = await (supabase as any)
    .from('content_reports')
    .select(
      'id_rep, entity_type_rep, entity_id_rep, reason_rep, details_rep, status_rep, created_at_rep',
    )
    .eq('status_rep', status)
    .order('created_at_rep', { ascending: status !== 'open' ? false : true })
    .limit(200);
  if (error) throw error;
  const rows = (data ?? []) as any[];

  // Un select por tipo de contenido para mostrar qué se reportó
  const byType = new Map<ReportEntityType, string[]>();
  rows.forEach((r) =>
    byType.set(r.entity_type_rep, [...(byType.get(r.entity_type_rep) ?? []), r.entity_id_rep]),
  );
  const found = new Map<string, any>();
  await Promise.all(
    [...byType].map(async ([type, ids]) => {
      const src = ENTITY_SOURCES[type];
      const cols = [src.id, src.label, src.parent].filter(Boolean).join(',');
      const { data: entities } = await (supabase as any)
        .from(src.table)
        .select(cols)
        .in(src.id, ids);
      (entities ?? []).forEach((e: any) => found.set(`${type}:${e[src.id]}`, e));
    }),
  );

  return rows.map((r) => {
    const type = r.entity_type_rep as ReportEntityType;
    const entity = found.get(`${type}:${r.entity_id_rep}`);
    const src = ENTITY_SOURCES[type];
    return {
      id: r.id_rep,
      entityType: type,
      entityId: r.entity_id_rep,
      reason: r.reason_rep,
      details: r.details_rep,
      status: r.status_rep,
      createdAt: r.created_at_rep,
      entityLabel: entity ? (entity[src.label] ?? '(sin texto)') : null,
      entityHref: entity && src.href ? src.href(entity) : null,
    };
  });
}

export async function setContentReportStatus(id: string, status: Exclude<ReportStatus, 'open'>) {
  const { data: auth } = await supabase.auth.getSession();
  const { error } = await (supabase as any)
    .from('content_reports')
    .update({
      status_rep: status,
      reviewed_by_rep: auth.session?.user.id ?? null,
      reviewed_at_rep: new Date().toISOString(),
    })
    .eq('id_rep', id);
  if (error) throw error;
}

/** Cantidad de reportes abiertos, para el contador del panel de admin. */
export async function countOpenReports(): Promise<number> {
  const { count, error } = await (supabase as any)
    .from('content_reports')
    .select('id_rep', { count: 'exact', head: true })
    .eq('status_rep', 'open');
  if (error) throw error;
  return count ?? 0;
}
