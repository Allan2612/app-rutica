import { StyleSheet } from 'react-native';
import { spacing, typography, colors } from '@/styles/theme';

export const styles = StyleSheet.create({
    card: {
        flex: 1,
        maxWidth: '32%',
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: spacing.md,
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    content: {
        padding: spacing.sm,
        gap: spacing.xs,
    },
    name: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    description: {
        fontSize: typography.sizes.xs,
        lineHeight: 16,
    },
    price: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.bold,
        marginTop: spacing.xs - 2,
    },
});
