import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

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
   * Carga todas las ubicaciones desde Supabase (estructura normalizada V3)
   * @returns ProcessedLocations o null si falla
   */
  static async loadLocations(): Promise<ProcessedLocations | null> {
    try {
      // 1. Cargar provincias con sus relaciones
      const { data: provincesData, error: provincesError } = await supabase
        .from('provinces')
        .select(
          `
          id_prv,
          name_prv,
          cantons (
            id_ctn,
            name_ctn,
            districts (
              id_dst,
              name_dst
            )
          )
        `,
        )
        .order('name_prv', { ascending: true });

      if (provincesError || !provincesData || provincesData.length === 0) {
        return null;
      }

      // 2. Cargar ubicaciones (locations) para obtener coordenadas de distritos
      const { data: locationsData, error: locationsError } = await supabase
        .from('locations')
        .select('district_id_loc, latitude_loc, longitude_loc');

      // Crear mapa de coordenadas por distrito
      const districtCoordinates = new Map<string, { lat: number; lng: number }>();
      if (!locationsError && locationsData) {
        locationsData.forEach((loc: any) => {
          if (loc.district_id_loc && loc.latitude_loc && loc.longitude_loc) {
            districtCoordinates.set(loc.district_id_loc, {
              lat: loc.latitude_loc,
              lng: loc.longitude_loc,
            });
          }
        });
      }

      // 3. Procesar datos
      return this.processNormalizedLocations(provincesData as any, districtCoordinates);
    } catch (error) {
      return null;
    }
  }

  /**
   * Procesa las ubicaciones normalizadas de la BD V3
   * @param provincesData Datos de provincias con relaciones anidadas
   * @param districtCoordinates Mapa de coordenadas por distrito
   * @returns Estructuras procesadas
   */
  private static processNormalizedLocations(
    provincesData: any[],
    districtCoordinates: Map<string, { lat: number; lng: number }>,
  ): ProcessedLocations {
    const provinces: Province[] = [];
    const cantons: Canton[] = [];
    const districts: District[] = [];

    provincesData.forEach((province: any) => {
      // Agregar provincia
      provinces.push({
        id: province.id_prv,
        name: province.name_prv,
      });

      // Procesar cantones de esta provincia
      if (province.cantons && Array.isArray(province.cantons)) {
        province.cantons.forEach((canton: any) => {
          // Agregar cantón
          cantons.push({
            id: canton.id_ctn,
            name: canton.name_ctn,
            province: province.name_prv,
          });

          // Procesar distritos de este cantón
          if (canton.districts && Array.isArray(canton.districts)) {
            canton.districts.forEach((district: any) => {
              const coords = districtCoordinates.get(district.id_dst);

              // Agregar distrito
              districts.push({
                id: district.id_dst,
                name: district.name_dst,
                canton: canton.name_ctn,
                latitude: coords?.lat,
                longitude: coords?.lng,
              });
            });
          }
        });
      }
    });

    return {
      provinces: provinces.sort((a, b) => a.name.localeCompare(b.name)),
      cantons: cantons.sort((a, b) => a.name.localeCompare(b.name)),
      districts: districts.sort((a, b) => a.name.localeCompare(b.name)),
    };
  }
}
