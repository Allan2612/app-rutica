import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

/**
 * Estilos compartidos para todas las secciones de formularios
 * Usado por: BasicInfoSection, ContactSection, SocialLinksSection, LocationSection, etc.
 * 
 * Centraliza los estilos comunes para mantener consistencia visual
 * y facilitar el mantenimiento en un solo lugar.
 */
export const formSectionStyles = StyleSheet.create({
    section: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.semibold,
        marginBottom: spacing.lg,
    },
    inputGroup: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
        marginBottom: spacing.sm,
    },
    required: {
        color: '#ef4444',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        fontSize: typography.sizes.sm,
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        fontSize: typography.sizes.sm,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    error: {
        color: '#ef4444',
        fontSize: typography.sizes.xs,
        marginTop: 4,
    },
});
