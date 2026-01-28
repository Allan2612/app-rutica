import { StyleSheet, Platform } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.md,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 360,
        borderRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
            web: {
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
            },
        }),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.semibold,
    },
    closeButton: {
        padding: spacing.xs,
    },
    content: {
        padding: spacing.md,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.md,
        padding: spacing.lg,
        paddingTop: spacing.sm,
    },
    button: {
        flex: 1,
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        borderWidth: 1,
    },
    cancelText: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.medium,
    },
    confirmButton: {},
    confirmText: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
        color: colors.text.inverse,
    },
});
