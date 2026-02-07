/**
 * Sistema de colores para categorías
 * Cada categoría raíz tiene un color principal, y sus subcategorías heredan variaciones
 */

export interface CategoryColorScheme {
    backgroundColor: string;
    textColor: string;
    borderColor?: string;
}

/**
 * Colores base definidos por categoría raíz
 * Estos IDs deben coincidir con los UUIDs de las categorías raíz en la BD
 */
export const CATEGORY_BASE_COLORS: Record<string, string> = {
    // Salud y Medicina - Rojo médico
    '11111111-1111-1111-1111-111111111111': '#EF4444',
    // Alimentación - Naranja cálido
    '22222222-2222-2222-2222-222222222222': '#F97316',
    // Entretenimiento - Púrpura vibrante
    '58da6f12-7e34-498c-b0ad-3be1f48681f4': '#A855F7',
    // Servicios - Azul profesional
    '44444444-4444-4444-4444-444444444444': '#3B82F6',
    // Turismo y Naturaleza - Verde esmeralda
    '55555555-5555-5555-5555-555555555555': '#10B981',
    // Comercio - Amarillo dorado
    'c33a39e2-a9ed-4520-9c1a-b1b81516368d': '#F59E0B',
    // Educación - Índigo académico
    'a9f5ed76-e158-455c-b24a-d3cdbd75b88a': '#6366F1',
    // Hogar y Construcción - Naranja ladrillo
    '565a56f0-e286-43c4-b7af-5a2b9fcdd630': '#F97316',
    // Tecnología y Telecomunicaciones - Cyan tech
    '594929cf-3adb-4ea1-aa2a-a7bbe9558c5e': '#06B6D4',
    // Transporte y Movilidad - Azul marino
    '1a86fd29-8bd3-4cc6-927f-565944bce075': '#3B82F6',
    // Deportes y Fitness - Verde energía
    '8e9fdeea-cdd6-4d8a-95a1-0734e76163c5': '#22C55E',
    // Arte y Cultura - Violeta artístico
    '7a25509e-d599-492e-8548-b49a107e485b': '#8B5CF6',
    // Finanzas - Verde dinero
    'd05ec1dc-a43c-481a-8117-2c485c0eed49': '#10B981',
    // Gobierno y Trámites - Azul institucional
    '8cc5e7f3-8594-4d30-8102-35442109e7d6': '#1E40AF',
    // Comunidad y Organizaciones - Amarillo cálido
    '5105024e-e18e-4d67-87e2-859b70e297ff': '#F59E0B',
    // Seguridad - Rojo alerta
    '1f163ccf-8eba-4638-9124-9fb78300aa1f': '#DC2626',
    // Reciclaje y Medio Ambiente - Verde ecológico
    '420eec16-e39b-490f-9a06-d3f386a7ab81': '#059669',
    // Restaurante (categoría extra)
    'd048c95f-d21b-4eff-8370-99e158ddcc86': '#F97316',
    // Evento (categoría extra)
    'e3910722-21c2-4243-a3dd-53aeec2ac88d': '#EC4899',
};

/**
 * Colores adicionales para categorías sin definición específica
 * Se asignan mediante hash del ID para consistencia
 */
const FALLBACK_COLORS: CategoryColorScheme[] = [
    { backgroundColor: '#6366F1', textColor: '#FFFFFF', borderColor: '#4F46E5' }, // Índigo
    { backgroundColor: '#14B8A6', textColor: '#FFFFFF', borderColor: '#0D9488' }, // Teal
    { backgroundColor: '#F43F5E', textColor: '#FFFFFF', borderColor: '#E11D48' }, // Rosa
    { backgroundColor: '#8B5CF6', textColor: '#FFFFFF', borderColor: '#7C3AED' }, // Violeta
    { backgroundColor: '#06B6D4', textColor: '#FFFFFF', borderColor: '#0891B2' }, // Cyan
    { backgroundColor: '#84CC16', textColor: '#FFFFFF', borderColor: '#65A30D' }, // Lima
    { backgroundColor: '#EAB308', textColor: '#FFFFFF', borderColor: '#CA8A04' }, // Amarillo
    { backgroundColor: '#64748B', textColor: '#FFFFFF', borderColor: '#475569' }, // Slate
];

/**
 * Color por defecto para categorías sin ID o no encontradas
 */
const DEFAULT_COLOR: CategoryColorScheme = {
    backgroundColor: '#9CA3AF',
    textColor: '#FFFFFF',
    borderColor: '#6B7280',
};

/**
 * Convierte un color hex a RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

/**
 * Convierte RGB a hex
 */
