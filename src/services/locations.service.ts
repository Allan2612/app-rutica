import { supabase } from '@/lib/supabase/client';

/**
 * Normaliza un string para comparación (elimina tildes, convierte a minúsculas)
 */
function normalizeString(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

/**
 * Busca o crea un país y retorna su ID
 */
async function findOrCreateCountry(countryName: string): Promise<string> {
    const normalized = normalizeString(countryName);

    // Buscar país existente (comparación case-insensitive)
    const { data: existing } = await (supabase as any)
        .from('countries')
        .select('id_cnt')
        .ilike('name_cnt', countryName)
        .limit(1)
        .maybeSingle();

    if (existing) {
        return (existing as any).id_cnt;
    }

    // Crear nuevo país
    const { data: newCountry, error } = await (supabase as any)
        .from('countries')
        .insert({ name_cnt: countryName })
        .select('id_cnt')
        .single();

    if (error) throw error;
    return (newCountry as any).id_cnt;
}

/**
 * Busca o crea una provincia y retorna su ID
 */
async function findOrCreateProvince(provinceName: string, countryId: string): Promise<string> {
    // Buscar provincia existente
    const { data: existing } = await (supabase as any)
        .from('provinces')
        .select('id_prv')
        .eq('country_id_prv', countryId)
        .ilike('name_prv', provinceName)
        .limit(1)
        .maybeSingle();

    if (existing) {
        return (existing as any).id_prv;
    }

    // Crear nueva provincia
    const { data: newProvince, error } = await (supabase as any)
        .from('provinces')
        .insert({
            name_prv: provinceName,
            country_id_prv: countryId,
        })
        .select('id_prv')
        .single();

    if (error) throw error;
    return (newProvince as any).id_prv;
}

/**
 * Busca o crea un cantón y retorna su ID
 */
async function findOrCreateCanton(cantonName: string, provinceId: string): Promise<string> {
    // Buscar cantón existente
    const { data: existing } = await (supabase as any)
        .from('cantons')
        .select('id_ctn')
        .eq('province_id_ctn', provinceId)
        .ilike('name_ctn', cantonName)
        .limit(1)
        .maybeSingle();

    if (existing) {
        return (existing as any).id_ctn;
    }

    // Crear nuevo cantón
    const { data: newCanton, error } = await (supabase as any)
        .from('cantons')
        .insert({
            name_ctn: cantonName,
            province_id_ctn: provinceId,
        })
        .select('id_ctn')
        .single();

    if (error) throw error;
    return (newCanton as any).id_ctn;
}

/**
 * Busca o crea un distrito y retorna su ID
 */
async function findOrCreateDistrict(districtName: string, cantonId: string): Promise<string> {
    // Buscar distrito existente
    const { data: existing } = await (supabase as any)
        .from('districts')
        .select('id_dst')
        .eq('canton_id_dst', cantonId)
        .ilike('name_dst', districtName)
        .limit(1)
        .maybeSingle();

    if (existing) {
        return (existing as any).id_dst;
    }

    // Crear nuevo distrito
    const { data: newDistrict, error } = await (supabase as any)
        .from('districts')
        .insert({
            name_dst: districtName,
            canton_id_dst: cantonId,
        })
        .select('id_dst')
        .single();

    if (error) throw error;
    return (newDistrict as any).id_dst;
}

/**
 * Interfaz para datos de ubicación geográfica
 */
export interface LocationHierarchy {
    country: string;
    province: string;
    canton: string;
    district: string;
}

/**
 * Encuentra o crea toda la jerarquía de ubicación y retorna el district_id
 * 
 * @param location - Datos de la ubicación (país, provincia, cantón, distrito)
 * @returns Promise<string> - ID del distrito
 * 
 * @example
 * ```ts
 * const districtId = await findOrCreateLocationHierarchy({
 *   country: 'Costa Rica',
 *   province: 'San José',
 *   canton: 'Central',
 *   district: 'Carmen'
 * });
 * ```
 */
export async function findOrCreateLocationHierarchy(
    location: LocationHierarchy
): Promise<string> {
    try {
        // 1. País
        const countryId = await findOrCreateCountry(location.country);

        // 2. Provincia
        const provinceId = await findOrCreateProvince(location.province, countryId);

        // 3. Cantón
        const cantonId = await findOrCreateCanton(location.canton, provinceId);

        // 4. Distrito
        const districtId = await findOrCreateDistrict(location.district, cantonId);

        return districtId;
    } catch (error) {
        console.error('[findOrCreateLocationHierarchy] Error:', error);
        throw new Error('No se pudo crear o encontrar la ubicación geográfica');
    }
}

/**
 * Valida que los datos de ubicación sean válidos
 */
export function validateLocationData(location: Partial<LocationHierarchy>): boolean {
    return !!(
        location.country?.trim() &&
        location.province?.trim() &&
        location.canton?.trim() &&
        location.district?.trim()
    );
}
