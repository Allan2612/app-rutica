import { describe, expect, it } from 'vitest';
import { getZoneCenter } from '@/features/maps/utils/zoneCenter';

const districts = [
  { name: 'San Isidro de El General', canton: 'Pérez Zeledón', latitude: 9.37, longitude: -83.7 },
  { name: 'Rivas', canton: 'Pérez Zeledón', latitude: 9.43, longitude: -83.64 },
  { name: 'Páramo', canton: 'Pérez Zeledón', latitude: null, longitude: null },
  { name: 'San Isidro', canton: 'Vázquez de Coronado', latitude: 9.97, longitude: -84.0 },
];
const cantons = [
  { name: 'Pérez Zeledón', province: 'San José' },
  { name: 'Vázquez de Coronado', province: 'San José' },
];

describe('getZoneCenter', () => {
  it('distrito: sus coordenadas, con zoom cercano', () => {
    expect(
      getZoneCenter({ canton: 'Pérez Zeledón', district: 'Rivas' }, districts, cantons),
    ).toEqual({
      latitude: 9.43,
      longitude: -83.64,
      zoom: 13,
    });
  });

  it('cantón: promedio de los distritos con coordenadas', () => {
    const c = getZoneCenter({ canton: 'pérez zeledón' }, districts, cantons)!;
    expect(c.latitude).toBeCloseTo(9.4);
    expect(c.longitude).toBeCloseTo(-83.67);
    expect(c.zoom).toBe(11);
  });

  it('provincia: todos sus cantones', () => {
    expect(getZoneCenter({ province: 'San José' }, districts, cantons)?.zoom).toBe(9);
  });

  it('sin zona o sin coordenadas: null', () => {
    expect(getZoneCenter(null, districts, cantons)).toBeNull();
    expect(
      getZoneCenter({ canton: 'Pérez Zeledón', district: 'Páramo' }, districts, cantons),
    ).toBeNull();
  });
});
