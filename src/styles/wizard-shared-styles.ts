import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';
import { PROMO_UI } from '@/styles/theme';

/**
 * Estilos compartidos para componentes de selección en el wizard
 * Reduce código duplicado entre ProductSelection, CategorySelection, ComboSelection
 */

// Estilos comunes para sección header con badge de contador
export const sectionHeaderStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    countBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: 10,
    },
    countText: {
        color: colors.text.inverse,
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.semibold,
    },
});

// Estilos comunes para estados de carga y vacío
export const stateStyles = StyleSheet.create({
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        gap: spacing.sm,
    },
    loadingText: {
        fontSize: typography.sizes.sm,
    },
    emptyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        gap: spacing.sm,
    },
    emptyText: {
        fontSize: typography.sizes.sm,
    },
});

// Estilos comunes para contenedores de scroll
export const scrollContainerStyles = StyleSheet.create({
    productScroll: {
        maxHeight: PROMO_UI.scrollMaxHeight.products,
        borderWidth: 1,
        borderRadius: PROMO_UI.borderRadius.small,
        padding: spacing.sm,
    },
    comboScroll: {
        maxHeight: PROMO_UI.scrollMaxHeight.combos,
        borderWidth: 1,
        borderRadius: PROMO_UI.borderRadius.small,
        padding: spacing.sm,
    },
});

// Estilos comunes para tarjetas de productos
export const productCardStyles = StyleSheet.create({
    card: {
        borderRadius: PROMO_UI.borderRadius.medium,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    name: {
        flex: 1,
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    price: {
        fontSize: typography.sizes.sm,
    },
});

// Estilos comunes para checkbox
export const checkboxStyles = StyleSheet.create({
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

// Estilos comunes para mensajes de error
export const errorStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: spacing.xs,
    },
    text: {
        fontSize: typography.sizes.xs,
    },
});

// Estilos comunes para texto de ayuda
export const helperStyles = StyleSheet.create({
    text: {
        fontSize: typography.sizes.xs,
        marginBottom: spacing.sm,
    },
});
