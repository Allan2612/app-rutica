import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    scrollContent: {
        gap: spacing.sm,
        paddingVertical: spacing.xs,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        borderWidth: 1,
        gap: spacing.xs,
    },
    chipText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    loadingContainer: {
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: typography.sizes.sm,
    },
});
