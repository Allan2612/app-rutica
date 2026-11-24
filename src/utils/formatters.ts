/**
 * Funciones de formateo unificadas
 * Centraliza formateo de precios, fechas y otros valores comunes
 */

/**
 * Formatea un precio según la moneda especificada
 * @param value Valor numérico a formatear
 * @param currency Código de moneda ('CRC' | 'USD')
 * @returns Precio formateado con símbolo de moneda
 */
export function formatPrice(value: number, currency: string = 'CRC'): string {
  if (currency === 'CRC') {
    return `₡${value.toLocaleString('es-CR')}`;
  }
  if (currency === 'USD') {
    return `$${value.toFixed(2)}`;
  }
  return `${currency} ${value}`;
}

/**
 * Opciones predefinidas de formato de fecha
 */
export const DATE_FORMAT_OPTIONS = {
  /** día y mes largo: "15 de enero" */
  dayMonthLong: { day: 'numeric', month: 'long' } as Intl.DateTimeFormatOptions,
  /** día y mes corto: "15 ene" */
  dayMonthShort: { day: 'numeric', month: 'short' } as Intl.DateTimeFormatOptions,
  /** fecha completa: "15/1/2025" */
  full: { day: 'numeric', month: 'numeric', year: 'numeric' } as Intl.DateTimeFormatOptions,
  /** fecha con año corto: "15 ene 2025" */
  withYear: { year: 'numeric', month: 'short', day: 'numeric' } as Intl.DateTimeFormatOptions,
} as const;

/**
 * Formatea una fecha a formato legible en español de Costa Rica
 * @param dateString Fecha en formato ISO string
 * @param options Opciones de formato (opcional)
 * @returns Fecha formateada
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = DATE_FORMAT_OPTIONS.dayMonthLong,
): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CR', options);
}

/**
 * Formatea un rango de fechas para mostrar vigencia
 * @param startAt Fecha de inicio
 * @param endAt Fecha de fin
 * @returns Rango formateado "Válido del X al Y de Mes"
 */
export function formatDateRange(startAt: string, endAt: string): string {
  const start = new Date(startAt);
  const end = new Date(endAt);

  const startDay = start.getDate();
  const endDay = end.getDate();

  // Si están en el mismo mes
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    const month = start.toLocaleDateString('es-CR', { month: 'long' });
    return `Válido del ${startDay} al ${endDay} de ${month}`;
  }

  // Si están en diferentes meses
  const startMonth = start.toLocaleDateString('es-CR', { month: 'short' });
  const endMonth = end.toLocaleDateString('es-CR', { month: 'short' });
  return `Válido del ${startDay} ${startMonth} al ${endDay} ${endMonth}`;
}

/**
 * Formatea días restantes de una promoción
 * @param endAt Fecha de fin de la promoción
 * @returns String con días restantes o "Último día"
 */
export function formatDaysRemaining(endAt: string): string {
  const end = new Date(endAt);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 'Expirada';
  }
  if (diffDays === 1) {
    return 'Último día';
  }
  return `${diffDays} días restantes`;
}

/**
 * Formatea un número con separador de miles
 * @param value Número a formatear
 * @returns String con separadores de miles
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('es-CR');
}

/**
 * Trunca un texto a un número máximo de caracteres
 * @param text Texto a truncar
 * @param maxLength Longitud máxima
 * @returns Texto truncado con "..." si excede
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
}

/**
 * Nombre visible de una persona sin "null"/"undefined" cuando falta algún campo.
 * @example formatPersonName('María', null) → 'María'
 */
export function formatPersonName(
  firstName?: string | null,
  lastName?: string | null,
  fallback = 'Usuario',
): string {
  return (
    [firstName, lastName]
      .filter((p) => p && p.trim())
      .join(' ')
      .trim() || fallback
  );
}

/** Iniciales de un nombre ("Ana María Soto" → "AM"); tolera espacios dobles y nombres vacíos. */
export function getNameInitials(name: string | null | undefined): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (parts[0] ?? '?').substring(0, 2).toUpperCase();
}

/** "Ahora", "Hace 5 min", "Hace 3h", "Hace 2d" o la fecha corta. */
export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return date.toLocaleDateString('es-CR', { day: 'numeric', month: 'short' });
}

/** "Hoy", "Ayer", "Hace N días" o la fecha corta (reseñas). */
export function getDaysAgo(dateString: string): string {
  const date = new Date(dateString);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays < 1) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-CR', { day: 'numeric', month: 'short' });
}
