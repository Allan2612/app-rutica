import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: spacing.sm + 4,
        flexWrap: 'wrap',
    },
    statCard: {
        flex: 1,
        minWidth: 150,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm + 4,
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statContent: {
        gap: 2,
    },
    statValue: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        lineHeight: 30,
    },
    statLabel: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.medium,
    },
});
