import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xl,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
        gap: spacing.md,
    },
    errorText: {
        fontSize: typography.sizes.base,
        textAlign: 'center',
    },
    retryButton: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: spacing.sm,
        marginTop: spacing.md,
    },
    retryText: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
    },
    backButton: {
        position: 'absolute',
        top: spacing.md,
        left: spacing.md,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    contentContainer: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
    },
    mainContent: {
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
    },
    categoriesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginBottom: spacing.sm,
    },
    categoryBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: spacing.lg,
    },
    categoryText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.medium,
    },
    title: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        marginBottom: spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    infoText: {
        fontSize: typography.sizes.sm,
        flex: 1,
    },
    locationText: {
        fontSize: typography.sizes.sm,
        flex: 1,
    },
    section: {
        marginTop: spacing.lg,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.semibold,
        marginBottom: spacing.sm,
    },
    descriptionText: {
        fontSize: typography.sizes.base,
        lineHeight: 24,
    },
    readMoreText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
        marginTop: spacing.xs,
    },
    authorText: {
        fontSize: typography.sizes.xs,
        marginTop: spacing.sm,
    },
});
