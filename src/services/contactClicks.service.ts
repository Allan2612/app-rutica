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
}

export interface UserBusinessOption {
  id: string;
  name: string;
  logoUrl: string | null;
}

// Mapeo de tipos a labels e iconos
const CONTACT_TYPE_CONFIG: Record<ContactType, { label: string; shortLabel: string; icon: string }> = {
  phone: { label: 'Llamadas Realizadas', shortLabel: 'Teléfono', icon: 'Phone' },
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

  // 7. Totales
  const totalClicks = clicks.length;
  const topContactType = clicksByType.length > 0 ? clicksByType[0] : null;

  return {
    totalClicks,
    clicksByType,
    dailyTrend,
    topContactType,
  };
}

/**
 * Calcula la tendencia diaria de clicks según el período
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

  clicks.forEach((click) => {
    const clickDate = format(new Date(click.created_at_bcc), 'yyyy-MM-dd');
    const currentCount = countByDay.get(clickDate) || 0;
    countByDay.set(clickDate, currentCount + 1);
  });

  // Determinar el formato de label según el período
  const labelFormat =
    days === 7 ? 'EEE' :        // Lun, Mar, Mié...
      days === 15 ? 'd' :          // 1, 2, 3... (solo número del día)
        days === 30 ? 'd' :          // 1, 2, 3...
          'MMM';                       // Feb, Mar, Abr...

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateKey = format(date, 'yyyy-MM-dd');
    let label = format(date, labelFormat, { locale: es });

    // Capitalizar primera letra
    label = label.charAt(0).toUpperCase() + label.slice(1);

    trend.push({
      date: dateKey,
      label,
      count: countByDay.get(dateKey) || 0,
    });
  }

  return trend;
}
