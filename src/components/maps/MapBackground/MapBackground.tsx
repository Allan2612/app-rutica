import { memo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';
import { createPaths, NODES, TRAVELING_DOTS } from './mapBackground.config';
import { MapPaths } from './MapPaths';
import { TravelingDot } from './TravelingDot';

/**
 * Fondo animado con rutas de mapa, nodos y puntos viajeros
 */
export const MapBackground = memo(function MapBackground() {
    const colors = useThemedColors();
    const { width, height } = useWindowDimensions();
    const { isDark } = colors;

    // Opacidad total del fondo según tema
    const containerOpacity = isDark ? 0.18 : 0.1;

    // Colores para rutas y nodos
    const strokeColor = isDark ? colors.primary[400] : colors.primary[600];
    const nodeColor = isDark ? colors.primary[300] : colors.primary[500];

    // Colores del gradiente
    const gradientColors: [string, string, string] = [
        colors.background.primary,
        colors.background.secondary,
        colors.background.primary,
    ];

    // Generar paths escalados
    const paths = createPaths(width, height);

    return (
        <View style={styles.container} pointerEvents="none">
            {/* Gradiente de fondo sutil */}
            <LinearGradient
                colors={gradientColors}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* SVG con rutas y nodos */}
            <View style={[styles.elementsContainer, { opacity: containerOpacity }]}>
                <MapPaths
                    width={width}
                    height={height}
                    paths={paths}
                    nodes={NODES}
                    strokeColor={strokeColor}
                    nodeColor={nodeColor}
                />

                {/* Puntos viajeros */}
                {TRAVELING_DOTS.map((dot) => (
                    <TravelingDot
                        key={dot.id}
                        startX={dot.startX}
                        startY={dot.startY}
                        endX={dot.endX}
                        endY={dot.endY}
                        duration={dot.duration}
                        delay={dot.delay}
                        color={nodeColor}
                    />
                ))}
            </View>
        </View>
    );
});
