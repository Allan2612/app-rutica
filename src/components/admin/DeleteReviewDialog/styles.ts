import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    dialog: {
        width: '100%',
        maxWidth: 500,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
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
        fontSize: typography.sizes.lg,
        fontWeight: '700',
    },
    content: {
        padding: spacing.lg,
        gap: spacing.md,
    },
    message: {
        fontSize: typography.sizes.base,
        lineHeight: 24,
    },
    infoBox: {
        padding: spacing.md,
        borderRadius: 8,
        gap: spacing.sm,
    },
    infoRow: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    infoLabel: {
        fontSize: typography.sizes.sm,
        fontWeight: '600',
        minWidth: 80,
    },
    infoValue: {
        flex: 1,
        fontSize: typography.sizes.sm,
    },
    warning: {
        fontSize: typography.sizes.sm,
        fontWeight: '600',
        fontStyle: 'italic',
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
        paddingHorizontal: spacing.lg,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    cancelButton: {
        // Additional styles if needed
    },
    deleteButton: {
        // Additional styles if needed
    },
    buttonText: {
        fontSize: typography.sizes.base,
        fontWeight: '600',
    },
});
