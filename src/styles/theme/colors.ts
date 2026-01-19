export const colors = {
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
} as const;

export type Colors = typeof colors;
