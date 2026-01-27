/**
 * Constantes relacionadas con promociones
 * Centraliza valores que estaban hardcodeados en múltiples archivos
 */

// Colores del badge de promoción
export const PROMO_BADGE = {
    backgroundColor: '#fbbf24', // Amarillo
    textColor: '#000000',       // Negro
} as const;

// Dimensiones de UI para promociones
export const PROMO_UI = {
    cardMinHeight: 280,
    scrollMaxHeight: {
        products: 300,
        combos: 350,
        categories: 300,
    },
    borderRadius: {
        small: 8,
        medium: 12,
        large: 16,
    },
} as const;

// Tamaños de ícono para badges
export const BADGE_ICON_SIZES = {
    small: 11,
    medium: 13,
    large: 14,
} as const;

// Tamaños de fuente para badges
export const BADGE_FONT_SIZES = {
    small: 10,
    medium: 11,
    large: 12,
} as const;

// Padding de scroll para web
export const WEB_SCROLL_PADDING = 8;

// Tipo para tamaños de badge
export type BadgeSize = 'small' | 'medium' | 'large';
