import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    closeButton: {
        padding: spacing.xs,
        marginRight: spacing.md,
    },
    title: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.fontWeights.semibold,
        flex: 1,
    },
    confirmButton: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: 8,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: typography.sizes.md,
        fontWeight: typography.fontWeights.semibold,
    },
    content: {
        flex: 1,
    },
});
