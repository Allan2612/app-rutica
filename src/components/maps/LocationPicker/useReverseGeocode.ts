import { useState, useCallback } from 'react';
import type { LocationData } from './types';

interface UseReverseGeocodeReturn {
    reverseGeocode: (lat: number, lng: number, validateCountry?: boolean) => Promise<LocationData>;
    isLoading: boolean;
    error: string | null;
}

/**
 * Hook para geocodificación inversa usando Nominatim (OpenStreetMap)
 */
export function useReverseGeocode(): UseReverseGeocodeReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reverseGeocode = useCallback(async (
        lat: number,
        lng: number,
        validateCountry: boolean = true
    ): Promise<LocationData> => {
        setIsLoading(true);
        setError(null);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
                {
                    signal: controller.signal,
                    headers: {
                        'Accept-Language': 'es',
                        'User-Agent': 'RuticaApp/1.0 (Costa Rica Tourism)',
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
                    const isCostaRica =
                        countryCode === 'cr' ||
                        country.toLowerCase().includes('costa rica');

                    if (!isCostaRica) {
                        const errorMsg = `La ubicación está en ${country || 'otro país'}, debe estar en Costa Rica`;
                        setError(errorMsg);
                        throw new Error(errorMsg);
                    }
                }

                // Mapeo más completo de campos para Costa Rica
                // Provincia (state es el campo principal en CR)
                const provinceName = addr.state || addr.province || addr.region || '';

                // Cantón (county o municipality)
                const cantonName = addr.county || addr.municipality || addr.city_district || '';

                // Distrito (puede estar en city, town, village, suburb, neighbourhood)
                const districtName =
                    addr.suburb ||
                    addr.neighbourhood ||
                    addr.village ||
                    addr.town ||
                    addr.city ||
                    addr.hamlet ||
                    '';

                // Log para debug (puedes removerlo después)
                console.log('[useReverseGeocode] Campos obtenidos:', {
                    country,
                    province: provinceName,
                    canton: cantonName,
                    district: districtName,
                    raw_address: addr
                });

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
                const errorMsg = 'No se pudo verificar que la ubicación esté en Costa Rica';
                setError(errorMsg);
                throw new Error(errorMsg);
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

            console.error('[useReverseGeocode] Error:', error);
            return {
                latitude: lat,
                longitude: lng,
            };
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { reverseGeocode, isLoading, error };
}
