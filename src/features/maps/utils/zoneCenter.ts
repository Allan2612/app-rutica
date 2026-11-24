/** Centro de Costa Rica, para cuando no hay ubicación ni zona elegida. */
export const COSTA_RICA_CENTER = { latitude: 9.9281, longitude: -84.0907, zoom: 8 } as const;

interface ZoneDistrict {
  name: string;
  canton: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface ZoneCanton {
  name: string;
  province: string;
}

interface Zone {
  province?: string | null;
  canton?: string | null;
  district?: string | null;
}

export interface MapCenter {
  latitude: number;
  longitude: number;
  zoom: number;
}

/**
 * Centro aproximado de la zona elegida en el selector, con las coordenadas que traen los
 * distritos (de las ubicaciones cargadas). Cantón y provincia usan el promedio de sus
 * distritos. Null si la zona no tiene distritos con coordenadas.
 */
export function getZoneCenter(
  zone: Zone | null | undefined,
  districts: ZoneDistrict[],
  cantons: ZoneCanton[],
): MapCenter | null {
  if (!zone) return null;
  const same = (a?: string | null, b?: string | null) =>
    !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();

  let picked: ZoneDistrict[] = [];
  let zoom = 13;
  if (zone.district) {
    picked = districts.filter(
      (d) => same(d.name, zone.district) && (!zone.canton || same(d.canton, zone.canton)),
    );
  } else if (zone.canton) {
    picked = districts.filter((d) => same(d.canton, zone.canton));
    zoom = 11;
  } else if (zone.province) {
    const cantonNames = cantons.filter((c) => same(c.province, zone.province)).map((c) => c.name);
    picked = districts.filter((d) => cantonNames.some((c) => same(c, d.canton)));
    zoom = 9;
  }

  const withCoords = picked.filter(
    (d): d is ZoneDistrict & { latitude: number; longitude: number } =>
      typeof d.latitude === 'number' && typeof d.longitude === 'number',
  );
  if (!withCoords.length) return null;
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  return {
    latitude: avg(withCoords.map((d) => d.latitude)),
    longitude: avg(withCoords.map((d) => d.longitude)),
    zoom,
  };
}
