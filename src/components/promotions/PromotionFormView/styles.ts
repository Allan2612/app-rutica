/**
 * Estilos para PromotionFormView
 * TODO: Actualizar cuando se implemente el formulario completo
 */

import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.md,
    },
    placeholder: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.fontWeights.semibold,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    info: {
        fontSize: typography.sizes.sm,
        marginBottom: spacing.sm,
    },
});
