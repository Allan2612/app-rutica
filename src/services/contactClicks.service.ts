import { supabase } from '@/lib/supabase/client';

// ============================================
// Types
// ============================================

export type ContactType =
  | 'phone'
  | 'email'
  | 'website'
  | 'whatsapp'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'twitter'
  | 'linkedin'
  | 'other';

export type ContactPeriod = 7 | 15 | 30 | 90;

export interface ContactClickStats {
  contactType: ContactType;
  label: string;
  shortLabel: string;
  count: number;
  icon: string;
}

export interface DailyContactTrend {
  date: string;
  label: string;
  count: number;
}

export interface BusinessContactStats {
  totalClicks: number;
  clicksByType: ContactClickStats[];
  dailyTrend: DailyContactTrend[];
  topContactType: ContactClickStats | null;
  growthPercentage: number;
}

export interface UserBusinessOption {
  id: string;
  name: string;
  logoUrl: string | null;
}

// Mapeo de tipos a labels e iconos
const CONTACT_TYPE_CONFIG: Record<ContactType, { label: string; shortLabel: string; icon: string }> = {
  phone: { label: 'Teléfono', shortLabel: 'Teléfono', icon: 'Phone' },
  email: { label: 'Email', shortLabel: 'Email', icon: 'Mail' },
  website: { label: 'Sitio Web', shortLabel: 'Sitio Web', icon: 'Globe' },
  whatsapp: { label: 'WhatsApp', shortLabel: 'WhatsApp', icon: 'MessageCircle' },
  facebook: { label: 'Facebook', shortLabel: 'Facebook', icon: 'Facebook' },
  instagram: { label: 'Instagram', shortLabel: 'Instagram', icon: 'Instagram' },
  tiktok: { label: 'TikTok', shortLabel: 'TikTok', icon: 'Music' },
  youtube: { label: 'YouTube', shortLabel: 'YouTube', icon: 'Youtube' },
  twitter: { label: 'Twitter/X', shortLabel: 'Twitter/X', icon: 'Twitter' },
  linkedin: { label: 'LinkedIn', shortLabel: 'LinkedIn', icon: 'Linkedin' },
  other: { label: 'Otro', shortLabel: 'Otro', icon: 'Link' },
};

// ============================================
// Services
// ============================================

/**
 * Registra un click en un botón de contacto
 */
export async function trackContactClick(
  businessId: string,
  contactType: ContactType,
  userId?: string
): Promise<boolean> {
  // Note: La tabla business_contact_clicks debe existir en Supabase
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('business_contact_clicks') as any).insert({
    business_id_bcc: businessId,
    contact_type_bcc: contactType,
    user_id_bcc: userId || null,
  });

  if (error) {
    console.error('[contactClicks] Error tracking click:', error);
    return false;
  }

  return true;
}

// Tipo interno para la query de negocios
interface BusinessIdResult {
  id_bus: string;
}

/**
 * Obtiene las empresas del usuario para el selector
 */
export async function getUserBusinessOptions(
  userId: string
): Promise<UserBusinessOption[]> {
  interface BusinessImageResult {
    path_bim: string;
  }
  interface BusinessOptionResult {
    id_bus: string;
    name_bus: string | null;
    business_images: BusinessImageResult[] | null;
  }

  const { data, error } = await supabase
    .from('businesses')
    .select(`
      id_bus,
      name_bus,
      business_images (
        path_bim
      )
    `)
    .eq('owner_id_bus', userId)
    .eq('is_active_bus', true)
    .order('name_bus', { ascending: true });

  if (error || !data) {
    console.error('[contactClicks] Error fetching business options:', error);
    return [];
  }

  const businesses = data as unknown as BusinessOptionResult[];

  // Helper para obtener la URL pública del logo
  const getLogoUrl = (images: BusinessImageResult[] | null): string | null => {
    if (!images || images.length === 0) return null;
    // Buscar imagen que sea logo (path contiene 'logo-')
    const logoImage = images.find((img) => img.path_bim.includes('logo-'));
    if (!logoImage) return null;

    const { data } = supabase.storage
      .from('business-images')
      .getPublicUrl(logoImage.path_bim);
    return data.publicUrl;
  };

  return businesses.map((b) => ({
    id: b.id_bus,
    name: b.name_bus || 'Sin nombre',
    logoUrl: getLogoUrl(b.business_images),
  }));
}

/**
 * Obtiene estadísticas de clicks de contacto para los negocios del usuario
 * @param businessId - Si se proporciona, filtra solo por ese negocio. Si es null, muestra todos.
 */
