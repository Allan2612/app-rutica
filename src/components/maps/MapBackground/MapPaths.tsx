import { memo } from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { PulsingNode } from './PulsingNode';
import type { PathConfig, NodeConfig } from './types';

interface MapPathsProps {
    width: number;
    height: number;
    paths: PathConfig[];
    nodes: NodeConfig[];
    strokeColor: string;
    nodeColor: string;
}

/**
 * Renderiza los paths SVG y nodos del mapa de fondo
 */
export const MapPaths = memo(function MapPaths({
    width,
    height,
    paths,
    nodes,
    strokeColor,
    nodeColor,
}: MapPathsProps) {
    return (
        <Svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* Rutas (paths con curvas bezier) */}
            <G>
                {paths.map((path) => (
                    <Path
                        key={path.id}
                        d={path.d}
                        stroke={strokeColor}
                        strokeWidth={path.strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        opacity={0.6}
                    />
                ))}
            </G>

            {/* Nodos pulsantes */}
            <G>
                {nodes.map((node) => (
                    <PulsingNode
                        key={node.id}
                        cx={node.cx}
                        cy={node.cy}
                        r={node.r}
                        delay={node.delay}
                        color={nodeColor}
                        width={width}
                        height={height}
                    />
                ))}
            </G>
        </Svg>
    );
});
