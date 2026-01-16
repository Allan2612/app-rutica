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
    inputGroup: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
        marginBottom: spacing.sm,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        fontSize: typography.sizes.sm,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    error: {
        fontSize: typography.sizes.xs,
        marginTop: 4,
    },
});