function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map((x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

/**
 * Aclara un color hex según el nivel (0 = oscuro, 3 = muy claro)
 * @param baseColor Color base en formato hex
 * @param level Nivel de profundidad (0 = raíz, 1 = nivel 2, 2 = nivel 3, etc.)
 */
function lightenColor(baseColor: string, level: number): string {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return baseColor;

    // Cuanto mayor el nivel, más claro
    // Nivel 0: color base
    // Nivel 1: 40% más claro
    // Nivel 2: 60% más claro
    // Nivel 3+: 75% más claro
    const lightenFactors = [0, 0.4, 0.6, 0.75];
    const factor = lightenFactors[Math.min(level, 3)];

    const r = rgb.r + (255 - rgb.r) * factor;
    const g = rgb.g + (255 - rgb.g) * factor;
    const b = rgb.b + (255 - rgb.b) * factor;

    return rgbToHex(r, g, b);
}

/**
 * Obtiene el nivel de profundidad de una categoría
 * Necesita acceso a la estructura de categorías para calcular el nivel
 */
function getCategoryDepth(categoryId: string, parentId: string | null | undefined, allCategories?: Map<string, { parentId: string | null }>): number {
    // Si es categoría raíz (sin padre)
    if (!parentId) {
        return 0;
    }

    // Si no tenemos acceso a todas las categorías, asumir que:
    // - Si está en CATEGORY_BASE_COLORS = nivel 0 (raíz)
    // - Si su padre está en CATEGORY_BASE_COLORS = nivel 1
    // - Caso contrario = nivel 2+
    if (CATEGORY_BASE_COLORS[categoryId]) {
        return 0;
    }

    if (CATEGORY_BASE_COLORS[parentId]) {
        return 1;
    }

    // Intenta calcular recursivamente si tenemos el mapa
    if (allCategories) {
        let depth = 0;
        let currentParentId: string | null = parentId;
        
        while (currentParentId && depth < 10) { // límite de seguridad
            const parent = allCategories.get(currentParentId);
            if (!parent || !parent.parentId) {
                break;
            }
            depth++;
            currentParentId = parent.parentId;
        }
        
        return depth + 1;
    }

    // Por defecto, asumir nivel 2
    return 2;
}

/**
 * Obtiene el esquema de color para una categoría con soporte de niveles
 */
export function getCategoryColorScheme(
    categoryId: string | null | undefined,
    parentId?: string | null
): CategoryColorScheme {
    if (!categoryId) {
        return DEFAULT_COLOR;
    }

    // Si es una categoría raíz, usar su color base
    if (CATEGORY_BASE_COLORS[categoryId]) {
        const baseColor = CATEGORY_BASE_COLORS[categoryId];
        return {
            backgroundColor: baseColor,
            textColor: '#ffffff',
            borderColor: baseColor,
        };
    }

    // Buscar el color base de la categoría raíz
    let rootColor: string | null = null;
    let depth = 0;

    // Si tiene padre directo que es raíz
    if (parentId && CATEGORY_BASE_COLORS[parentId]) {
        rootColor = CATEGORY_BASE_COLORS[parentId];
        depth = 1;
    } else if (parentId) {
        // Buscar en segundo nivel (el padre del padre podría ser raíz)
        // Por simplicidad, asumimos nivel 2+
        // En producción, necesitarías pasar toda la estructura de categorías
        depth = 2;
        
        // Intentar encontrar algún ancestro conocido
        for (const rootId of Object.keys(CATEGORY_BASE_COLORS)) {
            // Esta es una simplificación, idealmente deberías tener la estructura completa
            rootColor = CATEGORY_BASE_COLORS[rootId];
            break;
        }
    }

    // Si encontramos un color raíz, aplicar el lightening SOLO al fondo
    // El texto en negro para máxima legibilidad
    if (rootColor) {
        const lightenedBgColor = lightenColor(rootColor, depth);
        return {
            backgroundColor: lightenedBgColor,
            textColor: '#ffffff', // Negro para mejor legibilidad
            borderColor: rootColor, // Mantener color base para el borde
        };
    }

    // Fallback: usa hash del ID para asignar color consistente
    return getCategoryColorByHash(categoryId);
}

/**
 * Genera un color consistente basado en el hash del ID
 * Garantiza que el mismo ID siempre tenga el mismo color
 */
function getCategoryColorByHash(categoryId: string): CategoryColorScheme {
    let hash = 0;
    for (let i = 0; i < categoryId.length; i++) {
        const char = categoryId.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convertir a entero de 32 bits
    }

    const index = Math.abs(hash) % FALLBACK_COLORS.length;
    return FALLBACK_COLORS[index];
}

/**
 * Obtiene un color más claro para hover/pressed states
 */
export function getCategoryColorLighter(color: string, amount: number = 0.2): string {
    // Simple lightening by adjusting opacity or using rgba
    if (color.startsWith('#')) {
        return color + Math.floor(255 * (1 - amount)).toString(16).padStart(2, '0');
    }
    return color;
}
