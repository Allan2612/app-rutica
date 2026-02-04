import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    buyerNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.lg,
        marginHorizontal: spacing.lg,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
        borderRadius: 12,
        borderWidth: 1,
    },
    buyerNoticeText: {
        flex: 1,
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
        lineHeight: 20,
    },
});
