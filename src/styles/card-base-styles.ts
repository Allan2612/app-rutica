import { StyleSheet } from 'react-native';
import { PROMO_UI } from '@/styles/theme';

/**
 * Estilos base reutilizables para cards con imagen hero
 * Usar como base para PromotionPublicCard, UserPromotionCard, etc.
 */
export const cardBaseStyles = StyleSheet.create({
    // Contenedor principal de la card
    container: {
        borderRadius: PROMO_UI.borderRadius.large,
        overflow: 'hidden',
        minHeight: PROMO_UI.cardMinHeight,
    },

    // Imagen de fondo que cubre toda la card
    heroImage: {
        width: '100%',
        height: '100%',
    },

    // Overlay oscuro para legibilidad
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },

    // Contenedor del contenido sobre la imagen
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 12,
    },

    // Header de la card (arriba)
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    // Footer de la card (abajo)
    footer: {
        gap: 8,
    },

    // Título principal
    title: {
        fontSize: 18,
        fontWeight: '700',
    },

    // Subtítulo o descripción
    subtitle: {
        fontSize: 13,
        fontWeight: '500',
    },

    // Texto de fechas
    dateText: {
        fontSize: 12,
        fontWeight: '500',
    },

    // Fila con ícono + texto
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
});

/**
 * Estilos para estados de carga y vacío
 */
export const loadingEmptyStyles = StyleSheet.create({
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 8,
    },

    loadingText: {
        fontSize: 13,
        textAlign: 'center',
    },

    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        gap: 12,
    },

    emptyText: {
        fontSize: 14,
        textAlign: 'center',
    },
});

/**
 * Estilos para contenedores de selección (checkboxes, radio buttons)
 */
export const selectionContainerStyles = StyleSheet.create({
    container: {
        borderRadius: PROMO_UI.borderRadius.medium,
        padding: 16,
    },

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
    },

    itemBorder: {
        borderBottomWidth: 1,
    },

    itemContent: {
        flex: 1,
    },

    itemTitle: {
        fontSize: 14,
        fontWeight: '600',
    },

    itemDescription: {
        fontSize: 12,
        marginTop: 2,
    },
});

/**
 * Colores de overlay para gradientes en cards
 */
export const overlayColors = {
    transparent: 'rgba(0,0,0,0)',
    light: 'rgba(0,0,0,0.3)',
    medium: 'rgba(0,0,0,0.5)',
    dark: 'rgba(0,0,0,0.85)',
    // Para el gradiente típico de cards
    gradient: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)'] as const,
} as const;
