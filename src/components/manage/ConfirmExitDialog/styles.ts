import { StyleSheet, Platform } from 'react-native';
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
        maxWidth: 420,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
        overflow: 'hidden',
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
        borderRadius: 8,
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
        lineHeight: 22,
    },
    warningBox: {
        padding: spacing.md,
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    warningText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
        flex: 1,
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
        paddingHorizontal: spacing.sm,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: spacing.sm,
        minHeight: 44,
    },
    buttonText: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
    },
});

// Estilos específicos para web
export const webStyles = Platform.select({
    web: {
        dialog: {
            cursor: 'default' as const,
        },
        button: {
            cursor: 'pointer' as const,
            transition: 'opacity 0.2s ease',
        },
        closeButton: {
            cursor: 'pointer' as const,
        },
    },
    default: {},
});
