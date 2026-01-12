export interface Location {
  id_loc: string;
  country_loc: string | null;
  province_loc: string | null;
  canton_loc: string | null;
  district_loc: string | null;
  address_loc: string | null;
  latitude_loc: number;
  longitude_loc: number;
  created_at_loc: string;
}

export interface LocationInsert extends Omit<Location, 'id_loc' | 'created_at_loc'> {
  id_loc?: string;
}

export interface LocationUpdate extends Partial<Omit<Location, 'id_loc' | 'created_at_loc'>> {}

/**
 * Provincia procesada desde los datos de Supabase
 */
export interface Province {
  id: string;
  name: string;
}

/**
 * Cantón procesado desde los datos de Supabase
 */
export interface Canton {
  id: string;
  name: string;
  province: string;
}

/**
 * Distrito procesado desde los datos de Supabase
 */
export interface District {
  id: string;
  name: string;
  canton: string;
  latitude?: number;
  longitude?: number;
}
