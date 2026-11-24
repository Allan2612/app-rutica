import { describe, expect, it } from 'vitest';
import { getShortLocationLabel, splitItemsByLocation } from '@/utils/splitItemsByLocation';

const items = [
  { id: 1, locationLabel: 'San José, Pérez Zeledón, Daniel Flores' },
  { id: 2, locationLabel: 'San José, Pérez Zeledón, Rivas' },
  { id: 3, locationLabel: null },
];

describe('splitItemsByLocation', () => {
  it('sin zona todo va a local', () => {
    const r = splitItemsByLocation(items, null);
    expect(r.hasLocation).toBe(false);
    expect(r.local).toHaveLength(3);
  });

  it('el nivel más específico manda y no distingue mayúsculas', () => {
    const r = splitItemsByLocation(items, { canton: 'pérez zeledón', district: 'rivas' });
    expect(r.local.map((i) => i.id)).toEqual([2]);
    expect(r.others.map((i) => i.id)).toEqual([1, 3]);
    expect(r.locationName).toBe('rivas');
  });
});

describe('getShortLocationLabel', () => {
  it('deja cantón y distrito', () => {
    expect(getShortLocationLabel('San José, Pérez Zeledón, Rivas')).toBe('Pérez Zeledón, Rivas');
    expect(getShortLocationLabel(null)).toBeNull();
  });
});
