import { memo, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import Toast from 'react-native-toast-message';
import { isWithinCostaRica } from '@/utils/geoHelpers';
import { styles } from './styles';
import type { LocationData } from './types';

// Constantes
const TOAST_VISIBILITY = 4000;
const INVALID_LOCATION_TITLE = 'Ubicación no válida';
const OUTSIDE_CR_MESSAGE = 'La ubicación debe estar dentro de Costa Rica';

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
    const showError = useCallback((message: string) => {
        Toast.show({
            type: 'error',
            text1: INVALID_LOCATION_TITLE,
            text2: message,
            position: 'top',
            visibilityTime: TOAST_VISIBILITY,
        });
    }, []);

    const handleMapMessage = useCallback((data: any) => {
        if (data.error) {
            showError(data.error);
            return;
        }

        if (data.latitude && data.longitude) {
            if (!isWithinCostaRica(data.latitude, data.longitude)) {
                showError(OUTSIDE_CR_MESSAGE);
                return;
            }

            onLocationChange({
                latitude: data.latitude,
                longitude: data.longitude,
            });
        }
    }, [onLocationChange, showError]);

    const handleWebViewMessage = useCallback((event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            handleMapMessage(data);
        } catch {
            // Ignorar mensajes inválidos
        }
    }, [handleMapMessage]);

    const parseMessage = useCallback((eventData: string) => {
        try {
            return JSON.parse(eventData);
        } catch {
            return null;
        }
    }, []);

    // Cleanup del event listener en web
    useEffect(() => {
        if (Platform.OS !== 'web') return;

        const listener = (event: MessageEvent) => {
            const data = parseMessage(event.data);
            if (data) handleMapMessage(data);
        };

        window.addEventListener('message', listener);

        return () => {
            window.removeEventListener('message', listener);
        };
    }, [handleMapMessage, parseMessage]);

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
                onLoad={onLoadEnd}
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
