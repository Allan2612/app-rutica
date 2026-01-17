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

  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
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
    tiktok: '#00f2ea',
    tiktokBg: 'rgba(240, 240, 240, 0.3)',
  },

  // Modal/overlay colors
  overlay: {
    dark: 'rgba(0, 0, 0, 0.95)',
  },

  // Shadow color
  shadow: '#000',
} as const;

export type Colors = typeof colors;
