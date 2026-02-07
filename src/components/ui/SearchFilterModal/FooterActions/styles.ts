import { StyleSheet } from 'react-native';
import { spacing, typography, colors } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        borderTopWidth: 1,
    },
    clearButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clearButtonText: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
    },
    applyButton: {
        flex: 2,
        paddingVertical: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyButtonText: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.bold,
        color: colors.text.inverse,
    },
});
