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
        maxWidth: 600,
        maxHeight: '90%',
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
    scrollContent: {
        maxHeight: 500,
    },
    content: {
        padding: spacing.lg,
        gap: spacing.lg,
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
    section: {
        gap: spacing.sm,
    },
    sectionLabel: {
        fontSize: typography.sizes.base,
        fontWeight: '600',
    },
    starsContainer: {
        flexDirection: 'row',
        gap: spacing.xs,
        justifyContent: 'center',
        paddingVertical: spacing.sm,
    },
    ratingText: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
        fontWeight: '500',
    },
    commentInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: spacing.md,
        fontSize: typography.sizes.base,
        minHeight: 100,
    },
    charCount: {
        fontSize: typography.sizes.xs,
        textAlign: 'right',
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
    saveButton: {
        // Additional styles if needed
    },
    buttonText: {
        fontSize: typography.sizes.base,
        fontWeight: '600',
    },
});
