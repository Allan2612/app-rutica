import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    section: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.semibold,
        marginBottom: spacing.lg,
    },
    imageGroup: {
        marginBottom: spacing.xl,
    },
    label: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
        marginBottom: 4,
    },
    hint: {
        fontSize: typography.sizes.xs,
        marginBottom: spacing.md,
    },
});
