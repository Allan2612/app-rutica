import { supabase } from '@/lib/supabase/client';
import type { Location } from '@/types/entities';

/**
 * Interfaz para provincia procesada
 */
export interface Province {
  id: string;
  name: string;
}

/**
 * Interfaz para cantón procesado
 */
export interface Canton {
  id: string;
  name: string;
  province: string;
}

/**
 * Interfaz para distrito procesado
 */
export interface District {
  id: string;
  name: string;
  canton: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Resultado del procesamiento de ubicaciones
 */
export interface ProcessedLocations {
  provinces: Province[];
  cantons: Canton[];
  districts: District[];
}

/**
 * Servicio para cargar ubicaciones desde Supabase
 * Sin reintentos - falla inmediatamente si hay error
 */
export class LocationDataService {
  /**
   * Carga todas las ubicaciones desde Supabase
   * @returns ProcessedLocations o null si falla
   */
  static async loadLocations(): Promise<ProcessedLocations | null> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('province_loc', { ascending: true });

      if (error) {
        return null;
      }

      if (!data || data.length === 0) {
        return null;
      }
      
      return this.processLocations(data as Location[]);
    } catch (error) {
      return null;
    }
  }

  /**
   * Procesa las ubicaciones de la BD a estructuras usables
   * @param locations Array de ubicaciones desde Supabase
   * @returns Estructuras procesadas
   */
  private static processLocations(locations: Location[]): ProcessedLocations {
    const provincesMap = new Map<string, Province>();
    const cantonsMap = new Map<string, Canton>();
    const districtsMap = new Map<string, District>();

    let provinceIdCounter = 1;
    let cantonIdCounter = 1;
    let districtIdCounter = 1;

    locations.forEach((loc) => {
      // Procesar provincia
      if (loc.province_loc) {
        const provinceName = loc.province_loc.trim();
        if (!provincesMap.has(provinceName)) {
          provincesMap.set(provinceName, {
            id: String(provinceIdCounter++),
            name: provinceName,
          });
        }
      }

      // Procesar cantón
      if (loc.province_loc && loc.canton_loc) {
        const cantonName = loc.canton_loc.trim();
        const cantonKey = `${loc.province_loc}-${cantonName}`;
        if (!cantonsMap.has(cantonKey)) {
          cantonsMap.set(cantonKey, {
            id: String(cantonIdCounter++),
            name: cantonName,
            province: loc.province_loc.trim(),
          });
        }
      }

      // Procesar distrito
      if (loc.canton_loc && loc.district_loc) {
        const districtName = loc.district_loc.trim();
        const districtKey = `${loc.canton_loc}-${districtName}`;
        if (!districtsMap.has(districtKey)) {
          districtsMap.set(districtKey, {
            id: String(districtIdCounter++),
            name: districtName,
            canton: loc.canton_loc.trim(),
            latitude: loc.latitude_loc,
            longitude: loc.longitude_loc,
          });
        }
      }
    });

    return {
      provinces: Array.from(provincesMap.values()).sort((a, b) => 
        a.name.localeCompare(b.name)
      ),
      cantons: Array.from(cantonsMap.values()).sort((a, b) => 
        a.name.localeCompare(b.name)
      ),
      districts: Array.from(districtsMap.values()).sort((a, b) => 
        a.name.localeCompare(b.name)
      ),
    };
  }
}
