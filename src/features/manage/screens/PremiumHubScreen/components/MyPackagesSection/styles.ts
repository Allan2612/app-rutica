import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    section: {
        width: '100%',
        maxWidth: 600,
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.semibold,
    },
    filterTabs: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    filterTab: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: 16,
    },
    filterTabText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.medium,
    },
    emptyPackagesText: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
        paddingVertical: spacing.lg,
    },
});
