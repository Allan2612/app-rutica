import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        // Se ajusta al contenido
    },
    content: {
        padding: spacing.md,
        gap: spacing.md,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
    },
    dateText: {
        fontSize: typography.sizes.sm,
    },
    fieldError: {
        fontSize: typography.sizes.xs,
        marginTop: spacing.xs,
    },
    durationBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: spacing.sm,
        marginTop: spacing.sm,
    },
    durationText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.medium,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: spacing.xs,
    },
    errorText: {
        fontSize: typography.sizes.xs,
    },
});