export async function getUserBusinessesContactStats(
  userId: string,
  days: ContactPeriod = 30,
  businessId: string | null = null
): Promise<BusinessContactStats> {
  let businessIds: string[];

  if (businessId) {
    // Filtrar por un negocio específico
    businessIds = [businessId];
  } else {
    // Obtener todos los negocios del usuario
    const { data: businessesData, error: businessError } = await supabase
      .from('businesses')
      .select('id_bus')
      .eq('owner_id_bus', userId)
      .eq('is_active_bus', true);

    const businesses = businessesData as unknown as BusinessIdResult[] | null;

    if (businessError || !businesses || businesses.length === 0) {
      return {
        totalClicks: 0,
        clicksByType: [],
        dailyTrend: [],
        topContactType: null,
        growthPercentage: 0,
      };
    }

    businessIds = businesses.map((b) => b.id_bus);
  }

  // 2. Calcular fecha de inicio según el período
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateISO = startDate.toISOString();

  // 3. Obtener clicks filtrados por período
  // Note: La tabla business_contact_clicks debe existir en Supabase
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: clicksData, error: clicksError } = await (supabase
    .from('business_contact_clicks') as any)
    .select('contact_type_bcc, created_at_bcc')
    .in('business_id_bcc', businessIds)
    .gte('created_at_bcc', startDateISO);

  if (clicksError) {
    console.error('[contactClicks] Error fetching clicks:', clicksError);
    return {
      totalClicks: 0,
      clicksByType: [],
      dailyTrend: [],
      topContactType: null,
      growthPercentage: 0,
    };
  }

  interface ClickQueryResult {
    contact_type_bcc: string;
    created_at_bcc: string;
  }

  const clicks = (clicksData as unknown as ClickQueryResult[]) || [];

  // 4. Agrupar por tipo
  const countByType = new Map<string, number>();
  clicks.forEach((click) => {
    const currentCount = countByType.get(click.contact_type_bcc) || 0;
    countByType.set(click.contact_type_bcc, currentCount + 1);
  });

  // 5. Construir estadísticas por tipo
  const clicksByType: ContactClickStats[] = [];
  countByType.forEach((count, type) => {
    const config = CONTACT_TYPE_CONFIG[type as ContactType] || CONTACT_TYPE_CONFIG.other;
    clicksByType.push({
      contactType: type as ContactType,
      label: config.label,
      shortLabel: config.shortLabel,
      count,
      icon: config.icon,
    });
  });

  // Ordenar por count descendente
  clicksByType.sort((a, b) => b.count - a.count);

  // 6. Calcular tendencia diaria según el período
  const dailyTrend = calculateDailyContactTrend(clicks, days);

  // 7. Calcular crecimiento
  const growthPercentage = calculateContactGrowthPercentage(clicks);

  // 8. Totales
  const totalClicks = clicks.length;
  const topContactType = clicksByType.length > 0 ? clicksByType[0] : null;

  return {
    totalClicks,
    clicksByType,
    dailyTrend,
    topContactType,
    growthPercentage,
  };
}

/**
 * Calcula la tendencia diaria de clicks según el período con hora de mayor actividad
 */
function calculateDailyContactTrend(
  clicks: { contact_type_bcc: string; created_at_bcc: string }[],
  days: number
): DailyContactTrend[] {
  const { format, subDays } = require('date-fns');
  const { es } = require('date-fns/locale');

  const today = new Date();
  const trend: DailyContactTrend[] = [];
  const countByDay = new Map<string, number>();
  // Crear mapa de conteo por día y hora para encontrar el pico
  const countByDayAndHour = new Map<string, Map<number, number>>();

  clicks.forEach((click) => {
    const clickDate = new Date(click.created_at_bcc);
    const dateKey = format(clickDate, 'yyyy-MM-dd');
    const hour = clickDate.getHours();

    // Contar por día
    const currentCount = countByDay.get(dateKey) || 0;
    countByDay.set(dateKey, currentCount + 1);

    // Contar por día y hora
    if (!countByDayAndHour.has(dateKey)) {
      countByDayAndHour.set(dateKey, new Map());
    }
    const hourMap = countByDayAndHour.get(dateKey)!;
    const hourCount = hourMap.get(hour) || 0;
    hourMap.set(hour, hourCount + 1);
  });

  // Determinar el formato de label según el período
  const labelFormat =
    days === 7 ? 'EEE' :        // Lun, Mar, Mié...
      days === 15 ? 'd' :          // 1, 2, 3... (solo número del día)
        days === 30 ? 'd' :          // 1, 2, 3...
          'MMMM';                      // febrero, marzo, abril...

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateKey = format(date, 'yyyy-MM-dd');
    let label = format(date, labelFormat, { locale: es });

    // Capitalizar primera letra
    label = label.charAt(0).toUpperCase() + label.slice(1);

    const count = countByDay.get(dateKey) || 0;

    // Si hay actividad, encontrar la hora con más clicks
    if (count > 0 && countByDayAndHour.has(dateKey)) {
      const hourMap = countByDayAndHour.get(dateKey)!;
      let maxHour = 0;
      let maxHourCount = 0;

      hourMap.forEach((hourCount, hour) => {
        if (hourCount > maxHourCount) {
          maxHourCount = hourCount;
          maxHour = hour;
        }
      });

      // Formato: "DD - HH:00" o "Día - HH:00"
      const hourStr = maxHour.toString().padStart(2, '0');
      label = `${label} - ${hourStr}:00`;
    }

    trend.push({
      date: dateKey,
      label,
      count,
    });
  }

  return trend;
}

/**
 * Calcula el porcentaje de crecimiento comparando última semana vs semana anterior
 */
function calculateContactGrowthPercentage(
  clicks: { contact_type_bcc: string; created_at_bcc: string }[]
): number {
  const { subDays, startOfDay, endOfDay } = require('date-fns');

  const today = new Date();
  const oneWeekAgo = subDays(today, 7);
  const twoWeeksAgo = subDays(today, 14);

  let thisWeekCount = 0;
  let lastWeekCount = 0;

  clicks.forEach((click) => {
    const clickDate = new Date(click.created_at_bcc);

    if (clickDate >= startOfDay(oneWeekAgo) && clickDate <= endOfDay(today)) {
      thisWeekCount++;
    } else if (clickDate >= startOfDay(twoWeeksAgo) && clickDate < startOfDay(oneWeekAgo)) {
      lastWeekCount++;
    }
  });

  if (lastWeekCount === 0) {
    return thisWeekCount > 0 ? 100 : 0;
  }

  return Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
}
