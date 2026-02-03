import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        gap: spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    headerTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.semibold,
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 6,
    },
    clearText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    section: {
        gap: spacing.xs,
    },
    sectionLabel: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    searchInput: {
        fontSize: typography.sizes.base,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 20,
        borderWidth: 1,
    },
    chipText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
});
