export interface Location {
  id_LOC: string;
  country_LOC: string | null;
  province_LOC: string | null;
  canton_LOC: string | null;
  district_LOC: string | null;
  address_LOC: string | null;
  latitude_LOC: number;
  longitude_LOC: number;
  created_at_LOC: string;
}

export interface LocationInsert extends Omit<Location, 'id_LOC' | 'created_at_LOC'> {
  id_LOC?: string;
}

export interface LocationUpdate extends Partial<Omit<Location, 'id_LOC' | 'created_at_LOC'>> {}
