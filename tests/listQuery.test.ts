import { beforeEach, describe, expect, it, vi } from 'vitest';

// Builder falso de PostgREST: registra cada llamada y devuelve filas fijas al hacer await
const calls: [string, ...unknown[]][] = [];
let rows: { id_dst: string }[] = [];
function fakeBuilder(): any {
  const b: any = {};
  for (const m of ['from', 'select', 'eq', 'in', 'not']) {
    b[m] = (...args: unknown[]) => {
      calls.push([m, ...args]);
      return b;
    };
  }
  b.then = (resolve: (v: unknown) => void) => resolve({ data: rows, error: null });
  return b;
}
vi.mock('@/lib/supabase/client', () => ({
  supabase: { from: (t: string) => fakeBuilder().from(t) },
}));

const { applyLocation, hasLocation, locationJoin, pageRange, resolveDistrictIds, PAGE_SIZE } =
  await import('@/services/listQuery');

beforeEach(() => {
  calls.length = 0;
  rows = [];
});

describe('pageRange', () => {
  it('pide de a PAGE_SIZE', () => {
    expect(pageRange()).toEqual([0, PAGE_SIZE - 1]);
    expect(pageRange(2)).toEqual([2 * PAGE_SIZE, 3 * PAGE_SIZE - 1]);
  });
});

describe('hasLocation', () => {
  it('solo cuenta si hay algún nivel', () => {
    expect(hasLocation(null)).toBe(false);
    expect(hasLocation({ province: null, canton: null, district: null })).toBe(false);
    expect(hasLocation({ canton: 'Pérez Zeledón' })).toBe(true);
  });
});

describe('locationJoin', () => {
  it('pide la ubicación con !inner solo si hay zona', () => {
    expect(locationJoin(null)).toBe('');
    expect(locationJoin(['d1'])).toBe('!inner');
  });
});

describe('applyLocation', () => {
  const PATH = 'locations.district_id_loc';

  it('sin zona no toca la consulta', () => {
    const q = fakeBuilder();
    expect(applyLocation(q, PATH, null)).toBe(q);
    expect(calls).toEqual([]);
  });

  it("'only' filtra por los distritos; sin distritos el resultado es vacío (null)", () => {
    applyLocation(fakeBuilder(), PATH, ['a', 'b'], 'only');
    expect(calls).toEqual([['in', PATH, ['a', 'b']]]);
    expect(applyLocation(fakeBuilder(), PATH, [], 'only')).toBeNull();
  });

  it("'exclude' deja afuera los distritos de la zona", () => {
    applyLocation(fakeBuilder(), PATH, ['a', 'b'], 'exclude');
    expect(calls).toEqual([['not', PATH, 'in', '(a,b)']]);
  });

  it("'exclude' sin distritos no filtra", () => {
    const q = fakeBuilder();
    expect(applyLocation(q, PATH, [], 'exclude')).toBe(q);
    expect(calls).toEqual([]);
  });
});

describe('resolveDistrictIds', () => {
  it('filtra por todos los niveles (hay distritos con el mismo nombre) y cachea', async () => {
    rows = [{ id_dst: 'D1' }];
    const loc = { province: 'San José', canton: 'Pérez Zeledón', district: 'Daniel Flores' };
    expect(await resolveDistrictIds(loc)).toEqual(['D1']);
    const eqs = calls.filter((c) => c[0] === 'eq').map((c) => c[1]);
    expect(eqs).toEqual(['name_dst', 'cantons.name_ctn', 'cantons.provinces.name_prv']);

    calls.length = 0;
    expect(await resolveDistrictIds(loc)).toEqual(['D1']);
    expect(calls).toEqual([]); // segunda vez sale de la caché
  });

  it('sin zona devuelve null', async () => {
    expect(await resolveDistrictIds(undefined)).toBeNull();
  });
});
