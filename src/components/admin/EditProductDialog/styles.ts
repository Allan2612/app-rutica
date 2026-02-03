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
        maxHeight: '80%',
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
    scrollContent: {
        maxHeight: 500,
    },
    content: {
        padding: spacing.lg,
        gap: spacing.md,
    },
    infoBox: {
        padding: spacing.md,
        borderRadius: 8,
        gap: 2,
    },
    infoLabel: {
        fontSize: typography.sizes.xs,
        textTransform: 'uppercase',
        fontWeight: typography.fontWeights.semibold,
    },
    infoValue: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
    },
    field: {
        gap: spacing.xs,
    },
    label: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    input: {
        fontSize: typography.sizes.base,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
        paddingTop: spacing.sm,
    },
    note: {
        fontSize: typography.sizes.xs,
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
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
    },
    cancelButton: {},
    saveButton: {},
    buttonText: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
    },
});
