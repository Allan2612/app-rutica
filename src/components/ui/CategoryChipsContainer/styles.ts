import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
    },
    
    // Contador default
    counter: {
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: spacing.xs + 2,
        borderRadius: 12,
        backgroundColor: 'rgba(107, 114, 128, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.semibold,
        color: 'rgba(107, 114, 128, 1)',
    },

    // Contador small
    counterSmall: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 10,
        backgroundColor: 'rgba(107, 114, 128, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterTextSmall: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.semibold,
        color: 'rgba(107, 114, 128, 1)',
    },

    // Contador large
    counterLarge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 16,
        backgroundColor: 'rgba(107, 114, 128, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterTextLarge: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.bold,
        color: 'rgba(107, 114, 128, 1)',
    },
});
