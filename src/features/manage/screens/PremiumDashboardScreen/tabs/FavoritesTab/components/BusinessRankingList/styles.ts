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
    businessList: {
        gap: spacing.sm,
    },
    businessCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        padding: spacing.md,
        gap: spacing.md,
    },
    rankBadge: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rankText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.bold,
    },
    businessLogo: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    businessInfo: {
        flex: 1,
    },
    businessName: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    favoriteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    favoriteCount: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
    },
});
