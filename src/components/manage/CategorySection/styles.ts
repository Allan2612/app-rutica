import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

/**
 * Estilos específicos para CategorySection
 * Los estilos base de sección se importan de form-section-styles.ts
 */
export const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 8,
        gap: spacing.xs,
    },
    selectButtonText: {
        color: '#fff',
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    chipsContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        paddingVertical: spacing.xs,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 16,
        borderWidth: 1,
        gap: spacing.xs,
    },
    chipText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    placeholder: {
        padding: spacing.lg,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 60,
    },
    placeholderText: {
        fontSize: typography.sizes.sm,
        fontStyle: 'italic',
    },
});

