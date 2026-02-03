import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    statCard: {
        flex: 1,
        minWidth: '47%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        gap: spacing.sm,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statContent: {
        flex: 1,
        gap: 2,
    },
    statValue: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.fontWeights.bold,
    },
    statLabel: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.medium,
    },
});
