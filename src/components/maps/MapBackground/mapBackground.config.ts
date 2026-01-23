/**
 * Configuración de paths, nodos y puntos viajeros para MapBackground
 */
import type { PathConfig, NodeConfig, TravelingDotConfig } from './types';

/**
 * Genera los paths SVG escalados al tamaño de pantalla
 */
export function createPaths(w: number, h: number): PathConfig[] {
    return [
        {
            id: 'p1',
            d: `M ${w * 0.05} ${h * 0.25} Q ${w * 0.2} ${h * 0.15} ${w * 0.35} ${h * 0.28} T ${w * 0.55} ${h * 0.22}`,
            strokeWidth: 2,
        },
        {
            id: 'p2',
            d: `M ${w * 0.4} ${h * 0.35} Q ${w * 0.55} ${h * 0.45} ${w * 0.7} ${h * 0.38} T ${w * 0.95} ${h * 0.42}`,
            strokeWidth: 1.5,
        },
        {
            id: 'p3',
            d: `M ${w * 0.1} ${h * 0.55} C ${w * 0.25} ${h * 0.5} ${w * 0.35} ${h * 0.65} ${w * 0.5} ${h * 0.58}`,
            strokeWidth: 2,
        },
        {
            id: 'p4',
            d: `M ${w * 0.5} ${h * 0.58} Q ${w * 0.65} ${h * 0.52} ${w * 0.75} ${h * 0.62} T ${w * 0.92} ${h * 0.55}`,
            strokeWidth: 1.5,
        },
        {
            id: 'p5',
            d: `M ${w * 0.15} ${h * 0.75} C ${w * 0.3} ${h * 0.7} ${w * 0.45} ${h * 0.82} ${w * 0.6} ${h * 0.78}`,
            strokeWidth: 2,
        },
        {
            id: 'p6',
            d: `M ${w * 0.6} ${h * 0.78} Q ${w * 0.75} ${h * 0.72} ${w * 0.85} ${h * 0.85} T ${w * 0.95} ${h * 0.8}`,
            strokeWidth: 1.5,
        },
        {
            id: 'p7',
            d: `M ${w * 0.25} ${h * 0.2} Q ${w * 0.28} ${h * 0.35} ${w * 0.22} ${h * 0.5} T ${w * 0.25} ${h * 0.7}`,
            strokeWidth: 1.5,
        },
        {
            id: 'p8',
            d: `M ${w * 0.7} ${h * 0.25} C ${w * 0.72} ${h * 0.4} ${w * 0.68} ${h * 0.55} ${w * 0.72} ${h * 0.72}`,
            strokeWidth: 1.5,
        },
        {
            id: 'p9',
            d: `M ${w * 0.48} ${h * 0.3} Q ${w * 0.5} ${h * 0.45} ${w * 0.52} ${h * 0.58}`,
            strokeWidth: 1,
        },
    ];
}

/**
 * Nodos predefinidos (puntos de interés en intersecciones)
 */
export const NODES: NodeConfig[] = [
    { id: 'n1', cx: 5, cy: 25, r: 5, delay: 0 },
    { id: 'n2', cx: 35, cy: 28, r: 4, delay: 600 },
    { id: 'n3', cx: 55, cy: 22, r: 6, delay: 300 },
    { id: 'n4', cx: 25, cy: 20, r: 4, delay: 900 },
    { id: 'n5', cx: 40, cy: 35, r: 5, delay: 1200 },
    { id: 'n6', cx: 70, cy: 38, r: 6, delay: 500 },
    { id: 'n7', cx: 95, cy: 42, r: 4, delay: 800 },
    { id: 'n8', cx: 10, cy: 55, r: 5, delay: 1100 },
    { id: 'n9', cx: 50, cy: 58, r: 7, delay: 200 },
    { id: 'n10', cx: 75, cy: 62, r: 5, delay: 1400 },
    { id: 'n11', cx: 92, cy: 55, r: 4, delay: 700 },
    { id: 'n12', cx: 15, cy: 75, r: 6, delay: 1000 },
    { id: 'n13', cx: 60, cy: 78, r: 5, delay: 400 },
    { id: 'n14', cx: 85, cy: 85, r: 6, delay: 1300 },
    { id: 'n15', cx: 25, cy: 70, r: 4, delay: 1600 },
    { id: 'n16', cx: 72, cy: 72, r: 5, delay: 1500 },
];

/**
 * Configuración de puntos viajeros
 */
export const TRAVELING_DOTS: TravelingDotConfig[] = [
    { id: 'td1', startX: 5, startY: 25, endX: 55, endY: 22, duration: 14000, delay: 0 },
    { id: 'td2', startX: 10, startY: 55, endX: 92, endY: 55, duration: 18000, delay: 4000 },
    { id: 'td3', startX: 25, startY: 20, endX: 25, endY: 70, duration: 12000, delay: 2000 },
];
