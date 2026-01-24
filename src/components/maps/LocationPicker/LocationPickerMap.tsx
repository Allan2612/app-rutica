import { memo, useCallback } from 'react';
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import Toast from 'react-native-toast-message';
import { isWithinCostaRica } from '@/utils/geoHelpers';
import { styles } from './styles';
import type { LocationData } from './types';

interface LocationPickerMapProps {
    mapKey: number;
    mapHTML: string;
    onLocationChange: (data: LocationData) => void;
    onLoadEnd: () => void;
}

/**
 * Componente del mapa (WebView en mobile, iframe en web)
 */
export const LocationPickerMap = memo(function LocationPickerMap({
    mapKey,
    mapHTML,
    onLocationChange,
    onLoadEnd,
}: LocationPickerMapProps) {

    const handleMapMessage = useCallback((data: any) => {
        // Manejar mensajes de error (ubicación fuera de Costa Rica)
        if (data.error) {
            Toast.show({
                type: 'error',
                text1: 'Ubicación no válida',
                text2: data.error,
                position: 'top',
                visibilityTime: 3000,
            });
            return;
        }

        if (data.latitude && data.longitude) {
            // Validar que esté dentro de Costa Rica
            if (!isWithinCostaRica(data.latitude, data.longitude)) {
                Toast.show({
                    type: 'error',
                    text1: 'Ubicación no válida',
                    text2: 'La ubicación debe estar dentro de Costa Rica',
                    position: 'top',
                    visibilityTime: 3000,
                });
                return;
            }

            onLocationChange({
                latitude: data.latitude,
                longitude: data.longitude,
            });
        }
    }, [onLocationChange]);

    const handleWebViewMessage = useCallback((event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            handleMapMessage(data);
        } catch {
            // Error parsing message
        }
    }, [handleMapMessage]);

    if (Platform.OS === 'web') {
        return (
            <iframe
                key={mapKey}
                srcDoc={mapHTML}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 0,
                    flex: 1,
                }}
                onLoad={() => {
                    onLoadEnd();
                    window.addEventListener('message', (event) => {
                        try {
                            const data = JSON.parse(event.data);
                            handleMapMessage(data);
                        } catch {
                            // Ignorar mensajes no JSON
                        }
                    });
                }}
            />
        );
    }

    return (
        <WebView
            key={mapKey}
            source={{ html: mapHTML }}
            style={styles.webview}
            onMessage={handleWebViewMessage}
            onLoadEnd={onLoadEnd}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
        />
    );
});
