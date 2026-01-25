import { memo } from 'react';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface MapLoadingProps {
    message: string;
}

export const MapLoading = memo(function MapLoading({ message }: MapLoadingProps) {
    const colors = useThemedColors();

    return (
        <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                {message}
            </Text>
        </View>
    );
});

interface MapErrorProps {
    error: string;
    onRetry: () => void;
}

export const MapError = memo(function MapError({ error, onRetry }: MapErrorProps) {
    const colors = useThemedColors();

    return (
        <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
            <Text style={[styles.errorText, { color: colors.error[500] }]}>{error}</Text>
            <Text style={[styles.helpText, { color: colors.text.secondary }]}>
                {Platform.OS === 'web'
                    ? 'Selecciona una ubicación global desde el selector o habilita permisos en el navegador'
                    : 'Selecciona una ubicación global desde el selector o habilita permisos de ubicación en la app'}
            </Text>
            <TouchableOpacity
                style={[styles.retryButton, { backgroundColor: colors.primary[500] }]}
                onPress={onRetry}
            >
                <Text style={[styles.buttonText, { color: colors.text.inverse }]}>Reintentar</Text>
            </TouchableOpacity>
        </View>
    );
});

interface MapOverlayProps {
    visible: boolean;
}

export const MapOverlay = memo(function MapOverlay({ visible }: MapOverlayProps) {
    const colors = useThemedColors();

    if (!visible) return null;

    return (
        <View style={[styles.overlay, { backgroundColor: colors.background.primary }]}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
    );
});
