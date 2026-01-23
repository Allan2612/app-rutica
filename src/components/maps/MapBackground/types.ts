/**
 * Tipos y configuración para MapBackground
 */

/**
 * Configuración de rutas SVG
 */
export interface PathConfig {
    id: string;
    d: string;
    strokeWidth: number;
}

/**
 * Configuración de nodos (puntos de interés)
 */
export interface NodeConfig {
    id: string;
    cx: number; // % del ancho
    cy: number; // % del alto
    r: number;
    delay: number;
}

/**
 * Configuración de punto viajero
 */
export interface TravelingDotConfig {
    id: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    duration: number;
    delay: number;
}
