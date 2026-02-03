import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    dialog: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        padding: spacing.lg,
        borderBottomWidth: 1,
    },
    title: {
        flex: 1,
        fontSize: typography.sizes.xl,
        fontWeight: typography.fontWeights.semibold,
    },
    content: {
        padding: spacing.lg,
        gap: spacing.md,
    },
    message: {
        fontSize: typography.sizes.base,
        lineHeight: 22,
    },
    infoBox: {
        padding: spacing.md,
        borderRadius: 8,
        gap: spacing.sm,
    },
    infoRow: {
        gap: 2,
    },
    infoLabel: {
        fontSize: typography.sizes.xs,
        textTransform: 'uppercase',
        fontWeight: typography.fontWeights.semibold,
    },
    infoValue: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.medium,
    },
    warning: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
        textAlign: 'center',
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
        padding: spacing.lg,
        borderTopWidth: 1,
    },
    button: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
    },
    cancelButton: {},
    deleteButton: {},
    buttonText: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
    },
});
