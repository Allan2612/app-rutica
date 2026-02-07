import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: spacing.sm,
        borderWidth: 2,
        marginTop: spacing.md,
    },
    text: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
});
