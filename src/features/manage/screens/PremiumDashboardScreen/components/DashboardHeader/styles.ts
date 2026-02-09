import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    header: {
        paddingHorizontal: spacing.sm,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
    },
    headerContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.xs,
    },
    headerTitle: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.fontWeights.bold,
    },
    headerSubtitle: {
        fontSize: typography.sizes.sm,
        lineHeight: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginTop: spacing.md,
        borderRadius: 12,
        padding: 2,
        gap: 2,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.sm,
        paddingHorizontal: 4,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 4,
    },
    tabActive: {},
    tabText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
        flexShrink: 1,
    },
    tabTextActive: {
        fontWeight: typography.fontWeights.bold,
    },
});
