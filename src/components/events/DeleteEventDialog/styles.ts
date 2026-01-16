import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    dialog: {
        width: '100%',
        maxWidth: 500,
        borderRadius: 16,
        padding: spacing.xl,
        gap: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        padding: spacing.xs,
    },
    content: {
        gap: spacing.md,
    },
    title: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.fontWeights.bold,
    },
    description: {
        fontSize: typography.sizes.base,
        lineHeight: 24,
    },
    bold: {
        fontWeight: typography.fontWeights.bold,
    },
    warningBox: {
        padding: spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        marginTop: spacing.xs,
    },
    warningText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
        textAlign: 'center',
    },
    label: {
        fontSize: typography.sizes.sm,
        marginTop: spacing.sm,
    },
    input: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: typography.sizes.base,
        marginTop: spacing.xs,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.sm,
    },
    button: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {},
    deleteButton: {},
    buttonText: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
    },
});
