import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    listSection: {
        width: '100%',
        maxWidth: 600,
        marginTop: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.semibold,
        marginBottom: spacing.md,
    },
    contactTypesList: {
        gap: spacing.sm,
    },
    contactTypeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        padding: spacing.md,
        gap: spacing.md,
    },
    contactTypeIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactTypeInfo: {
        flex: 1,
    },
    contactTypeName: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    contactTypeCount: {
        alignItems: 'flex-end',
    },
    contactTypeValue: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.bold,
    },
    contactTypeLabel: {
        fontSize: typography.sizes.xs,
    },
});
