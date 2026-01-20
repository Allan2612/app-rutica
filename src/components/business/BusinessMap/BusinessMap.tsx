import { memo, useMemo } from 'react';
import { View, Text, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useThemedColors } from '@/hooks';
import { generateMapHTML } from '@/features/maps/services/maps.service';
import { styles } from './styles';

interface BusinessMapProps {
    latitude: number;
    longitude: number;
    businessName: string;
    phone?: string | null;
}

export const BusinessMap = memo(function BusinessMap({
    latitude,
    longitude,
    businessName,
    phone,
}: BusinessMapProps) {
    const colors = useThemedColors();

    const mapHTML = useMemo(() => {
        // SVG del icono de teléfono (lucide Phone)
        const phoneSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${colors.primary[500]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`;

        const popupContent = `<b>${businessName}</b>${phone ? `<br>${phoneSvg}${phone}` : ''}`;
        return generateMapHTML(latitude, longitude, {
            theme: colors.theme,
            zoom: 16,
            popupText: popupContent,
        });
    }, [latitude, longitude, businessName, phone, colors.theme, colors.primary]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                Ubicación
            </Text>

            {/* Map Container */}
            <View style={[styles.mapContainer, { backgroundColor: colors.background.tertiary }]}>
                {Platform.OS === 'web' ? (
                    <iframe
                        srcDoc={mapHTML}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            borderRadius: 12,
                        }}
                        title={`Mapa de ${businessName}`}
                    />
                ) : (
                    <WebView
                        source={{ html: mapHTML }}
                        style={styles.webview}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                    />
                )}
            </View>
        </View>
    );
});
