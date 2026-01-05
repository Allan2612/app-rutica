import { getShadowStyle } from '../../utils/shadowHelper';

export const shadows = {
  none: {},

  sm: getShadowStyle({
    color: '#000',
    offsetX: 0,
    offsetY: 1,
    opacity: 0.05,
    radius: 2,
    elevation: 1,
  }),

  md: getShadowStyle({
    color: '#000',
    offsetX: 0,
    offsetY: 2,
    opacity: 0.1,
    radius: 4,
    elevation: 3,
  }),

  lg: getShadowStyle({
    color: '#000',
    offsetX: 0,
    offsetY: 4,
    opacity: 0.15,
    radius: 8,
    elevation: 6,
  }),

  xl: getShadowStyle({
    color: '#000',
    offsetX: 0,
    offsetY: 8,
    opacity: 0.2,
    radius: 16,
    elevation: 10,
  }),
} as const;

export type Shadows = typeof shadows;
