import { beforeEach, describe, expect, it, vi } from 'vitest';

// Builder falso de PostgREST: registra cada llamada y devuelve filas fijas al hacer await
const calls: [string, ...unknown[]][] = [];
let rows: { id_loc: string }[] = [];
function fakeBuilder(): any {
  const b: any = {};
  for (const m of ['from', 'select', 'eq', 'in', 'or']) {
    b[m] = (...args: unknown[]) => {
      calls.push([m, ...args]);
      return b;
    };
  }
  b.then = (resolve: (v: unknown) => void) => resolve({ data: rows, error: null });
  return b;
}
vi.mock('@/lib/supabase/client', () => ({ supabase: { from: (t: string) => fakeBuilder().from(t) } }));

const { applyLocation, hasLocation, pageRange, resolveLocationIds, PAGE_SIZE } = await import(
  '@/services/listQuery'
);

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

describe('applyLocation', () => {
  it('sin zona no toca la consulta', () => {
    const q = fakeBuilder();
    expect(applyLocation(q, 'location_id_bus', null)).toBe(q);
    expect(calls).toEqual([]);
  });

  it("'only' filtra por los ids; sin ids el resultado es vacío (null)", () => {
    applyLocation(fakeBuilder(), 'location_id_bus', ['a', 'b'], 'only');
    expect(calls).toEqual([['in', 'location_id_bus', ['a', 'b']]]);
    expect(applyLocation(fakeBuilder(), 'location_id_bus', [], 'only')).toBeNull();
  });

  it("'exclude' deja pasar lo que no tiene ubicación", () => {
    applyLocation(fakeBuilder(), 'location_id_evt', ['a', 'b'], 'exclude');
    expect(calls).toEqual([['or', 'location_id_evt.is.null,location_id_evt.not.in.(a,b)', undefined]]);
  });

  it("'exclude' por tabla embebida (promociones → comercio)", () => {
    applyLocation(fakeBuilder(), 'location_id_bus', ['a'], 'exclude', 'businesses');
    expect(calls).toEqual([
      ['or', 'location_id_bus.is.null,location_id_bus.not.in.(a)', { referencedTable: 'businesses' }],
    ]);
  });
});

describe('resolveLocationIds', () => {
  it('filtra por todos los niveles (hay distritos con el mismo nombre) y cachea', async () => {
    rows = [{ id_loc: 'L1' }, { id_loc: 'L2' }];
    const loc = { province: 'San José', canton: 'Pérez Zeledón', district: 'Daniel Flores' };
    expect(await resolveLocationIds(loc)).toEqual(['L1', 'L2']);
    const eqs = calls.filter((c) => c[0] === 'eq').map((c) => c[1]);
    expect(eqs).toEqual(['districts.name_dst', 'districts.cantons.name_ctn', 'districts.cantons.provinces.name_prv']);

    calls.length = 0;
    expect(await resolveLocationIds(loc)).toEqual(['L1', 'L2']);
    expect(calls).toEqual([]); // segunda vez sale de la caché
  });

  it('sin zona devuelve null', async () => {
    expect(await resolveLocationIds(undefined)).toBeNull();
  });
});
