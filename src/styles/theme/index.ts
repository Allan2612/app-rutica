export * from './colors';
export * from './shadows';
export * from './spacing';
export * from './typography';
export * from './promotions';

import { colors } from './colors';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  typography,
  shadows,
} as const;

export type Theme = typeof theme;
