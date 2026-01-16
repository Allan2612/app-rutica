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
    dateRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
});
