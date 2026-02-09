import { Dimensions } from 'react-native';
import {
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  Link,
} from 'lucide-react-native';
import { TikTokIcon } from '@/components/business/TikTokIcon';
import type { ContactType } from '@/services/contactClicks.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const CHART_WIDTH = Math.min(SCREEN_WIDTH - 64, 500);

// Mapeo de iconos para tipos de contacto
export const CONTACT_ICONS: Record<
  ContactType,
  React.ComponentType<{ color: string; size: number; strokeWidth?: number }>
> = {
  phone: Phone,
  email: Mail,
  website: Globe,
  whatsapp: MessageCircle,
  facebook: Facebook,
  instagram: Instagram,
  tiktok: TikTokIcon as any,
  youtube: Youtube,
  twitter: Twitter,
  linkedin: Linkedin,
  other: Link,
};

export const CONTACT_COLORS: Record<ContactType, string> = {
  phone: '#10b981',
  email: '#ef4444',
  website: '#3b82f6',
  whatsapp: '#25d366',
  facebook: '#1877f2',
  instagram: '#e4405f',
  tiktok: '#000000',
  youtube: '#ff0000',
  twitter: '#1da1f2',
  linkedin: '#0077b5',
  other: '#6b7280',
};

export const PIE_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

export const RATING_COLORS = {
  stars5: '#22c55e',
  stars4: '#84cc16',
  stars3: '#eab308',
  stars2: '#f97316',
  stars1: '#ef4444',
};

export const PERIOD_OPTIONS = [7, 15, 30, 90] as const;
