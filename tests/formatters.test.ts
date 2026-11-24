import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getDaysAgo, getNameInitials, getTimeAgo } from '@/utils/formatters';

describe('getNameInitials', () => {
  it('usa nombre y primer apellido', () => {
    expect(getNameInitials('Ana María Soto')).toBe('AM');
  });
  it('tolera espacios dobles y vacíos', () => {
    expect(getNameInitials('  ana   soto ')).toBe('AS');
    expect(getNameInitials('')).toBe('?');
    expect(getNameInitials(null)).toBe('?');
  });
  it('un solo nombre da dos letras', () => {
    expect(getNameInitials('Bea')).toBe('BE');
  });
});

describe('fechas relativas', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-23T12:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('getTimeAgo', () => {
    expect(getTimeAgo('2026-11-23T11:59:40Z')).toBe('Ahora');
    expect(getTimeAgo('2026-11-23T11:30:00Z')).toBe('Hace 30 min');
    expect(getTimeAgo('2026-11-23T07:00:00Z')).toBe('Hace 5h');
    expect(getTimeAgo('2026-11-20T12:00:00Z')).toBe('Hace 3d');
  });

  it('getDaysAgo', () => {
    expect(getDaysAgo('2026-11-23T08:00:00Z')).toBe('Hoy');
    expect(getDaysAgo('2026-11-22T10:00:00Z')).toBe('Ayer');
    expect(getDaysAgo('2026-11-19T12:00:00Z')).toBe('Hace 4 días');
  });
});
