import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

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
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: spacing.lg,
        paddingBottom: spacing.md,
    },
    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        padding: spacing.xs,
    },
    content: {
        padding: spacing.lg,
        paddingTop: 0,
        gap: spacing.md,
    },
    title: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.fontWeights.bold,
    },
    description: {
        fontSize: typography.sizes.sm,
        lineHeight: 20,
    },
    bold: {
        fontWeight: typography.fontWeights.bold,
    },
    warningBox: {
        padding: spacing.md,
        borderRadius: 8,
        borderWidth: 1,
    },
    warningText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
        textAlign: 'center',
    },
    label: {
        fontSize: typography.sizes.sm,
        lineHeight: 20,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        fontSize: typography.sizes.base,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.md,
        padding: spacing.lg,
        paddingTop: spacing.md,
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
