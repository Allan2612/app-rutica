import { useCallback } from 'react';
import type { LocationData } from './types';

// Constantes
const NOMINATIM_TIMEOUT = 8000;
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
const USER_AGENT = 'RuticaApp/1.0 (Costa Rica Tourism)';
const COSTA_RICA_IDENTIFIERS = ['cr', 'costa rica'];

interface UseReverseGeocodeReturn {
    reverseGeocode: (lat: number, lng: number, validateCountry?: boolean) => Promise<LocationData>;
}

/**
 * Hook para geocodificación inversa usando Nominatim (OpenStreetMap)
 */
export function useReverseGeocode(): UseReverseGeocodeReturn {
    const reverseGeocode = useCallback(async (
        lat: number,
        lng: number,
        validateCountry: boolean = true
    ): Promise<LocationData> => {

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), NOMINATIM_TIMEOUT);

            const response = await fetch(
                `${NOMINATIM_URL}?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
                {
                    signal: controller.signal,
                    headers: {
                        'Accept-Language': 'es',
                        'User-Agent': USER_AGENT,
                    },
                }
            );
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor de geocodificación');
            }

            const data = await response.json();

            if (data && data.address) {
                const addr = data.address;
                const country = addr.country || '';
                const countryCode = addr.country_code?.toLowerCase() || '';

                if (validateCountry) {
                    if (!COSTA_RICA_IDENTIFIERS.some(
                        (id) => countryCode === id || country.toLowerCase().includes(id)
                    )) {
                        throw new Error(`La ubicación está en ${country || 'otro país'}, debe estar en Costa Rica`);
                    }
                }

                // Mapeo más completo de campos para Costa Rica
                // Provincia (state es el campo principal en CR)
                const provinceName = addr.state || addr.province || addr.region || '';

                // Cantón (county o municipality)
                const cantonName = addr.county || addr.municipality || addr.city_district || '';

                // Distrito (jerarquía: city/town/village son distritos, suburb/neighbourhood son barrios)
                // Orden correcto: primero buscar city/town/village (distrito), luego hamlet
                // NO usar suburb/neighbourhood porque son subdivisiones del distrito
                const districtName =
                    addr.city ||
                    addr.town ||
                    addr.village ||
                    addr.hamlet ||
                    addr.suburb ||
                    addr.neighbourhood ||
                    '';

                return {
                    latitude: lat,
                    longitude: lng,
                    country: country || 'Costa Rica',
                    province: provinceName,
                    canton: cantonName,
                    district: districtName,
                    address: data.display_name || '',
                };
            }

            if (validateCountry) {
                throw new Error('No se pudo verificar que la ubicación esté en Costa Rica');
            }

            return {
                latitude: lat,
                longitude: lng,
                country: '',
                province: '',
                canton: '',
                district: '',
                address: '',
            };
        } catch (error: any) {
            if (
                error?.message?.includes('debe estar en Costa Rica') ||
                error?.message?.includes('No se pudo verificar')
            ) {
                throw error;
            }
            // Si el error no es de validación, retornar coordenadas sin datos
            return { latitude: lat, longitude: lng };
        }
    }, []);

    return { reverseGeocode };
}
