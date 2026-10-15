import { Linking } from 'react-native';

/**
 * Enlaces externos cargados por usuarios (web, redes sociales, teléfono, email).
 * Nunca se abre un valor de la BD tal cual: se valida esquema y dominio para evitar
 * `javascript:`, `intent:`, `file:` o redes "falsas" que llevan a phishing.
 */

export type SocialNetwork = 'facebook' | 'instagram' | 'tiktok';

const SOCIAL_DOMAINS: Record<SocialNetwork, string[]> = {
  facebook: ['facebook.com', 'fb.com', 'm.facebook.com'],
  instagram: ['instagram.com'],
  tiktok: ['tiktok.com'],
};

const SOCIAL_BASE: Record<SocialNetwork, (user: string) => string> = {
  facebook: (u) => `https://facebook.com/${u}`,
  instagram: (u) => `https://instagram.com/${u}`,
  tiktok: (u) => `https://tiktok.com/@${u}`,
};

const USERNAME_PATTERN = /^@?[A-Za-z0-9._-]{1,60}$/;

function parseHttpUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null;
  } catch {
    return null;
  }
}

function hostMatches(host: string, domains: string[]): boolean {
  const h = host.toLowerCase().replace(/^www\./, '');
  return domains.some((d) => h === d || h.endsWith(`.${d}`));
}

/** Devuelve una URL https segura para el sitio web, o null si no es válida. */
export function toSafeWebsiteUrl(value: string | null | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  const url = parseHttpUrl(withScheme);
  if (!url || !url.hostname.includes('.')) return null;
  return url.toString();
}

/** Devuelve la URL del perfil en la red social indicada, o null si no corresponde. */
export function toSafeSocialUrl(
  value: string | null | undefined,
  network: SocialNetwork,
): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  if (USERNAME_PATTERN.test(raw)) return SOCIAL_BASE[network](raw.replace(/^@/, ''));
  const url = parseHttpUrl(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  if (!url || !hostMatches(url.hostname, SOCIAL_DOMAINS[network])) return null;
  url.protocol = 'https:';
  return url.toString();
}

export function toSafeTelUrl(phone: string | null | undefined): string | null {
  const digits = phone?.replace(/[^\d+]/g, '') ?? '';
  return digits.length >= 8 ? `tel:${digits}` : null;
}

export function toSafeMailtoUrl(email: string | null | undefined): string | null {
  const raw = email?.trim() ?? '';
  return /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]+$/.test(raw) ? `mailto:${raw}` : null;
}

/** Abre una URL solo si usa un esquema permitido. Devuelve false si se rechazó. */
export async function openSafeUrl(url: string | null | undefined): Promise<boolean> {
  if (!url || !/^(https?:|tel:|mailto:)/i.test(url)) return false;
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Normaliza los links sociales antes de guardarlos. Los valores que no correspondan a la
 * red (otro dominio, esquema no http) se descartan.
 */
export function buildSocialLinks(data: {
  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
}): Partial<Record<SocialNetwork, string>> {
  const links: Partial<Record<SocialNetwork, string>> = {};
  (['facebook', 'instagram', 'tiktok'] as const).forEach((network) => {
    const url = toSafeSocialUrl(data[network], network);
    if (url) links[network] = url;
  });
  return links;
}
