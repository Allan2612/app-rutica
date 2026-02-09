const tintColorLight = '#0a7ea4';
const tintColorDark = '#58a6ff';

export const colors = {
  // Light mode colors
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },

  // Dark mode colors (GitHub/VS Code inspired)
  dark: {
    text: '#e6edf3',           // Texto principal claro
    background: '#0d1117',     // Fondo principal muy oscuro
    tint: tintColorDark,
    icon: '#8b949e',
    tabIconDefault: '#8b949e',
    tabIconSelected: tintColorDark,
  },

  // Brand colors
  primary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  danger: '#dc2626',
  alert: '#f97316',

  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f5f6f7',
    tertiary: '#f3f4f6',
  },

  // Text colors
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
  },

  // Border colors
  border: {
    light: '#f3f4f6',
    medium: '#e5e7eb',
    dark: '#d1d5db',
  },

  // Status colors
  status: {
    pending: '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444',
  },

  // Social media brand colors
  social: {
    facebook: '#1877f2',
    instagram: '#E4405F',
    tiktok: '#000000',
    youtube: '#FF0000',
    whatsapp: '#25D366',
  },

  // Modal/overlay colors
  overlay: {
    dark: 'rgba(0, 0, 0, 0.95)',
    light: 'rgba(255, 255, 255, 0.8)',
    medium: 'rgba(255, 255, 255, 0.9)',
    gradient: {
      transparent: 'rgba(0, 0, 0, 0)',
      dark: 'rgba(0, 0, 0, 0.85)',
    },
  },

  // Colores de promociones/badges
  promo: {
    badge: '#fbbf24',       // Amarillo del badge
    badgeText: '#000000',   // Texto del badge
    combo: {
      light: { bg: '#ede9fe', text: '#6d28d9' },
      dark: { bg: 'rgba(139, 92, 246, 0.2)', text: '#a78bfa' },
    },
  },

  // Entity type colors (for admin/verification)
  entityTypes: {
    business: {
      light: { bg: '#dbeafe', text: '#1e40af' },
      dark: { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa' },
    },
    event: {
      light: { bg: '#fef3c7', text: '#92400e' },
      dark: { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24' },
    },
    attraction: {
      light: { bg: '#d1fae5', text: '#065f46' },
      dark: { bg: 'rgba(16, 185, 129, 0.2)', text: '#34d399' },
    },
    promotion: {
      light: { bg: '#fce7f3', text: '#9d174d' },
      dark: { bg: 'rgba(236, 72, 153, 0.2)', text: '#f472b6' },
    },
  },

  // Review type colors
  reviewTypes: {
    attraction: '#10b981',
    business: '#3b82f6',
    event: '#f59e0b',
    product: '#8b5cf6',
  },

  // Rating colors
  rating: {
    star: '#fbbf24',
    starBg: 'transparent',
  },

  // Shadow color
  shadow: '#000',
} as const;

export type Colors = typeof colors;
