// ============================================
// Location System - V3 Normalizado
// ============================================

/**
 * País - Tabla: countries (cnt)
 */
export interface Country {
  id_cnt: string;
  name_cnt: string;
  created_at_cnt: string;
}

/**
 * Provincia - Tabla: provinces (prv)
 */
export interface Province {
  id_prv: string;
  country_id_prv: string;
  name_prv: string;
  created_at_prv: string;
}

/**
 * Cantón - Tabla: cantons (ctn)
 */
export interface Canton {
  id_ctn: string;
  province_id_ctn: string;
  name_ctn: string;
  created_at_ctn: string;
}

/**
 * Distrito - Tabla: districts (dst)
 */
export interface District {
  id_dst: string;
  canton_id_dst: string;
  name_dst: string;
  created_at_dst: string;
}

/**
 * Ubicación - Tabla: locations (loc)
 */
export interface Location {
  id_loc: string;
  district_id_loc: string;
  address_loc: string | null;
  latitude_loc: number | null;
  longitude_loc: number | null;
  created_at_loc: string;
}

/**
 * Location con relaciones (para mostrar nombres)
 */
export interface LocationWithHierarchy extends Location {
  district?: District & {
    canton?: Canton & {
      province?: Province & {
        country?: Country;
      };
    };
  };
}

// ============================================
// Insert Types
// ============================================

export interface LocationInsert {
  district_id_loc: string;
  address_loc?: string | null;
  latitude_loc?: number | null;
  longitude_loc?: number | null;
}

export interface LocationUpdate {
  district_id_loc?: string;
  address_loc?: string | null;
  latitude_loc?: number | null;
  longitude_loc?: number | null;
}

// ============================================
// UI Helper Types (para dropdowns/selects)
// ============================================

export interface LocationOption {
  id: string;
  name: string;
}

export interface ProvinceOption extends LocationOption {
  countryId: string;
}

export interface CantonOption extends LocationOption {
  provinceId: string;
}

export interface DistrictOption extends LocationOption {
  cantonId: string;
  latitude?: number;
  longitude?: number;
}

// ============================================
// Helpers
// ============================================

/**
 * Formatea la ubicación como string legible
 */
export function formatLocationLabel(location: LocationWithHierarchy | null | undefined): string {
  if (!location?.district) return '';
  
  const parts: string[] = [];
  
  if (location.district.name_dst) {
    parts.push(location.district.name_dst);
  }
  if (location.district.canton?.name_ctn) {
    parts.push(location.district.canton.name_ctn);
  }
  if (location.district.canton?.province?.name_prv) {
    parts.push(location.district.canton.province.name_prv);
  }
  
  return parts.join(', ');
}

/**
 * Obtiene coordenadas de una ubicación
 */
export function getCoordinates(location: Location | null | undefined): { lat: number; lng: number } | null {
  if (!location?.latitude_loc || !location?.longitude_loc) return null;
  return {
    lat: location.latitude_loc,
    lng: location.longitude_loc,
  };
}

