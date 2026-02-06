import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm + 4,
    },
    iconBadge: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: '700',
    },
    sectionSubtitle: {
        fontSize: typography.sizes.xs,
        marginTop: 2,
    },
    seeAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    seeAllText: {
        fontSize: typography.sizes.sm,
        fontWeight: '600',
    },
    carouselContainer: {
        marginTop: spacing.sm,
    },
    loadingContainer: {
        height: 280,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
